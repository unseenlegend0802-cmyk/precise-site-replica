import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { LogOut, Loader2, Calendar, Users, User, FileText, ClipboardList, Clock } from "lucide-react";
import DoctorProfileTab from "@/components/dashboard/doctor/DoctorProfileTab";
import DoctorAppointmentsTab from "@/components/dashboard/doctor/DoctorAppointmentsTab";
import PatientReportsTab from "@/components/dashboard/doctor/PatientReportsTab";
import ConsultationNotesTab from "@/components/dashboard/doctor/ConsultationNotesTab";
import AvailabilityTab from "@/components/dashboard/doctor/AvailabilityTab";

const DoctorDashboard = () => {
  const { user, loading: authLoading, signOut, roleLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loadingData, setLoadingData] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctorRecord, setDoctorRecord] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [user, authLoading, navigate]);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoadingData(true);

    // Find doctor record by matching email or profile name
    const { data: profileData } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", user.id)
      .maybeSingle();

    const doctorName = profileData?.full_name || "";

    // Try to find doctor record by email first, then by name
    let doctor = null;
    if (user.email) {
      const { data } = await supabase
        .from("doctors")
        .select("*")
        .eq("email", user.email)
        .maybeSingle();
      doctor = data;
    }
    if (!doctor && doctorName) {
      const { data } = await supabase
        .from("doctors")
        .select("*")
        .eq("name", doctorName)
        .maybeSingle();
      doctor = data;
    }
    setDoctorRecord(doctor);

    // Fetch appointments for this doctor
    const matchName = doctor?.name || doctorName;
    if (matchName) {
      const { data } = await supabase
        .from("appointments")
        .select("*")
        .eq("doctor_name", matchName)
        .order("appointment_date", { ascending: false });
      if (data) setAppointments(data);
    }

    setLoadingData(false);
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  if (authLoading || loadingData || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const today = new Date(new Date().toDateString());
  const upcomingCount = appointments.filter(
    (a) => a.status !== "cancelled" && new Date(a.appointment_date) >= today
  ).length;
  const totalPatients = new Set(appointments.map((a) => a.user_id)).size;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">
                  Dr. <span className="text-gradient">{doctorRecord?.name || "Doctor"}</span>
                </h1>
                <Badge variant="outline" className="border-primary/40 text-primary text-xs">Doctor</Badge>
              </div>
              <p className="text-muted-foreground text-sm mt-1">
                {doctorRecord?.specialization || user?.email}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => { const tab = document.querySelector('[data-state="active"]'); const tabsEl = document.querySelector('[role="tablist"]'); }} className="gap-2 hidden">placeholder</Button>
              <Tabs defaultValue="appointments" className="w-full">
                {/* Profile button moved to header */}
              </Tabs>
            </div>
            <div className="flex items-center gap-3">
              <TabsTrigger value="profile" className="gap-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-md text-sm font-medium">
                <User className="w-4 h-4" /> Profile
              </TabsTrigger>
              <Button variant="outline" onClick={async () => { await signOut(); navigate("/"); }} className="gap-2">
                <LogOut className="w-4 h-4" /> Sign Out
              </Button>
            </div>

            <TabsContent value="appointments">
              <DoctorAppointmentsTab appointments={appointments} onRefresh={loadData} />
            </TabsContent>

            <TabsContent value="profile">
              <DoctorProfileTab userId={user!.id} doctorRecord={doctorRecord} onUpdate={loadData} />
            </TabsContent>

            <TabsContent value="reports">
              <PatientReportsTab appointments={appointments} />
            </TabsContent>

            <TabsContent value="notes">
              <ConsultationNotesTab appointments={appointments} onRefresh={loadData} />
            </TabsContent>

            <TabsContent value="availability">
              <AvailabilityTab userId={user!.id} doctorId={doctorRecord?.id || null} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DoctorDashboard;
