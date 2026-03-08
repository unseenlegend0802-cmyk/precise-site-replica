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
import {
  User, FileText, LogOut, Loader2, Save, Calendar, Activity, AlertTriangle
} from "lucide-react";
import AdminDashboardPanel from "@/components/dashboard/AdminDashboardPanel";
import DoctorDashboardPanel from "@/components/dashboard/DoctorDashboardPanel";

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
  analysis_result: any;
}

const defaultProfile: Profile = {
  full_name: "",
  age: null,
  gender: "",
  blood_group: "",
  medical_history: "",
  allergies: "",
  current_medications: "",
  emergency_contact_name: "",
  emergency_contact_phone: "",
  preferred_language: "",
};

const Dashboard = () => {
  const { user, loading: authLoading, signOut, role, roleLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [reports, setReports] = useState<ScanReport[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoadingData(true);
      // Load profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileData) {
        setProfile({
          full_name: profileData.full_name || user.user_metadata?.full_name || "",
          age: profileData.age,
          gender: profileData.gender || "",
          blood_group: profileData.blood_group || "",
          medical_history: profileData.medical_history || "",
          allergies: profileData.allergies || "",
          current_medications: profileData.current_medications || "",
          emergency_contact_name: profileData.emergency_contact_name || "",
          emergency_contact_phone: profileData.emergency_contact_phone || "",
          preferred_language: profileData.preferred_language || "",
        });
      } else {
        setProfile({ ...defaultProfile, full_name: user.user_metadata?.full_name || "" });
      }

      // Load scan reports
      const { data: reportsData } = await supabase
        .from("scan_reports")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (reportsData) setReports(reportsData as ScanReport[]);
      setLoadingData(false);
    };
    load();
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("profiles")
          .update({ ...profile })
          .eq("user_id", user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("profiles")
          .insert({ user_id: user.id, ...profile });
        if (error) throw error;
      }
      toast({ title: "Profile saved" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || loadingData || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const roleLabel = role === "admin" ? "Admin" : role === "doctor" ? "Doctor" : "Patient";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">
                  Hello, <span className="text-gradient">{profile.full_name || "there"}</span>
                </h1>
                <Badge variant="outline" className="border-primary/40 text-primary text-xs">{roleLabel}</Badge>
              </div>
              <p className="text-muted-foreground text-sm mt-1">{user?.email || user?.phone}</p>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="gap-2">
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </motion.div>

          {/* Role-specific panels */}
          {role === "admin" && <AdminDashboardPanel />}
          {role === "doctor" && <DoctorDashboardPanel />}

          <Tabs defaultValue="profile" className="mt-6">
            <TabsList className="mb-6">
              <TabsTrigger value="profile" className="gap-2"><User className="w-4 h-4" /> Profile</TabsTrigger>
              <TabsTrigger value="reports" className="gap-2"><FileText className="w-4 h-4" /> Reports ({reports.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Medical Profile</CardTitle>
                </CardHeader>
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
                        <Input
                          id={f.key}
                          type={f.type}
                          value={(profile as any)[f.key] ?? ""}
                          onChange={(e) =>
                            setProfile((p) => ({
                              ...p,
                              [f.key]: f.type === "number" ? (e.target.value ? Number(e.target.value) : null) : e.target.value,
                            }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <div className="grid sm:grid-cols-1 gap-4 mt-4">
                    {[
                      { label: "Medical History", key: "medical_history" },
                      { label: "Allergies", key: "allergies" },
                      { label: "Current Medications", key: "current_medications" },
                    ].map((f) => (
                      <div key={f.key} className="space-y-1.5">
                        <Label htmlFor={f.key}>{f.label}</Label>
                        <textarea
                          id={f.key}
                          rows={2}
                          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          value={(profile as any)[f.key] || ""}
                          onChange={(e) => setProfile((p) => ({ ...p, [f.key]: e.target.value }))}
                        />
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

            <TabsContent value="reports">
              {reports.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No scan reports yet.</p>
                    <Button asChild><Link to="/scan-report">Scan Your First Report</Link></Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {reports.map((r) => (
                    <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <Card className="hover:border-primary/30 transition-colors">
                        <CardContent className="p-5">
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
                            <div className="text-right shrink-0">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                {new Date(r.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
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

export default Dashboard;
