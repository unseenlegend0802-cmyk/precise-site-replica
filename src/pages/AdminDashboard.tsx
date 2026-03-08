import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Loader2, Users, Calendar, FileText, Stethoscope,
  ShieldCheck, Plus, Trash2, TrendingUp,
} from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

interface DoctorRow {
  id: string;
  name: string;
  slug: string;
  specialization: string | null;
  qualification: string | null;
  image_url: string | null;
  hospital_name: string | null;
  consultation_fee: string | null;
}

const AdminDashboard = () => {
  const { user, loading: authLoading, signOut, roleLoading } = useAuth();
  const navigate = useNavigate();
  const [loadingData, setLoadingData] = useState(true);
  const [stats, setStats] = useState({ monthlyBookings: 0, totalBookings: 0, totalUsers: 0, totalDoctors: 0 });
  const [doctors, setDoctors] = useState<DoctorRow[]>([]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [user, authLoading, navigate]);

  const loadData = async () => {
    if (!user) return;
    setLoadingData(true);

    const now = new Date();
    const startOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

    const [allAppts, monthlyAppts, profilesRes, doctorsRes] = await Promise.all([
      supabase.from("appointments").select("id", { count: "exact", head: true }),
      supabase.from("appointments").select("id", { count: "exact", head: true }).gte("appointment_date", startOfMonth),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("doctors").select("id, name, slug, specialization, qualification, image_url, hospital_name, consultation_fee").order("created_at", { ascending: false }),
    ]);

    setStats({
      totalBookings: allAppts.count || 0,
      monthlyBookings: monthlyAppts.count || 0,
      totalUsers: profilesRes.count || 0,
      totalDoctors: doctorsRes.data?.length || 0,
    });
    setDoctors((doctorsRes.data as DoctorRow[]) || []);
    setLoadingData(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleDeleteDoctor = async (doctor: DoctorRow) => {
    const { error } = await supabase.from("doctors").delete().eq("id", doctor.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Doctor Removed", description: `${doctor.name} has been removed successfully.` });
      setDoctors((prev) => prev.filter((d) => d.id !== doctor.id));
      setStats((prev) => ({ ...prev, totalDoctors: prev.totalDoctors - 1 }));
    }
  };

  if (authLoading || loadingData || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    { icon: TrendingUp, label: "Monthly Bookings", value: stats.monthlyBookings, color: "text-green-400" },
    { icon: Calendar, label: "Total Bookings", value: stats.totalBookings, color: "text-blue-400" },
    { icon: Users, label: "Total Users", value: stats.totalUsers, color: "text-orange-400" },
    { icon: Stethoscope, label: "Total Doctors", value: stats.totalDoctors, color: "text-purple-400" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">Admin <span className="text-primary">Dashboard</span></h1>
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

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {statCards.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="border-border">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-muted">
                      <s.icon className={`w-6 h-6 ${s.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Doctor Management */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Doctor Management</h2>
              <Button onClick={() => navigate("/admin/add-doctor")} className="gap-2">
                <Plus className="w-4 h-4" /> Add New Doctor
              </Button>
            </div>

            {doctors.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Stethoscope className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No doctors found. Add your first doctor to get started.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence>
                  {doctors.map((doc) => (
                    <motion.div
                      key={doc.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <Card className="overflow-hidden border-border hover:border-primary/40 transition-colors group">
                        <div className="aspect-[3/4] overflow-hidden bg-muted relative">
                          {doc.image_url ? (
                            <img src={doc.image_url} alt={doc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Avatar className="w-24 h-24">
                                <AvatarFallback className="text-3xl bg-primary/20 text-primary">
                                  {doc.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          )}
                        </div>
                        <div className="p-4 space-y-1">
                          <h3 className="font-semibold text-foreground">{doc.name}</h3>
                          {doc.qualification && <p className="text-xs text-muted-foreground">{doc.qualification}</p>}
                          {doc.specialization && <p className="text-xs text-primary">{doc.specialization}</p>}
                          {doc.hospital_name && <p className="text-xs text-muted-foreground">{doc.hospital_name}</p>}
                          {doc.consultation_fee && (
                            <p className="text-xs font-medium text-foreground">Fee: {doc.consultation_fee}</p>
                          )}

                          <div className="flex gap-2 pt-2">
                            <Link
                              to={`/doctor/${doc.slug}`}
                              className="flex-1 text-center text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md font-medium hover:opacity-90 transition-opacity"
                            >
                              View Profile →
                            </Link>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm" className="gap-1 text-xs">
                                  <Trash2 className="w-3 h-3" /> Remove
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure you want to remove this doctor?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete <strong>{doc.name}</strong> from the platform. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteDoctor(doc)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Remove Doctor
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
