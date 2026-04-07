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
import {
  User, FileText, LogOut, Loader2, Calendar, Heart, Bell,
  Stethoscope, Clock, Activity, LayoutDashboard,
} from "lucide-react";
import ProfileTab from "@/components/dashboard/patient/ProfileTab";
import AppointmentsTab from "@/components/dashboard/patient/AppointmentsTab";
import ReportsTab from "@/components/dashboard/patient/ReportsTab";
import ConsultationHistoryTab from "@/components/dashboard/patient/ConsultationHistoryTab";
import NotificationsTab from "@/components/dashboard/patient/NotificationsTab";
import TreatmentsTab from "@/components/dashboard/patient/TreatmentsTab";
import FollowUpsTab from "@/components/dashboard/patient/FollowUpsTab";
import MedicalTimelineTab from "@/components/dashboard/patient/MedicalTimelineTab";
import NextActionCard from "@/components/dashboard/patient/NextActionCard";
import JourneyTimeline from "@/components/dashboard/patient/JourneyTimeline";
import QuickStatsBar from "@/components/dashboard/patient/QuickStatsBar";
import MyDoctorsModule from "@/components/dashboard/patient/MyDoctorsModule";
import RecommendedTreatmentsModule from "@/components/dashboard/patient/RecommendedTreatmentsModule";
import InsurancePaymentsModule from "@/components/dashboard/patient/InsurancePaymentsModule";

type PatientStage =
  | "new"
  | "report_uploaded"
  | "doctor_selected"
  | "op_booked"
  | "op_completed"
  | "procedure_recommended"
  | "ip_booked"
  | "ip_completed"
  | "followup_due"
  | "completed";

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
  patient_stage: PatientStage;
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
  patient_stage: "new",
};

