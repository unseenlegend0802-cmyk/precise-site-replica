import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useBooking } from "@/contexts/BookingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader as Loader2, Phone } from "lucide-react";

const PatientLoginTab = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasPendingBooking } = useBooking();
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const redirectAfterAuth = hasPendingBooking ? "/book-appointment" : "/dashboard";

  const handleSendOtp = async () => {
    if (!phone) {
      toast({ title: "Error", description: "Please enter your phone number", variant: "destructive" });
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      toast({ title: "Error", description: "Please enter a valid 10-digit Indian phone number", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = `+91${phone}`;
      const { error } = await supabase.auth.signInWithOtp({ phone: formattedPhone });
      if (error) throw error;
      setOtpSent(true);
      toast({ title: "OTP Sent", description: "Check your phone for the 6-digit code." });
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
      const formattedPhone = `+91${phone}`;
      const { error } = await supabase.auth.verifyOtp({ phone: formattedPhone, token: otp, type: "sms" });
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
        Sign in with your phone number
      </p>

      {!otpSent ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient-phone">Phone Number</Label>
            <div className="flex gap-2">
              <div className="flex items-center px-3 bg-muted rounded-md border border-input">
                <span className="text-sm font-medium text-muted-foreground">+91</span>
              </div>
              <Input
                id="patient-phone"
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                maxLength={10}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Enter your 10-digit phone number
            </p>
          </div>
          <Button className="w-full" onClick={handleSendOtp} disabled={loading || !phone}>
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Phone className="w-4 h-4 mr-2" />
            )}
            Send OTP
          </Button>
        </div>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            OTP sent to <span className="font-medium text-foreground">+91{phone}</span>
          </p>
          <div className="space-y-2">
            <Label htmlFor="patient-otp">Enter OTP</Label>
            <Input
              id="patient-otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              placeholder="6-digit code"
              inputMode="numeric"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Verify & Sign In
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full text-xs"
            onClick={() => { setOtpSent(false); setOtp(""); }}
          >
            Change phone / Resend OTP
          </Button>
        </form>
      )}
    </div>
  );
};

export default PatientLoginTab;
