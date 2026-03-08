import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck } from "lucide-react";

const AdminLoginTab = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      setOtpSent(true);
      toast({ title: "OTP Sent", description: "Check your email for the verification code." });
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
      // Role check happens in the dashboard via ProtectedRoute
      navigate("/admin-dashboard");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-center gap-2 text-muted-foreground">
        <ShieldCheck className="w-5 h-5 text-primary" />
        <p className="text-sm">Admin access only</p>
      </div>

      {!otpSent ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Admin Email</Label>
            <Input
              id="admin-email"
              type="email"
              placeholder="admin@medagg.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button className="w-full" onClick={handleSendOtp} disabled={loading || !email}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Send OTP to Email
          </Button>
        </div>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            OTP sent to <span className="font-medium text-foreground">{email}</span>
          </p>
          <div className="space-y-2">
            <Label htmlFor="admin-otp">Enter OTP</Label>
            <Input
              id="admin-otp"
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
            Resend OTP
          </Button>
        </form>
      )}
    </div>
  );
};

export default AdminLoginTab;
