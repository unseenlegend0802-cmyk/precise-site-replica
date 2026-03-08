import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { User, FileText, LogOut, Loader2, Calendar, Heart, Bell, Stethoscope } from "lucide-react";
import ProfileTab from "@/components/dashboard/patient/ProfileTab";
import AppointmentsTab from "@/components/dashboard/patient/AppointmentsTab";
import ReportsTab from "@/components/dashboard/patient/ReportsTab";
import ConsultationHistoryTab from "@/components/dashboard/patient/ConsultationHistoryTab";
import NotificationsTab from "@/components/dashboard/patient/NotificationsTab";

interface Profile {
  full_name: string;
  age: number | null;
  gender: string;
  blood_group: string;
  medical_history: string;
  allergies: string;
  current_medications: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  preferred_language: string;
}

interface ScanReport {
  id: string;
  file_name: string;
  summary: string;
  detected_conditions: string[];
  created_at: string;
}

const defaultProfile: Profile = {
  full_name: "", age: null, gender: "", blood_group: "",
  medical_history: "", allergies: "", current_medications: "",
  emergency_contact_name: "", emergency_contact_phone: "", preferred_language: "",
};

const PatientDashboard = () => {
  const { user, loading: authLoading, signOut, roleLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [reports, setReports] = useState<ScanReport[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [user, authLoading, navigate]);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoadingData(true);
    const [profileRes, reportsRes, apptRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("scan_reports").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("appointments").select("*").eq("user_id", user.id).order("appointment_date", { ascending: false }),
    ]);
    if (profileRes.data) {
      const d = profileRes.data;
      setProfile({
        full_name: d.full_name || user.user_metadata?.full_name || "",
        age: d.age, gender: d.gender || "", blood_group: d.blood_group || "",
        medical_history: d.medical_history || "", allergies: d.allergies || "",
        current_medications: d.current_medications || "",
        emergency_contact_name: d.emergency_contact_name || "",
        emergency_contact_phone: d.emergency_contact_phone || "",
        preferred_language: d.preferred_language || "",
      });
    } else {
      setProfile({ ...defaultProfile, full_name: user.user_metadata?.full_name || "" });
    }
    if (reportsRes.data) setReports(reportsRes.data as ScanReport[]);
    if (apptRes.data) setAppointments(apptRes.data);
    setLoadingData(false);
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { data: existing } = await supabase.from("profiles").select("id").eq("user_id", user.id).maybeSingle();
      if (existing) {
        const { error } = await supabase.from("profiles").update({ ...profile }).eq("user_id", user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("profiles").insert({ user_id: user.id, ...profile });
        if (error) throw error;
      }
      toast({ title: "Profile saved" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loadingData || roleLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const upcomingCount = appointments.filter(
    (a) => a.status !== "cancelled" && new Date(a.appointment_date) >= new Date(new Date().toDateString())
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">Hello, <span className="text-gradient">{profile.full_name || "there"}</span></h1>
                <Badge variant="outline" className="border-primary/40 text-primary text-xs">Patient</Badge>
              </div>
              <p className="text-muted-foreground text-sm mt-1">{user?.email || user?.phone}</p>
            </div>
            <Button variant="outline" onClick={async () => { await signOut(); navigate("/"); }} className="gap-2">
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Calendar className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{upcomingCount}</p>
                  <p className="text-xs text-muted-foreground">Upcoming</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Stethoscope className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{appointments.length}</p>
                  <p className="text-xs text-muted-foreground">Total Visits</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="profile" className="mt-2">
            <TabsList className="mb-6 flex-wrap h-auto gap-1">
              <TabsTrigger value="profile" className="gap-2"><User className="w-4 h-4" /> Profile</TabsTrigger>
              <TabsTrigger value="appointments" className="gap-2"><Calendar className="w-4 h-4" /> Appointments</TabsTrigger>
              <TabsTrigger value="reports" className="gap-2"><FileText className="w-4 h-4" /> Reports ({reports.length})</TabsTrigger>
              <TabsTrigger value="history" className="gap-2"><Stethoscope className="w-4 h-4" /> History</TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2"><Bell className="w-4 h-4" /> Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileTab profile={profile} setProfile={setProfile} saving={saving} onSave={saveProfile} />
            </TabsContent>

            <TabsContent value="appointments">
              <AppointmentsTab appointments={appointments} onRefresh={loadData} />
            </TabsContent>

            <TabsContent value="reports">
              <ReportsTab reports={reports} />
            </TabsContent>

            <TabsContent value="history">
              <ConsultationHistoryTab appointments={appointments} />
            </TabsContent>

            <TabsContent value="notifications">
              {user && <NotificationsTab userId={user.id} />}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PatientDashboard;
