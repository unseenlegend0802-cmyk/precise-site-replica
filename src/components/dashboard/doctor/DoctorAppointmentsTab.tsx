import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Check, X, Loader2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DoctorAppointmentsTabProps {
  appointments: any[];
  onRefresh: () => void;
}

const statusColor = (s: string) => {
  switch (s) {
    case "confirmed": return "default";
    case "cancelled": return "destructive";
    case "completed": return "secondary";
    default: return "outline";
  }
};

const DoctorAppointmentsTab: React.FC<DoctorAppointmentsTabProps> = ({ appointments, onRefresh }) => {
  const { toast } = useToast();
  const [updating, setUpdating] = useState<string | null>(null);

  const today = new Date(new Date().toDateString());
  const upcoming = appointments.filter(
    (a) => a.status !== "cancelled" && new Date(a.appointment_date) >= today
  );
  const past = appointments.filter(
    (a) => a.status === "cancelled" || new Date(a.appointment_date) < today
  );

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
      toast({ title: `Appointment ${status}` });
      onRefresh();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setUpdating(null);
    }
  };

  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No appointments yet.</p>
        </CardContent>
      </Card>
    );
  }

  const renderCard = (a: any, showActions: boolean) => (
    <Card key={a.id} className="hover:border-primary/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground">{a.patient_name || "Patient"}</p>
            <p className="text-sm text-muted-foreground">{a.hospital_name}</p>
            {a.medical_issue && (
              <p className="text-xs text-muted-foreground mt-1">Issue: {a.medical_issue}</p>
            )}
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {new Date(a.appointment_date).toLocaleDateString("en-IN", {
                weekday: "short", year: "numeric", month: "short", day: "numeric",
              })} · {a.time_slot}
            </div>
            {a.patient_phone && (
              <p className="text-xs text-muted-foreground mt-1">📞 {a.patient_phone}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={statusColor(a.status) as any}>{a.status}</Badge>
            {showActions && a.status === "confirmed" && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs"
                  disabled={updating === a.id}
                  onClick={() => updateStatus(a.id, "completed")}
                >
                  {updating === a.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                  Complete
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-1 text-xs"
                  disabled={updating === a.id}
                  onClick={() => updateStatus(a.id, "cancelled")}
                >
                  <X className="w-3 h-3" /> Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {upcoming.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Upcoming</h3>
          <div className="space-y-3">{upcoming.map((a) => renderCard(a, true))}</div>
        </div>
      )}
      {past.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Past</h3>
          <div className="space-y-3">{past.map((a) => renderCard(a, false))}</div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointmentsTab;
