import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Upload, UserCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AddDoctor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    hospital_name: "",
    hospital_location: "",
    consultation_fee: "",
    qualification: "",
    specialization: "",
    experience: "",
    bio: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.specialization.trim()) {
      toast({ title: "Validation Error", description: "Name and Specialization are required.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      let image_url: string | null = null;

      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `${slug}-${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("doctor-images").upload(path, imageFile);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("doctor-images").getPublicUrl(path);
        image_url = urlData.publicUrl;
      }

      const { error } = await supabase.from("doctors").insert({
        name: form.name.trim(),
        slug,
        email: form.email.trim() || null,
        hospital_name: form.hospital_name.trim() || null,
        consultation_fee: form.consultation_fee.trim() || null,
        qualification: form.qualification.trim() || null,
        specialization: form.specialization.trim() || null,
        experience: form.experience.trim() || null,
        bio: form.bio.trim() || null,
        image_url,
      });

      if (error) throw error;

      toast({ title: "Doctor Added", description: `${form.name} has been added successfully.` });
      navigate("/admin-dashboard");
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to add doctor.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Button variant="ghost" onClick={() => navigate("/admin-dashboard")} className="gap-2 mb-6 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Button>

            <h1 className="text-2xl font-bold mb-6">Add New Doctor</h1>

            <form onSubmit={handleSubmit}>
              <div className="grid lg:grid-cols-5 gap-6">
                {/* Left Column – Doctor Details */}
                <Card className="border-border lg:col-span-3">
                  <CardHeader>
                    <CardTitle className="text-lg">Doctor Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name">Doctor Name *</Label>
                      <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Dr. John Doe" required />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="doctor@example.com" />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Hospital Name */}
                      <div className="space-y-2">
                        <Label htmlFor="hospital_name">Hospital Name</Label>
                        <Input id="hospital_name" name="hospital_name" value={form.hospital_name} onChange={handleChange} placeholder="Apollo Hospital" />
                      </div>
                      {/* Hospital Location */}
                      <div className="space-y-2">
                        <Label htmlFor="hospital_location">Hospital Location</Label>
                        <Input id="hospital_location" name="hospital_location" value={form.hospital_location} onChange={handleChange} placeholder="Bangalore, India" />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Fee */}
                      <div className="space-y-2">
                        <Label htmlFor="consultation_fee">Consultation Fees</Label>
                        <Input id="consultation_fee" name="consultation_fee" value={form.consultation_fee} onChange={handleChange} placeholder="₹800" />
                      </div>
                      {/* Experience */}
                      <div className="space-y-2">
                        <Label htmlFor="experience">Experience</Label>
                        <Input id="experience" name="experience" value={form.experience} onChange={handleChange} placeholder="10+ years" />
                      </div>
                    </div>

                    {/* Qualification */}
                    <div className="space-y-2">
                      <Label htmlFor="qualification">Qualification</Label>
                      <Input id="qualification" name="qualification" value={form.qualification} onChange={handleChange} placeholder="MBBS, MD, DNB" />
                    </div>

                    {/* Specialization */}
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization *</Label>
                      <Input id="specialization" name="specialization" value={form.specialization} onChange={handleChange} placeholder="Interventional Radiology" required />
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" name="bio" value={form.bio} onChange={handleChange} placeholder="Brief description about the doctor..." rows={4} />
                    </div>
                  </CardContent>
                </Card>

                {/* Right Column – Image Upload */}
                <Card className="border-border lg:col-span-2 h-fit">
                  <CardHeader>
                    <CardTitle className="text-lg">Doctor Image</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center gap-5">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full max-w-[240px] aspect-[3/4] rounded-xl object-cover border border-border" />
                    ) : (
                      <div className="w-full max-w-[240px] aspect-[3/4] rounded-xl bg-muted flex flex-col items-center justify-center border border-dashed border-border gap-2">
                        <UserCircle className="w-16 h-16 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">No image selected</p>
                      </div>
                    )}
                    <div className="w-full">
                      <Label htmlFor="image-upload" className="cursor-pointer">
                        <div className="flex items-center justify-center gap-2 border border-border rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors">
                          <Upload className="w-4 h-4" />
                          {imageFile ? "Change Image" : "Upload Image"}
                        </div>
                      </Label>
                      <Input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      <p className="text-xs text-muted-foreground mt-2 text-center">PNG, JPG up to 5MB</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Submit */}
              <div className="mt-6">
                <Button type="submit" className="w-full sm:w-auto px-10 gap-2" disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {submitting ? "Adding Doctor..." : "Submit"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddDoctor;
