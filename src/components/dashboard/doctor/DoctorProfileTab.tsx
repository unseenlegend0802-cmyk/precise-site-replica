import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Save, Loader2 } from "lucide-react";

interface DoctorProfileTabProps {
  userId: string;
  doctorRecord: any;
  onUpdate: () => void;
}

const DoctorProfileTab: React.FC<DoctorProfileTabProps> = ({ userId, doctorRecord, onUpdate }) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
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
    }
  }, [doctorRecord]);

  const handleSave = async () => {
    if (!doctorRecord?.id) return;
    setSaving(true);
    try {
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
        })
        .eq("id", doctorRecord.id);
      if (error) throw error;
      toast({ title: "Profile updated successfully" });
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" /> Doctor Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "Full Name", key: "name", type: "text", disabled: true },
            { label: "Specialization", key: "specialization", type: "text" },
            { label: "Qualification", key: "qualification", type: "text" },
            { label: "Experience", key: "experience", type: "text" },
            { label: "Consultation Fee", key: "consultation_fee", type: "text" },
            { label: "Hospital", key: "hospital_name", type: "text" },
            { label: "Email", key: "email", type: "email" },
            { label: "Languages (comma-separated)", key: "languages", type: "text" },
          ].map((f) => (
            <div key={f.key} className="space-y-1.5">
              <Label htmlFor={f.key}>{f.label}</Label>
              <Input
                id={f.key}
                type={f.type}
                disabled={f.disabled}
                value={(form as any)[f.key] || ""}
                onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-1.5">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            rows={3}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={form.bio}
            onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
          />
        </div>
        <div className="mt-6">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorProfileTab;
