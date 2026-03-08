import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Save, Loader2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ConsultationNotesTabProps {
  appointments: any[];
  onRefresh: () => void;
}

const ConsultationNotesTab: React.FC<ConsultationNotesTabProps> = ({ appointments, onRefresh }) => {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [saving, setSaving] = useState(false);

  // Show completed or past appointments for notes
  const relevantAppts = appointments.filter(
    (a) => a.status === "completed" || new Date(a.appointment_date) < new Date(new Date().toDateString())
  );

  const startEdit = (appt: any) => {
    setEditingId(appt.id);
    setNoteText(appt.consultation_notes || "");
  };

  const saveNote = async (id: string) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ consultation_notes: noteText })
        .eq("id", id);
      if (error) throw error;
      toast({ title: "Notes saved" });
      setEditingId(null);
      onRefresh();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (relevantAppts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No past consultations to add notes for.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {relevantAppts.map((a) => (
        <Card key={a.id} className="hover:border-primary/30 transition-colors">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-foreground">{a.patient_name || "Patient"}</p>
                <p className="text-sm text-muted-foreground">{a.medical_issue || "General"}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {new Date(a.appointment_date).toLocaleDateString("en-IN", {
                    weekday: "short", year: "numeric", month: "short", day: "numeric",
                  })} · {a.time_slot}
                </div>
              </div>
              <Badge variant={a.status === "completed" ? "default" : "secondary"}>{a.status}</Badge>
            </div>

            {editingId === a.id ? (
              <div className="space-y-2">
                <textarea
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Add consultation notes, diagnosis, prescriptions..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => saveNote(a.id)} disabled={saving} className="gap-1">
                    {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div>
                {a.consultation_notes ? (
                  <div className="bg-muted/50 rounded-md p-3 text-sm">
                    <p className="text-foreground whitespace-pre-wrap">{a.consultation_notes}</p>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No notes added yet.</p>
                )}
                <Button size="sm" variant="outline" className="mt-2 gap-1 text-xs" onClick={() => startEdit(a)}>
                  <ClipboardList className="w-3 h-3" /> {a.consultation_notes ? "Edit Notes" : "Add Notes"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ConsultationNotesTab;
