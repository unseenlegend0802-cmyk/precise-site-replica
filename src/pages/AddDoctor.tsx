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
import { ArrowLeft, Loader2, Upload, ImagePlus, X } from "lucide-react";
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

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
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

      const hospitalFull = [form.hospital_name.trim(), form.hospital_location.trim()].filter(Boolean).join(", ");

      const { error } = await supabase.from("doctors").insert({
        name: form.name.trim(),
        slug,
        email: form.email.trim() || null,
        hospital_name: hospitalFull || null,
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

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-2xl">Add New Doctor</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column – Doctor Details */}
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Doctor Name *</Label>
                      <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Dr. John Doe" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="doctor@example.com" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hospital_name">Hospital Name</Label>
                      <Input id="hospital_name" name="hospital_name" value={form.hospital_name} onChange={handleChange} placeholder="Apollo Hospital" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hospital_location">Hospital Location</Label>
                      <Input id="hospital_location" name="hospital_location" value={form.hospital_location} onChange={handleChange} placeholder="Bangalore, Karnataka" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="consultation_fee">Consultation Fees</Label>
                        <Input id="consultation_fee" name="consultation_fee" value={form.consultation_fee} onChange={handleChange} placeholder="₹800" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience">Experience</Label>
                        <Input id="experience" name="experience" value={form.experience} onChange={handleChange} placeholder="10+ years" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="qualification">Qualification</Label>
                      <Input id="qualification" name="qualification" value={form.qualification} onChange={handleChange} placeholder="MBBS, MD, DNB" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization *</Label>
                      <Input id="specialization" name="specialization" value={form.specialization} onChange={handleChange} placeholder="Interventional Radiology" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" name="bio" value={form.bio} onChange={handleChange} placeholder="Brief description about the doctor..." rows={4} />
                    </div>
                  </div>

                  {/* Right Column – Image Upload */}
                  <div className="flex flex-col items-center gap-6">
                    <Label className="self-start">Doctor Image</Label>
                    <div className="w-full aspect-[3/4] max-w-xs rounded-2xl border-2 border-dashed border-border bg-muted/50 flex items-center justify-center overflow-hidden relative group">
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="Doctor preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <label htmlFor="doctor-image-upload" className="flex flex-col items-center gap-3 cursor-pointer p-6 text-center">
                          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                            <ImagePlus className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">Click to upload</p>
                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                          </div>
                        </label>
                      )}
                    </div>
                    <Input
                      id="doctor-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    {imagePreview && (
                      <label htmlFor="doctor-image-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" size="sm" className="gap-2 pointer-events-none">
                          <Upload className="w-4 h-4" /> Change Image
                        </Button>
                      </label>
                    )}
                  </div>

                  {/* Submit spans full width */}
                  <div className="md:col-span-2">
                    <Button type="submit" className="w-full gap-2" disabled={submitting}>
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      {submitting ? "Adding Doctor..." : "Submit"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddDoctor;
