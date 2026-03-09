import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Loader2, Mail, Stethoscope } from "lucide-react";

const DoctorLogin = () => {
  const { user, role, roleLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (!user || roleLoading) return;

    if (role === "doctor") {
      navigate("/doctor-dashboard", { replace: true });
    } else if (role === "admin") {
      navigate("/admin-dashboard", { replace: true });
    } else {
      // User is authenticated but not a doctor
      toast({
        title: "Access Denied",
        description: "This login is for registered doctors only. If you just completed registration, please try again.",
        variant: "destructive",
      });
    }
  }, [user, role, roleLoading, navigate, toast]);

  const handleSendOtp = async () => {
    if (!email) return;
    setLoading(true);
    try {
      // Verify this email belongs to a registered doctor
      const { data: doctor } = await supabase
        .from("doctors")
        .select("id")
        .eq("email", email.toLowerCase())
        .maybeSingle();

      if (!doctor) {
        toast({
          title: "Not Found",
          description: "No registered doctor found with this email. Please check your email or contact admin.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      setOtpSent(true);
      toast({ title: "OTP Sent", description: "Check your email for the 6-digit code." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: "email" });
      if (error) throw error;
      // The useEffect above will handle redirect once role loads
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-20 px-4 flex justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Doctor Sign In</CardTitle>
              <CardDescription>Sign in with your registered email to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              {!otpSent ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor-email">Registered Email Address</Label>
                    <Input
                      id="doctor-email"
                      type="email"
                      placeholder="doctor@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Button className="w-full" onClick={handleSendOtp} disabled={loading || !email}>
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
                    Send OTP
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Not a doctor?{" "}
                    <button onClick={() => navigate("/auth")} className="text-primary underline">
                      Sign in as patient
                    </button>
                  </p>
                </div>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    OTP sent to <span className="font-medium text-foreground">{email}</span>
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-otp">Enter OTP</Label>
                    <Input
                      id="doctor-otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      placeholder="6-digit code"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Verify & Sign In
                  </Button>
                  <Button type="button" variant="ghost" className="w-full text-xs" onClick={() => { setOtpSent(false); setOtp(""); }}>
                    Change email / Resend OTP
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default DoctorLogin;