/** Compute what stage the patient should be in based on their data */
function computeStage(
  currentStage: PatientStage,
  reports: ScanReport[],
  appointments: any[]
): PatientStage {
  const hasReports = reports.length > 0;
  const hasBookedAppts = appointments.some((a) => ["pending", "confirmed", "rescheduled"].includes(a.status));
  const hasCompletedAppts = appointments.some((a) => a.status === "completed");
  const hasConsultationNotes = appointments.some((a) => a.consultation_notes);
  const hasFutureAppts = appointments.some(
    (a) => a.status === "confirmed" && new Date(a.appointment_date) >= new Date(new Date().toDateString())
  );

  // Auto-advance logic (only forward, never backward)
  if (hasConsultationNotes && currentStage === "op_completed") return "procedure_recommended";
  if (hasCompletedAppts && ["op_booked", "doctor_selected"].includes(currentStage)) return "op_completed";
  if (hasBookedAppts && ["doctor_selected", "report_uploaded"].includes(currentStage)) return "op_booked";
  if (hasReports && currentStage === "new") return "report_uploaded";

  // If followup_due and there's a future appointment, keep followup_due
  if (currentStage === "ip_completed" && hasFutureAppts) return "followup_due";

  return currentStage;
}

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

    let loadedStage: PatientStage = "new";

    if (profileRes.data) {
      const d = profileRes.data;
      loadedStage = (d.patient_stage as PatientStage) || "new";
      setProfile({
        full_name: d.full_name || user.user_metadata?.full_name || "",
        age: d.age, gender: d.gender || "", blood_group: d.blood_group || "",
        medical_history: d.medical_history || "", allergies: d.allergies || "",
        current_medications: d.current_medications || "",
        emergency_contact_name: d.emergency_contact_name || "",
        emergency_contact_phone: d.emergency_contact_phone || "",
        preferred_language: d.preferred_language || "",
        patient_stage: loadedStage,
      });
    } else {
      setProfile({ ...defaultProfile, full_name: user.user_metadata?.full_name || "" });
    }

    const loadedReports = (reportsRes.data as ScanReport[]) || [];
    const loadedAppointments = apptRes.data || [];
    setReports(loadedReports);
    setAppointments(loadedAppointments);

    // Auto-advance stage
    const computedStage = computeStage(loadedStage, loadedReports, loadedAppointments);
    if (computedStage !== loadedStage) {
      setProfile((p) => ({ ...p, patient_stage: computedStage }));
      // Persist stage update
      await supabase.from("profiles").update({ patient_stage: computedStage }).eq("user_id", user.id);
    }

    setLoadingData(false);
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  // Realtime subscription for live updates
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("patient-dashboard-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "appointments", filter: `user_id=eq.${user.id}` }, () => loadData())
      .on("postgres_changes", { event: "*", schema: "public", table: "scan_reports", filter: `user_id=eq.${user.id}` }, () => loadData())
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, () => loadData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, loadData]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { patient_stage, ...profileData } = profile;
      const { data: existing } = await supabase.from("profiles").select("id").eq("user_id", user.id).maybeSingle();
      if (existing) {
        const { error } = await supabase.from("profiles").update({ ...profileData, patient_stage }).eq("user_id", user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("profiles").insert({ user_id: user.id, ...profileData, patient_stage });
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
    (a) => a.status !== "cancelled" && a.status !== "rejected" && new Date(a.appointment_date) >= new Date(new Date().toDateString())
  ).length;

  const completedCount = appointments.filter((a) => a.status === "completed").length;

  const uniqueDoctors = new Set(
    appointments.filter((a) => a.status !== "cancelled").map((a) => a.doctor_name)
  ).size;

  const detectedCondition = reports.length > 0 ? reports[0].detected_conditions?.[0] : undefined;

  const stageLabels: Record<PatientStage, string> = {
    new: "Getting Started",
    report_uploaded: "Report Analyzed",
    doctor_selected: "Doctor Selected",
    op_booked: "Consultation Booked",
    op_completed: "Consultation Complete",
    procedure_recommended: "Procedure Recommended",
    ip_booked: "Admission Booked",
    ip_completed: "Procedure Complete",
    followup_due: "Follow-Up Due",
    completed: "Journey Complete",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Welcome Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  Welcome back, <span className="text-gradient">{profile.full_name || "there"}</span>
                </h1>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="border-primary/40 text-primary text-xs">{stageLabels[profile.patient_stage]}</Badge>
                {detectedCondition && (
                  <Badge variant="outline" className="text-xs border-muted-foreground/30">{detectedCondition}</Badge>
                )}
              </div>
              <p className="text-muted-foreground text-xs mt-1">{user?.email || user?.phone}</p>
            </div>
            <Button variant="outline" onClick={async () => { await signOut(); navigate("/"); }} className="gap-2">
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </motion.div>

          {/* Next Action Card */}
          <NextActionCard stage={profile.patient_stage} conditionName={detectedCondition} />

          {/* Journey Timeline */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <JourneyTimeline currentStage={profile.patient_stage} />
          </motion.div>

          {/* Quick Stats */}
          <QuickStatsBar
            reportsCount={reports.length}
            upcomingCount={upcomingCount}
            doctorsCount={uniqueDoctors}
            completedCount={completedCount}
          />

          {/* Tabs */}
          <Tabs defaultValue="overview" className="mt-2">
            <TabsList className="mb-6 flex-wrap h-auto gap-1">
              <TabsTrigger value="overview" className="gap-2"><LayoutDashboard className="w-4 h-4" /> Overview</TabsTrigger>
              <TabsTrigger value="appointments" className="gap-2"><Calendar className="w-4 h-4" /> Appointments ({upcomingCount})</TabsTrigger>
              <TabsTrigger value="reports" className="gap-2"><FileText className="w-4 h-4" /> Reports ({reports.length})</TabsTrigger>
              <TabsTrigger value="treatments" className="gap-2"><Heart className="w-4 h-4" /> Treatments</TabsTrigger>
              <TabsTrigger value="followups" className="gap-2"><Clock className="w-4 h-4" /> Follow-ups</TabsTrigger>
              <TabsTrigger value="timeline" className="gap-2"><Activity className="w-4 h-4" /> Timeline</TabsTrigger>
              <TabsTrigger value="profile" className="gap-2"><User className="w-4 h-4" /> Profile</TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2"><Bell className="w-4 h-4" /> Notifications</TabsTrigger>
            </TabsList>

            {/* Overview Tab - Smart Dashboard Home */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MyDoctorsModule appointments={appointments} />
                <RecommendedTreatmentsModule reports={reports} appointments={appointments} />
                <InsurancePaymentsModule stage={profile.patient_stage} />
                {/* Quick Follow-ups */}
                <FollowUpsTab appointments={appointments} />
              </div>
            </TabsContent>

            <TabsContent value="appointments">
              <AppointmentsTab appointments={appointments} onRefresh={loadData} />
            </TabsContent>

            <TabsContent value="reports">
              <ReportsTab reports={reports} />
            </TabsContent>

            <TabsContent value="treatments">
              <TreatmentsTab appointments={appointments} />
            </TabsContent>

            <TabsContent value="followups">
              <FollowUpsTab appointments={appointments} />
            </TabsContent>

            <TabsContent value="timeline">
              <MedicalTimelineTab appointments={appointments} reports={reports} />
            </TabsContent>

            <TabsContent value="profile">
              <ProfileTab profile={profile} setProfile={setProfile} saving={saving} onSave={saveProfile} />
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
