import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Loader2, Users, Calendar, Stethoscope,
  ShieldCheck, Plus, Trash2, TrendingUp, Search, X,
  MapPin, GraduationCap, IndianRupee, Clock, Globe,
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { getDoctorImage } from "@/utils/doctorImages";
import { featuredDoctors } from "@/data/featuredDoctors";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import InviteDoctorDialog from "@/components/admin/InviteDoctorDialog";
import DoctorInvitesTable from "@/components/admin/DoctorInvitesTable";

interface DoctorRow {
  id: string;
  name: string;
  slug: string;
  specialization: string | null;
  qualification: string | null;
  image_url: string | null;
  hospital_name: string | null;
  consultation_fee: string | null;
  experience: string | null;
  bio: string | null;
  email: string | null;
  languages: string[] | null;
}

const AdminDashboard = () => {
  const { user, loading: authLoading, signOut, roleLoading } = useAuth();
  const navigate = useNavigate();
  const [loadingData, setLoadingData] = useState(true);
  const [stats, setStats] = useState({ monthlyBookings: 0, totalBookings: 0, totalUsers: 0, totalDoctors: 0 });
  const [doctors, setDoctors] = useState<DoctorRow[]>([]);
  const [search, setSearch] = useState("");
  const [filterCity, setFilterCity] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorRow | null>(null);
  const [invites, setInvites] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [user, authLoading, navigate]);

  const loadData = async () => {
    if (!user) return;
    setLoadingData(true);

    const now = new Date();
    const startOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

    const [allAppts, monthlyAppts, profilesRes, doctorsRes, invitesRes] = await Promise.all([
      supabase.from("appointments").select("id", { count: "exact", head: true }),
      supabase.from("appointments").select("id", { count: "exact", head: true }).gte("appointment_date", startOfMonth),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("doctors").select("id, name, slug, specialization, qualification, image_url, hospital_name, consultation_fee, experience, bio, email, languages").order("created_at", { ascending: false }),
      supabase.from("doctor_invites").select("*").order("created_at", { ascending: false }),
    ]);

    const docs = (doctorsRes.data as DoctorRow[]) || [];
    setStats({
      totalBookings: allAppts.count || 0,
      monthlyBookings: monthlyAppts.count || 0,
      totalUsers: profilesRes.count || 0,
      totalDoctors: docs.length,
    });
    setDoctors(docs);
    setInvites(invitesRes.data || []);
    if (docs.length > 0 && !selectedDoctor) setSelectedDoctor(docs[0]);
    setLoadingData(false);
  };

  useEffect(() => { loadData(); }, [user]);

  const handleDeleteDoctor = async (doctor: DoctorRow) => {
    const { error } = await supabase.from("doctors").delete().eq("id", doctor.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Doctor Removed", description: `${doctor.name} has been removed successfully.` });
      setDoctors((prev) => {
        const next = prev.filter((d) => d.id !== doctor.id);
        if (selectedDoctor?.id === doctor.id) setSelectedDoctor(next[0] || null);
        return next;
      });
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

  // Build city list from featuredDoctors data
  const slugToCityMap: Record<string, string> = {};
  featuredDoctors.forEach((f) => { slugToCityMap[f.slug] = f.city; });

  const allCities = Array.from(new Set(
    doctors.map((d) => slugToCityMap[d.slug] || null).filter(Boolean) as string[]
  ));
  const cities = ["All", ...allCities];

  const filtered = doctors.filter((d) => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase());
    const doctorCity = slugToCityMap[d.slug] || "";
    const matchCity = filterCity === "All" || doctorCity === filterCity;
    return matchSearch && matchCity;
  });

  const getResolvedImage = (doc: DoctorRow) => getDoctorImage(doc.slug) || doc.image_url || null;

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
        <div className="max-w-7xl mx-auto">
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-foreground">Doctor Management</h2>
              <Button onClick={() => navigate("/admin/add-doctor")} className="gap-2">
                <Plus className="w-4 h-4" /> Add New Doctor
              </Button>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by doctor name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-8"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Select value={filterCity} onValueChange={setFilterCity}>
                <SelectTrigger className="w-[180px]">
                  <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Filter by city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {doctors.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Stethoscope className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No doctors found. Add your first doctor to get started.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid lg:grid-cols-5 gap-6">
                {/* Left: Doctor List */}
                <div className="lg:col-span-2">
                  <ScrollArea className="h-[700px] pr-3">
                    <div className="space-y-3">
                      <AnimatePresence>
                        {filtered.length === 0 && (
                          <p className="text-muted-foreground text-center py-8 text-sm">No doctors match your search.</p>
                        )}
                        {filtered.map((doc) => (
                          <motion.div
                            key={doc.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <Card
                              className={`cursor-pointer border transition-all duration-200 ${
                                selectedDoctor?.id === doc.id
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/40"
                              }`}
                              onClick={() => setSelectedDoctor(doc)}
                            >
                              <CardContent className="p-3 flex items-center gap-3">
                                <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
                                  {getResolvedImage(doc) ? (
                                    <img src={getResolvedImage(doc)!} alt={doc.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <span className="text-sm font-bold text-primary/50">
                                        {doc.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-semibold text-sm text-foreground truncate">{doc.name}</h3>
                                  {doc.specialization && <p className="text-xs text-primary truncate">{doc.specialization}</p>}
                                  {doc.hospital_name && <p className="text-xs text-muted-foreground truncate">{doc.hospital_name}</p>}
                                </div>
                                {selectedDoctor?.id === doc.id && (
                                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </ScrollArea>
                </div>

                {/* Right: Doctor Preview */}
                <div className="lg:col-span-3">
                  {selectedDoctor ? (
                    <Card className="border-border sticky top-24 overflow-hidden">
                      <div className="relative">
                        {/* Hero image */}
                        <div className="h-72 sm:h-96 bg-muted overflow-hidden flex items-center justify-center">
                          {getResolvedImage(selectedDoctor) ? (
                            <img src={getResolvedImage(selectedDoctor)!} alt={selectedDoctor.name} className="w-full h-full object-contain" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Avatar className="w-32 h-32">
                                <AvatarFallback className="text-5xl bg-primary/20 text-primary">
                                  {selectedDoctor.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          )}
                        </div>
                      </div>

                      <CardContent className="p-6 space-y-5">
                        {/* Name & badges */}
                        <div>
                          <h2 className="text-2xl font-bold text-foreground">{selectedDoctor.name}</h2>
                          {selectedDoctor.qualification && (
                            <p className="text-sm text-muted-foreground mt-1">{selectedDoctor.qualification}</p>
                          )}
                          <div className="flex flex-wrap gap-2 mt-3">
                            {selectedDoctor.specialization && (
                              <Badge className="bg-primary/10 text-primary border-primary/20">{selectedDoctor.specialization}</Badge>
                            )}
                          </div>
                        </div>

                        {/* Details grid */}
                        <div className="grid sm:grid-cols-2 gap-4">
                          {selectedDoctor.hospital_name && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-primary shrink-0" />
                              <span className="text-muted-foreground">{selectedDoctor.hospital_name}</span>
                            </div>
                          )}
                          {selectedDoctor.experience && (
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-primary shrink-0" />
                              <span className="text-muted-foreground">{selectedDoctor.experience} experience</span>
                            </div>
                          )}
                          {selectedDoctor.consultation_fee && (
                            <div className="flex items-center gap-2 text-sm">
                              <IndianRupee className="w-4 h-4 text-primary shrink-0" />
                              <span className="text-muted-foreground">Fee: {selectedDoctor.consultation_fee}</span>
                            </div>
                          )}
                          {selectedDoctor.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <GraduationCap className="w-4 h-4 text-primary shrink-0" />
                              <span className="text-muted-foreground truncate">{selectedDoctor.email}</span>
                            </div>
                          )}
                          {selectedDoctor.languages && selectedDoctor.languages.length > 0 && (
                            <div className="flex items-center gap-2 text-sm sm:col-span-2">
                              <Globe className="w-4 h-4 text-primary shrink-0" />
                              <span className="text-muted-foreground">{selectedDoctor.languages.join(", ")}</span>
                            </div>
                          )}
                        </div>

                        {/* Bio */}
                        {selectedDoctor.bio && (
                          <div>
                            <h3 className="text-sm font-semibold text-foreground mb-2">About</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{selectedDoctor.bio}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                          <Link
                            to={`/doctor/${selectedDoctor.slug}`}
                            className="flex-1 text-center text-sm bg-primary text-primary-foreground px-4 py-2.5 rounded-md font-medium hover:opacity-90 transition-opacity"
                          >
                            View Public Profile →
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" className="gap-2">
                                <Trash2 className="w-4 h-4" /> Remove
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to remove this doctor?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete <strong>{selectedDoctor.name}</strong> from the platform. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteDoctor(selectedDoctor)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                  Remove Doctor
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="border-border">
                      <CardContent className="py-24 text-center">
                        <Stethoscope className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Select a doctor to view details</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
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
