import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, X, RefreshCw, Loader2, MapPin } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  doctor_name: string;
  hospital_name: string;
  appointment_date: string;
  time_slot: string;
  status: string;
  medical_issue?: string | null;
}

interface AppointmentsTabProps {
  appointments: Appointment[];
  onRefresh: () => void;
}

const statusColor = (status: string) => {
  switch (status) {
    case "confirmed": return "default";
    case "cancelled": return "destructive";
    case "completed": return "secondary";
    default: return "outline";
  }
};

const AppointmentsTab: React.FC<AppointmentsTabProps> = ({ appointments, onRefresh }) => {
  const { toast } = useToast();
  const [cancelling, setCancelling] = useState<string | null>(null);

  const upcoming = appointments.filter(
    (a) => a.status !== "cancelled" && new Date(a.appointment_date) >= new Date(new Date().toDateString())
  );
  const past = appointments.filter(
    (a) => a.status === "cancelled" || new Date(a.appointment_date) < new Date(new Date().toDateString())
  );

  const cancelAppointment = async (id: string) => {
    setCancelling(id);
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", id);
      if (error) throw error;
      toast({ title: "Appointment cancelled successfully" });
      onRefresh();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setCancelling(null);
    }
  };

  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No appointments yet.</p>
          <Button asChild>
            <Link to="/find-hospital">Find a Doctor</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const renderAppointmentCard = (a: Appointment, showActions: boolean) => (
    <Card key={a.id} className="hover:border-primary/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground">{a.doctor_name}</p>
            <p className="text-sm text-muted-foreground">{a.hospital_name}</p>
            {a.medical_issue && (
              <p className="text-xs text-muted-foreground mt-1">Issue: {a.medical_issue}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(a.appointment_date).toLocaleDateString("en-IN", {
                weekday: "short", year: "numeric", month: "short", day: "numeric",
              })} · {a.time_slot}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={statusColor(a.status) as any}>{a.status}</Badge>
            {showActions && a.status === "confirmed" && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild className="gap-1 text-xs">
                  <Link to="/find-hospital">
                    <RefreshCw className="w-3 h-3" /> Reschedule
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="gap-1 text-xs" disabled={cancelling === a.id}>
                      {cancelling === a.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
                      Cancel
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Appointment?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will cancel your appointment with {a.doctor_name} on{" "}
                        {new Date(a.appointment_date).toLocaleDateString()} at {a.time_slot}. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                      <AlertDialogAction onClick={() => cancelAppointment(a.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Yes, Cancel
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Upcoming</h3>
          <div className="space-y-3">{upcoming.map((a) => renderAppointmentCard(a, true))}</div>
        </div>
      )}
      {past.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Past</h3>
          <div className="space-y-3">{past.map((a) => renderAppointmentCard(a, false))}</div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsTab;
