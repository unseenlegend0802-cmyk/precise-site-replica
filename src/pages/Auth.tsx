import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext"
import { useBooking } from "@/contexts/BookingContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import PatientLoginTab from "@/components/auth/PatientLoginTab";
import DoctorLoginTab from "@/components/auth/DoctorLoginTab";
import AdminLoginTab from "@/components/auth/AdminLoginTab";
import { ShieldCheck, Loader as Loader2 } from "lucide-react";
import { lovable } from "@/integrations/lovable/index";

const Auth = () => {
  const { user, role, roleLoading } = useAuth();
  const navigate = useNavigate();
  const { hasPendingBooking } = useBooking();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"patient" | "doctor" | "admin">("admin");
  const [adminLoading, setAdminLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (roleLoading) return;
    if (!role) return; // ⭐ IMPORTANT

  console.log("User Email:", user?.email);
  console.log("User Role:", role);
  console.log("Role Loading:", roleLoading);

    const checkPendingInvite = async () => {
      const { data: invite } = await supabase
        .from("doctor_invites")
        .select("invite_token")
        .eq("doctor_email", user.email ?? "")
        .eq("status", "pending")
        .maybeSingle();

      if (invite) {
        navigate(`/doctor-register?token=${invite.invite_token}`, { replace: true });
        return;
      }

      if (hasPendingBooking) {
        navigate("/book-appointment", { replace: true });
      } else if (role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else if (role === "doctor") {
        navigate("/doctor-dashboard", { replace: true });
      } else if (role == "patient") {
        navigate("/patient-dashboard", { replace: true });
      } 
    };

    checkPendingInvite();
  }, [user, role, roleLoading, navigate, hasPendingBooking]);

  const ADMIN_EMAIL = "unseenlegend0802@gmail.com";
  
  const handleAdminLogin = async () => {
    setAdminLoading(true);
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
      extraParams: {
        login_hint: "ADMIN_EMAIL",
        prompt: "select_account",
      },
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setAdminLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex justify-between items-start mb-8">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Welcome Back</h1>
              <p className="text-muted-foreground">Choose your login type to continue</p>
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={handleAdminLogin}
              disabled={adminLoading}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              {adminLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              Admin Login
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              onClick={() => setActiveTab("patient")}
              className="cursor-pointer"
            >
              <Card
                className={`transition-all duration-300 ${
                  activeTab === "patient"
                    ? "ring-2 ring-primary shadow-lg"
                    : "hover:shadow-md"
                }`}
              >
                <CardHeader>
                  <CardTitle className="text-2xl">Patient Login</CardTitle>
                  <CardDescription>Sign in as a patient to book appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <PatientLoginTab />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              onClick={() => setActiveTab("doctor")}
              className="cursor-pointer"
            >
              <Card
                className={`transition-all duration-300 ${
                  activeTab === "doctor"
                    ? "ring-2 ring-primary shadow-lg"
                    : "hover:shadow-md"
                }`}
              >
                <CardHeader>
                  <CardTitle className="text-2xl">Doctor Login</CardTitle>
                  <CardDescription>Sign in as a doctor to manage your profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <DoctorLoginTab />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
