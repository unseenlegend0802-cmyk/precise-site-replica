import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { LogOut, Loader2, Users, Calendar, FileText, Stethoscope, ShieldCheck } from "lucide-react";

const AdminDashboard = () => {
  const { user, loading: authLoading, signOut, roleLoading } = useAuth();
  const navigate = useNavigate();
  const [loadingData, setLoadingData] = useState(true);
  const [stats, setStats] = useState({ users: 0, appointments: 0, reports: 0, doctors: 0 });
  const [appointments, setAppointments] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoadingData(true);
      const [apptRes, reportRes, doctorRes] = await Promise.all([
        supabase.from("appointments").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("scan_reports").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("doctors").select("id"),
      ]);

      const appts = apptRes.data || [];
      const reps = reportRes.data || [];

      setAppointments(appts);
      setReports(reps);
      setStats({
        users: new Set([...appts.map(a => a.user_id), ...reps.map(r => r.user_id)]).size,
        appointments: appts.length,
        reports: reps.length,
        doctors: doctorRes.data?.length || 0,
      });
      setLoadingData(false);
    };
    load();
  }, [user]);

  if (authLoading || loadingData || roleLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">Admin <span className="text-gradient">Dashboard</span></h1>
                <Badge variant="outline" className="border-primary/40 text-primary text-xs flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Admin
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm mt-1">{user?.email}</p>
            </div>
            <Button variant="outline" onClick={async () => { await signOut(); navigate("/"); }} className="gap-2">
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Users, label: "Total Users", value: stats.users },
              { icon: Calendar, label: "Appointments", value: stats.appointments },
              { icon: FileText, label: "Scan Reports", value: stats.reports },
              { icon: Stethoscope, label: "Doctors", value: stats.doctors },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="p-4 flex items-center gap-3">
                  <s.icon className="w-8 h-8 text-primary shrink-0" />
                  <div>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Data Tabs */}
          <Tabs defaultValue="appointments">
            <TabsList className="mb-6">
              <TabsTrigger value="appointments" className="gap-2"><Calendar className="w-4 h-4" /> Appointments</TabsTrigger>
              <TabsTrigger value="reports" className="gap-2"><FileText className="w-4 h-4" /> Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="appointments">
              <Card>
                <CardHeader><CardTitle>Recent Appointments</CardTitle></CardHeader>
                <CardContent>
                  {appointments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-6">No appointments found.</p>
                  ) : (
                    <div className="space-y-3">
                      {appointments.slice(0, 20).map((a) => (
                        <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                          <div>
                            <p className="font-medium">{a.patient_name || "—"}</p>
                            <p className="text-sm text-muted-foreground">Dr. {a.doctor_name} · {a.hospital_name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{a.appointment_date} · {a.time_slot}</p>
                          </div>
                          <Badge variant={a.status === "confirmed" ? "default" : "secondary"}>{a.status}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <Card>
                <CardHeader><CardTitle>Recent Scan Reports</CardTitle></CardHeader>
                <CardContent>
                  {reports.length === 0 ? (
                    <p className="text-muted-foreground text-center py-6">No reports found.</p>
                  ) : (
                    <div className="space-y-3">
                      {reports.slice(0, 20).map((r) => (
                        <div key={r.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                          <div>
                            <p className="font-medium">{r.file_name || "Report"}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">{r.summary}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {r.detected_conditions?.slice(0, 3).map((c: string) => (
                                <Badge key={c} variant="outline" className="text-xs border-primary/40 text-primary">{c}</Badge>
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground shrink-0">{new Date(r.created_at).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
