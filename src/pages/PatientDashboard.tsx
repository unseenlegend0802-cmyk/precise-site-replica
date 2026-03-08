import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { User, FileText, LogOut, Loader2, Save, Calendar, Heart, Activity } from "lucide-react";

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

  useEffect(() => {
    if (!user) return;
    const load = async () => {
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
    };
    load();
  }, [user]);

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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Calendar className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{appointments.length}</p>
                  <p className="text-xs text-muted-foreground">Appointments</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <FileText className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{reports.length}</p>
                  <p className="text-xs text-muted-foreground">Scan Reports</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Heart className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{profile.blood_group || "—"}</p>
                  <p className="text-xs text-muted-foreground">Blood Group</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="profile" className="mt-2">
            <TabsList className="mb-6">
              <TabsTrigger value="profile" className="gap-2"><User className="w-4 h-4" /> Profile</TabsTrigger>
              <TabsTrigger value="appointments" className="gap-2"><Calendar className="w-4 h-4" /> Appointments</TabsTrigger>
              <TabsTrigger value="reports" className="gap-2"><FileText className="w-4 h-4" /> Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Medical Profile</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { label: "Full Name", key: "full_name", type: "text" },
                      { label: "Age", key: "age", type: "number" },
                      { label: "Gender", key: "gender", type: "text" },
                      { label: "Blood Group", key: "blood_group", type: "text" },
                      { label: "Emergency Contact Name", key: "emergency_contact_name", type: "text" },
                      { label: "Emergency Contact Phone", key: "emergency_contact_phone", type: "tel" },
                      { label: "Preferred Language", key: "preferred_language", type: "text" },
                    ].map((f) => (
                      <div key={f.key} className="space-y-1.5">
                        <Label htmlFor={f.key}>{f.label}</Label>
                        <Input id={f.key} type={f.type} value={(profile as any)[f.key] ?? ""} onChange={(e) => setProfile((p) => ({ ...p, [f.key]: f.type === "number" ? (e.target.value ? Number(e.target.value) : null) : e.target.value }))} />
                      </div>
                    ))}
                  </div>
                  <div className="grid gap-4 mt-4">
                    {[{ label: "Medical History", key: "medical_history" }, { label: "Allergies", key: "allergies" }, { label: "Current Medications", key: "current_medications" }].map((f) => (
                      <div key={f.key} className="space-y-1.5">
                        <Label htmlFor={f.key}>{f.label}</Label>
                        <textarea id={f.key} rows={2} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={(profile as any)[f.key] || ""} onChange={(e) => setProfile((p) => ({ ...p, [f.key]: e.target.value }))} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Button onClick={saveProfile} disabled={saving} className="gap-2">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appointments">
              {appointments.length === 0 ? (
                <Card><CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No appointments yet.</p>
                  <Button asChild><Link to="/book-appointment">Book Appointment</Link></Button>
                </CardContent></Card>
              ) : (
                <div className="space-y-3">
                  {appointments.map((a) => (
                    <Card key={a.id} className="hover:border-primary/30 transition-colors">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium">{a.doctor_name}</p>
                          <p className="text-sm text-muted-foreground">{a.hospital_name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{a.appointment_date} · {a.time_slot}</p>
                        </div>
                        <Badge variant={a.status === "confirmed" ? "default" : "secondary"}>{a.status}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="reports">
              {reports.length === 0 ? (
                <Card><CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No scan reports yet.</p>
                  <Button asChild><Link to="/scan-report">Scan Your First Report</Link></Button>
                </CardContent></Card>
              ) : (
                <div className="space-y-3">
                  {reports.map((r) => (
                    <Card key={r.id} className="hover:border-primary/30 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <FileText className="w-4 h-4 text-primary shrink-0" />
                              <p className="font-medium truncate">{r.file_name || "Report"}</p>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{r.summary}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {r.detected_conditions?.map((c) => (
                                <Badge key={c} variant="outline" className="text-xs border-primary/40 text-primary">{c}</Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(r.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PatientDashboard;
