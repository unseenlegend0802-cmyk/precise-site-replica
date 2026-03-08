import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { LogOut, Loader2, Calendar, Users, Activity, Stethoscope } from "lucide-react";

const DoctorDashboard = () => {
  const { user, loading: authLoading, signOut, roleLoading } = useAuth();
  const navigate = useNavigate();
  const [loadingData, setLoadingData] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoadingData(true);
      // Doctors can see appointments assigned to them (by doctor_name match for now)
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileData?.full_name) {
        const { data } = await supabase
          .from("appointments")
          .select("*")
          .eq("doctor_name", profileData.full_name)
          .order("appointment_date", { ascending: true });
        if (data) setAppointments(data);
      }
      setLoadingData(false);
    };
    load();
  }, [user]);

  if (authLoading || loadingData || roleLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const upcomingAppts = appointments.filter(a => new Date(a.appointment_date) >= new Date());

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">Doctor <span className="text-gradient">Dashboard</span></h1>
                <Badge variant="outline" className="border-primary/40 text-primary text-xs">Doctor</Badge>
              </div>
              <p className="text-muted-foreground text-sm mt-1">{user?.email || user?.phone}</p>
            </div>
            <Button variant="outline" onClick={async () => { await signOut(); navigate("/"); }} className="gap-2">
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Calendar className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{upcomingAppts.length}</p>
                  <p className="text-xs text-muted-foreground">Upcoming Appointments</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{appointments.length}</p>
                  <p className="text-xs text-muted-foreground">Total Patients</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Activity className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">—</p>
                  <p className="text-xs text-muted-foreground">Procedures Done</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Stethoscope className="w-5 h-5 text-primary" /> Your Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingAppts.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No upcoming appointments.</p>
              ) : (
                <div className="space-y-3">
                  {upcomingAppts.map((a) => (
                    <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div>
                        <p className="font-medium">{a.patient_name || "Patient"}</p>
                        <p className="text-sm text-muted-foreground">{a.medical_issue || "General consultation"}</p>
                        <p className="text-xs text-muted-foreground mt-1">{a.appointment_date} · {a.time_slot}</p>
                      </div>
                      <Badge variant={a.status === "confirmed" ? "default" : "secondary"}>{a.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DoctorDashboard;
