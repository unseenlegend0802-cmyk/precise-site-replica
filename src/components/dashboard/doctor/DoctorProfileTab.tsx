import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Save, Loader2, Upload, ImagePlus, X, Clock, Calendar } from "lucide-react";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface DoctorProfileTabProps {
  userId: string;
  doctorRecord: any;
  onUpdate: () => void;
}

interface DaySlot {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  id?: string;
}

const defaultDaySlots: DaySlot[] = DAYS.map((_, i) => ({
  day_of_week: i,
  start_time: "09:00",
  end_time: "17:00",
  is_available: i >= 1 && i <= 5,
}));

const DoctorProfileTab: React.FC<DoctorProfileTabProps> = ({ userId, doctorRecord, onUpdate }) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [daySlots, setDaySlots] = useState<DaySlot[]>(defaultDaySlots);
  const [loadingAvailability, setLoadingAvailability] = useState(true);

  const [form, setForm] = useState({
    name: "",
    specialization: "",
    qualification: "",
    experience: "",
    consultation_fee: "",
    bio: "",
    languages: "",
    hospital_name: "",
    email: "",
  });

  useEffect(() => {
    if (doctorRecord) {
      setForm({
        name: doctorRecord.name || "",
        specialization: doctorRecord.specialization || "",
        qualification: doctorRecord.qualification || "",
        experience: doctorRecord.experience || "",
        consultation_fee: doctorRecord.consultation_fee || "",
        bio: doctorRecord.bio || "",
        languages: (doctorRecord.languages || []).join(", "),
        hospital_name: doctorRecord.hospital_name || "",
        email: doctorRecord.email || "",
      });
      if (doctorRecord.image_url) {
        setImagePreview(doctorRecord.image_url);
      }
    }
  }, [doctorRecord]);

  // Load availability
  useEffect(() => {
    if (!doctorRecord?.id) { setLoadingAvailability(false); return; }
    const fetchAvailability = async () => {
      const { data } = await supabase
        .from("doctor_availability")
        .select("*")
        .eq("doctor_id", doctorRecord.id)
        .order("day_of_week");
      if (data && data.length > 0) {
        const merged = defaultDaySlots.map((ds) => {
          const found = data.find((d: any) => d.day_of_week === ds.day_of_week);
          return found
            ? { ...ds, start_time: found.start_time?.slice(0, 5), end_time: found.end_time?.slice(0, 5), is_available: found.is_available, id: found.id }
            : ds;
        });
        setDaySlots(merged);
      }
      setLoadingAvailability(false);
    };
    fetchAvailability();
  }, [doctorRecord?.id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(doctorRecord?.image_url || null);
  };

  const updateSlot = (dayIndex: number, field: keyof DaySlot, value: any) => {
    setDaySlots((prev) =>
      prev.map((s) => (s.day_of_week === dayIndex ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = async () => {
    if (!doctorRecord?.id) return;
    setSaving(true);
    try {
      let imageUrl = doctorRecord.image_url;

      // Upload image if new file selected
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const filePath = `${doctorRecord.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("doctor-images")
          .upload(filePath, imageFile, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from("doctor-images")
          .getPublicUrl(filePath);
        imageUrl = urlData.publicUrl;
      }

      // Update doctor record
      const { error } = await supabase
        .from("doctors")
        .update({
          specialization: form.specialization,
          qualification: form.qualification,
          experience: form.experience,
          consultation_fee: form.consultation_fee,
          bio: form.bio,
          languages: form.languages.split(",").map((l) => l.trim()).filter(Boolean),
          hospital_name: form.hospital_name,
          email: form.email,
          image_url: imageUrl,
        })
        .eq("id", doctorRecord.id);
      if (error) throw error;

      // Save availability
      for (const slot of daySlots) {
        const payload = {
          doctor_id: doctorRecord.id,
          user_id: userId,
          day_of_week: slot.day_of_week,
          start_time: slot.start_time,
          end_time: slot.end_time,
          is_available: slot.is_available,
        };
        if (slot.id) {
          await supabase.from("doctor_availability").update(payload).eq("id", slot.id);
        } else {
          await supabase.from("doctor_availability").insert(payload);
        }
      }

      toast({ title: "Profile saved successfully!" });
      onUpdate();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (!doctorRecord) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No doctor profile linked to your account. Please contact an administrator.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Photo & Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" /> Doctor Profile
          </CardTitle>
          <CardDescription>Complete your professional profile to appear on the platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Photo */}
          <div className="space-y-2">
            <Label>Profile Photo</Label>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden bg-muted">
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <ImagePlus className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <label htmlFor="photo-upload">
                  <Button variant="outline" size="sm" asChild className="gap-2 cursor-pointer">
                    <span>
                      <Upload className="w-4 h-4" /> Upload Photo
                    </span>
                  </Button>
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG. Max 5MB.</p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={form.name} disabled className="opacity-70" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} disabled className="opacity-70" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hospital_name">Hospital Name</Label>
              <Input
                id="hospital_name"
                placeholder="e.g. Apollo Hospital"
                value={form.hospital_name}
                onChange={(e) => setForm((p) => ({ ...p, hospital_name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                placeholder="e.g. Interventional Radiology"
                value={form.specialization}
                onChange={(e) => setForm((p) => ({ ...p, specialization: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="qualification">Qualification</Label>
              <Input
                id="qualification"
                placeholder="e.g. MBBS, MD, DNB"
                value={form.qualification}
                onChange={(e) => setForm((p) => ({ ...p, qualification: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                placeholder="e.g. 15 Years"
                value={form.experience}
                onChange={(e) => setForm((p) => ({ ...p, experience: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="consultation_fee">Consultation Fees</Label>
              <Input
                id="consultation_fee"
                placeholder="e.g. ₹500"
                value={form.consultation_fee}
                onChange={(e) => setForm((p) => ({ ...p, consultation_fee: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="languages">Languages (comma-separated)</Label>
              <Input
                id="languages"
                placeholder="e.g. English, Hindi, Telugu"
                value={form.languages}
                onChange={(e) => setForm((p) => ({ ...p, languages: e.target.value }))}
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <Label htmlFor="bio">Short Bio</Label>
            <Textarea
              id="bio"
              rows={4}
              placeholder="Write a short professional biography..."
              value={form.bio}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Available Days & Time Slots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" /> Available Days & Time Slots
          </CardTitle>
          <CardDescription>Set your weekly availability schedule.</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingAvailability ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-3">
              {daySlots.map((slot) => (
                <div
                  key={slot.day_of_week}
                  className={`flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border transition-colors ${
                    slot.is_available ? "border-primary/20 bg-primary/5" : "border-border bg-muted/30"
                  }`}
                >
                  <div className="flex items-center gap-3 sm:w-40">
                    <Switch
                      checked={slot.is_available}
                      onCheckedChange={(v) => updateSlot(slot.day_of_week, "is_available", v)}
                    />
                    <span className={`font-medium text-sm ${slot.is_available ? "text-foreground" : "text-muted-foreground"}`}>
                      {DAYS[slot.day_of_week]}
                    </span>
                  </div>
                  {slot.is_available && (
                    <div className="flex items-center gap-2 flex-1">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">From</Label>
                        <Input
                          type="time"
                          value={slot.start_time}
                          onChange={(e) => updateSlot(slot.day_of_week, "start_time", e.target.value)}
                          className="w-32"
                        />
                      </div>
                      <span className="text-muted-foreground mt-5">–</span>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">To</Label>
                        <Input
                          type="time"
                          value={slot.end_time}
                          onChange={(e) => updateSlot(slot.day_of_week, "end_time", e.target.value)}
                          className="w-32"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg" className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Profile
        </Button>
      </div>
    </div>
  );
};

export default DoctorProfileTab;
