import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Clock, Save, Loader2 } from "lucide-react";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface AvailabilityTabProps {
  userId: string;
  doctorId: string | null;
}

interface SlotRow {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  id?: string;
}

const defaultSlots: SlotRow[] = DAYS.map((_, i) => ({
  day_of_week: i,
  start_time: "09:00",
  end_time: "17:00",
  is_available: i >= 1 && i <= 5, // Mon-Fri default
}));

const AvailabilityTab: React.FC<AvailabilityTabProps> = ({ userId, doctorId }) => {
  const { toast } = useToast();
  const [slots, setSlots] = useState<SlotRow[]>(defaultSlots);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!doctorId) { setLoading(false); return; }
    const fetch = async () => {
      const { data } = await supabase
        .from("doctor_availability")
        .select("*")
        .eq("doctor_id", doctorId)
        .order("day_of_week");
      if (data && data.length > 0) {
        const merged = defaultSlots.map((ds) => {
          const found = data.find((d: any) => d.day_of_week === ds.day_of_week);
          return found
            ? { ...ds, start_time: found.start_time?.slice(0, 5), end_time: found.end_time?.slice(0, 5), is_available: found.is_available, id: found.id }
            : ds;
        });
        setSlots(merged);
      }
      setLoading(false);
    };
    fetch();
  }, [doctorId]);

  const updateSlot = (dayIndex: number, field: keyof SlotRow, value: any) => {
    setSlots((prev) =>
      prev.map((s) => (s.day_of_week === dayIndex ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = async () => {
    if (!doctorId) return;
    setSaving(true);
    try {
      for (const slot of slots) {
        const payload = {
          doctor_id: doctorId,
          user_id: userId,
          day_of_week: slot.day_of_week,
          start_time: slot.start_time,
          end_time: slot.end_time,
          is_available: slot.is_available,
        };
        if (slot.id) {
          const { error } = await supabase
            .from("doctor_availability")
            .update(payload)
            .eq("id", slot.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("doctor_availability")
            .insert(payload);
          if (error) throw error;
        }
      }
      toast({ title: "Availability saved" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (!doctorId) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No doctor profile linked. Contact an administrator.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" /> Weekly Availability
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {slots.map((slot) => (
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
        <div className="mt-6">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Availability
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailabilityTab;
