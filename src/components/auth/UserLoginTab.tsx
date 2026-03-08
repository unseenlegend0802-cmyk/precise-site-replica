import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useBooking } from "@/contexts/BookingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Phone, Loader2 } from "lucide-react";
import { lovable } from "@/integrations/lovable/index";

const UserLoginTab = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasPendingBooking } = useBooking();
  const [loading, setLoading] = useState(false);

  // Phone OTP state
  const [showPhoneForm, setShowPhoneForm] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const redirectAfterAuth = hasPendingBooking ? "/book-appointment" : "/dashboard";

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!phone) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone });
      if (error) throw error;
      setOtpSent(true);
      toast({ title: "OTP Sent", description: "Enter the code sent to your phone." });
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
      const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: "sms" });
      if (error) throw error;
      navigate(redirectAfterAuth);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground text-center">
        For patients & doctors
      </p>

      {/* Google Sign-In */}
      <Button
        variant="outline"
        className="w-full flex items-center gap-3 h-11"
        onClick={handleGoogleSignIn}
        disabled={loading}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </Button>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">OR</span>
        <Separator className="flex-1" />
      </div>

      {/* Phone OTP */}
      {!showPhoneForm ? (
        <Button
          variant="outline"
          className="w-full flex items-center gap-3 h-11"
          onClick={() => setShowPhoneForm(true)}
          disabled={loading}
        >
          <Phone className="w-5 h-5" />
          Continue with Phone
        </Button>
      ) : !otpSent ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-phone">Phone Number</Label>
            <Input
              id="user-phone"
              type="tel"
              placeholder="+91XXXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <Button className="w-full" onClick={handleSendOtp} disabled={loading || !phone}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Send OTP
          </Button>
          <Button variant="ghost" className="w-full text-xs" onClick={() => setShowPhoneForm(false)}>
            Back
          </Button>
        </div>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-otp">Enter OTP</Label>
            <Input
              id="user-otp"
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

      <p className="text-xs text-muted-foreground text-center mt-2">
        Phone OTP requires SMS provider configuration.
      </p>
    </div>
  );
};

export default UserLoginTab;
