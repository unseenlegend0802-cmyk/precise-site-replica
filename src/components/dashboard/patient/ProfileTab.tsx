import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Save, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import iraBot from "@/assets/ira-bot.png";

interface Profile {
  full_name: string;
  age: number | null;
  gender: string;
  blood_group: string;
  medical_history: string;
  allergies: string;
  current_medications: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  preferred_language: string;
}

interface ProfileTabProps {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  saving: boolean;
  onSave: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ profile, setProfile, saving, onSave }) => {
  return (
    <div className="flex gap-6 items-start">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" /> Medical Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "Full Name", key: "full_name", type: "text" },
              { label: "Age", key: "age", type: "number" },
              { label: "Gender", key: "gender", type: "text" },
              { label: "Blood Group", key: "blood_group", type: "text" },
              { label: "Emergency Contact Name", key: "emergency_contact_name", type: "text" },
              { label: "Emergency Contact Phone", key: "emergency_contact_phone", type: "tel" },
              { label: "Preferred Language", key: "preferred_language", type: "text" },
            ].map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label htmlFor={f.key}>{f.label}</Label>
                <Input
                  id={f.key}
                  type={f.type}
                  value={(profile as any)[f.key] ?? ""}
                  onChange={(e) =>
                    setProfile((p) => ({
                      ...p,
                      [f.key]: f.type === "number" ? (e.target.value ? Number(e.target.value) : null) : e.target.value,
                    }))
                  }
                />
              </div>
            ))}
          </div>
          <div className="grid gap-4 mt-4">
            {[
              { label: "Medical History", key: "medical_history" },
              { label: "Allergies", key: "allergies" },
              { label: "Current Medications", key: "current_medications" },
            ].map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label htmlFor={f.key}>{f.label}</Label>
                <textarea
                  id={f.key}
                  rows={2}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={(profile as any)[f.key] || ""}
                  onChange={(e) => setProfile((p) => ({ ...p, [f.key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button onClick={onSave} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* IRa Bot */}
      <div className="hidden lg:flex flex-col items-center gap-3 w-40 shrink-0 sticky top-32">
        <motion.img
          src={iraBot}
          alt="IRa Bot Assistant"
          className="w-32 h-32 object-contain drop-shadow-lg"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="bg-primary/10 text-primary text-xs text-center rounded-xl px-3 py-2 border border-primary/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          Hi! Keep your profile updated for better care 💙
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileTab;
