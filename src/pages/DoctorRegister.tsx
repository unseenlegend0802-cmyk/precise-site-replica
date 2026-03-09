import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, AlertCircle, Upload, ImagePlus, X, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Step = "validating" | "invalid" | "already_accepted" | "set_password" | "profile" | "complete";

const DoctorRegister = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { user, refreshRole } = useAuth();

  const [step, setStep] = useState<Step>("validating");
  const [invite, setInvite] = useState<any>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    hospital_name: "",
    specialization: "",
    qualification: "",
    experience: "",
    consultation_fee: "",
    bio: "",
    languages: "",
  });

  const acceptInviteAndEnsureDoctorRole = async (inviteToken: string) => {
    const { data: accepted, error: acceptError } = await supabase.rpc("accept_doctor_invite", {
      _invite_token: inviteToken,
    });

    if (acceptError || !accepted) {
      throw new Error("Could not activate doctor access. Please reopen the invite link and try again.");
    }

    await refreshRole();

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
      throw new Error("Session missing. Please sign in again.");
    }

    const { data: roleRow, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", currentUser.id)
      .maybeSingle();

    if (roleError || roleRow?.role !== "doctor") {
      throw new Error("Doctor role assignment failed. Please try again.");
    }
  };

  // Validate token on mount
  useEffect(() => {
    const validate = async () => {
      if (!token) {
        setStep("invalid");
        return;
      }

      const { data, error } = await supabase
        .from("doctor_invites")
        .select("*")
        .eq("invite_token", token)
        .maybeSingle();

      if (error || !data) {
        setStep("invalid");
        return;
      }

      setInvite(data);

      if (user) {
        try {
          await acceptInviteAndEnsureDoctorRole(token);
          setStep("profile");
          return;
        } catch (err: any) {
          toast({ title: "Role update failed", description: err.message, variant: "destructive" });
        }
      }

      if (data.status === "accepted") {
        setStep("already_accepted");
      } else {
        setStep("set_password");
      }
    };

    validate();
  }, [token, user, refreshRole]);

  const handleSetPassword = async () => {
    if (password.length < 6) {
      toast({ title: "Password too short", description: "Minimum 6 characters.", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      // The user was created via inviteUserByEmail, so they arrive with a session
      // We just need to update their password
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        throw new Error("Session missing. Please sign in again.");
      }

      await acceptInviteAndEnsureDoctorRole(token!);
      setStep("profile");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleProfileSubmit = async () => {
    if (!profile.specialization.trim() || !profile.hospital_name.trim()) {
      toast({ title: "Required fields", description: "Hospital and Specialization are required.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const slug = invite.doctor_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      let image_url: string | null = null;

      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `${slug}-${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("doctor-images").upload(path, imageFile);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("doctor-images").getPublicUrl(path);
        image_url = urlData.publicUrl;
      }

      // Check if doctor record already exists (created by admin previously)
      const { data: existing } = await supabase
        .from("doctors")
        .select("id")
        .eq("email", invite.doctor_email)
        .maybeSingle();

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from("doctors")
          .update({
            hospital_name: profile.hospital_name.trim(),
            specialization: profile.specialization.trim(),
            qualification: profile.qualification.trim() || null,
            experience: profile.experience.trim() || null,
            consultation_fee: profile.consultation_fee.trim() || null,
            bio: profile.bio.trim() || null,
            languages: profile.languages.split(",").map(l => l.trim()).filter(Boolean),
            image_url: image_url || undefined,
          })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        // Insert new doctor record
        const { error } = await supabase.from("doctors").insert({
          name: invite.doctor_name,
          slug,
          email: invite.doctor_email,
          hospital_name: profile.hospital_name.trim(),
          specialization: profile.specialization.trim(),
          qualification: profile.qualification.trim() || null,
          experience: profile.experience.trim() || null,
          consultation_fee: profile.consultation_fee.trim() || null,
          bio: profile.bio.trim() || null,
          languages: profile.languages.split(",").map(l => l.trim()).filter(Boolean),
          image_url,
        });
        if (error) throw error;
      }

      // Mark invite as accepted
      await supabase
        .from("doctor_invites")
        .update({ status: "accepted" })
        .eq("invite_token", token!);

      // Create profile entry
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        await supabase.from("profiles").upsert({
          user_id: currentUser.id,
          full_name: invite.doctor_name,
        }, { onConflict: "user_id" });
      }

      setStep("complete");
      toast({ title: "Profile created!", description: "Your doctor profile is now live." });

      setTimeout(() => navigate("/doctor-dashboard", { replace: true }), 2000);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-20 px-4 flex justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">

          {step === "validating" && (
            <Card>
              <CardContent className="py-16 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Validating your invitation...</p>
              </CardContent>
            </Card>
          )}

          {step === "invalid" && (
            <Card>
              <CardContent className="py-16 text-center">
                <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <h2 className="text-xl font-bold text-foreground mb-2">Invalid Invitation</h2>
                <p className="text-muted-foreground">This invitation link is invalid or has expired.</p>
                <Button className="mt-6" onClick={() => navigate("/")}>Go to Homepage</Button>
              </CardContent>
            </Card>
          )}

          {step === "already_accepted" && (
            <Card>
              <CardContent className="py-16 text-center">
                <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-bold text-foreground mb-2">Already Registered</h2>
                <p className="text-muted-foreground">This invitation has already been used. Please sign in.</p>
                <Button className="mt-6" onClick={() => navigate("/auth")}>Sign In</Button>
              </CardContent>
            </Card>
          )}

          {step === "set_password" && (
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Welcome, Dr. {invite?.doctor_name}!</CardTitle>
                <CardDescription>Set your password to complete your account setup</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={invite?.doctor_email || ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm Password</Label>
                  <Input id="confirm" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter password" />
                </div>
                <Button className="w-full gap-2" onClick={handleSetPassword} disabled={submitting}>
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Continue to Profile Setup
                </Button>
              </CardContent>
            </Card>
          )}

          {step === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
                <CardDescription>Fill in your professional details. This will be visible to patients.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Doctor Name</Label>
                      <Input value={invite?.doctor_name || ""} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hospital_name">Hospital Name *</Label>
                      <Input id="hospital_name" value={profile.hospital_name} onChange={e => setProfile(p => ({ ...p, hospital_name: e.target.value }))} placeholder="Apollo Hospital, Bangalore" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization *</Label>
                      <Input id="specialization" value={profile.specialization} onChange={e => setProfile(p => ({ ...p, specialization: e.target.value }))} placeholder="Interventional Radiology" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="qualification">Qualification</Label>
                      <Input id="qualification" value={profile.qualification} onChange={e => setProfile(p => ({ ...p, qualification: e.target.value }))} placeholder="MBBS, MD, DNB" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="experience">Experience</Label>
                        <Input id="experience" value={profile.experience} onChange={e => setProfile(p => ({ ...p, experience: e.target.value }))} placeholder="10+ years" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="consultation_fee">Consultation Fee</Label>
                        <Input id="consultation_fee" value={profile.consultation_fee} onChange={e => setProfile(p => ({ ...p, consultation_fee: e.target.value }))} placeholder="₹800" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="languages">Languages (comma-separated)</Label>
                      <Input id="languages" value={profile.languages} onChange={e => setProfile(p => ({ ...p, languages: e.target.value }))} placeholder="English, Hindi, Telugu" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Biography</Label>
                      <Textarea id="bio" value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} placeholder="Brief description about your expertise..." rows={4} />
                    </div>
                  </div>

                  {/* Image upload */}
                  <div className="flex flex-col items-center gap-4">
                    <Label className="self-start">Profile Photo</Label>
                    <div className="w-full aspect-square max-w-xs rounded-2xl border-2 border-dashed border-border bg-muted/50 flex items-center justify-center overflow-hidden relative group">
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <label htmlFor="profile-photo" className="flex flex-col items-center gap-3 cursor-pointer p-6 text-center">
                          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                            <ImagePlus className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <p className="text-sm font-medium text-foreground">Click to upload</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                        </label>
                      )}
                    </div>
                    <Input id="profile-photo" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </div>
                </div>

                <div className="mt-8">
                  <Button className="w-full gap-2" onClick={handleProfileSubmit} disabled={submitting}>
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {submitting ? "Saving Profile..." : "Complete Registration"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === "complete" && (
            <Card>
              <CardContent className="py-16 text-center">
                <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to Medagg!</h2>
                <p className="text-muted-foreground">Your profile is live. Redirecting to your dashboard...</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default DoctorRegister;
