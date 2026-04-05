import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Check, X, Loader2, Clock, RefreshCw, User, Phone } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { generateSlots } from "@/utils/generateSlots";

interface DoctorAppointmentsTabProps {
  appointments: any[];
  onRefresh: () => void;
}

const statusConfig: Record<string, { variant: string; label: string }> = {
  pending: { variant: "outline", label: "Pending" },
  confirmed: { variant: "default", label: "Accepted" },
  rejected: { variant: "destructive", label: "Rejected" },
  cancelled: { variant: "destructive", label: "Cancelled" },
  completed: { variant: "secondary", label: "Completed" },
  rescheduled: { variant: "outline", label: "Rescheduled" },
};

const DoctorAppointmentsTab: React.FC<DoctorAppointmentsTabProps> = ({ appointments, onRefresh }) => {
  const { toast } = useToast();
  const [updating, setUpdating] = useState<string | null>(null);
  const [rescheduleAppt, setRescheduleAppt] = useState<any | null>(null);
  const [newDate, setNewDate] = useState<Date>();
  const [newSlot, setNewSlot] = useState("");
  const [rescheduling, setRescheduling] = useState(false);

  const today = new Date(new Date().toDateString());

  const pending = appointments.filter((a) => a.status === "pending");
  const upcoming = appointments.filter(
    (a) => ["confirmed", "rescheduled"].includes(a.status) && new Date(a.appointment_date) >= today
  );
  const past = appointments.filter(
    (a) => ["cancelled", "completed", "rejected"].includes(a.status) || new Date(a.appointment_date) < today
  );

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
      if (error) throw error;
      toast({ title: `Appointment ${status}` });
      onRefresh();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setUpdating(null);
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleAppt || !newDate || !newSlot) return;
    setRescheduling(true);
    try {
      const { error } = await supabase
        .from("appointments")
        .update({
          appointment_date: format(newDate, "yyyy-MM-dd"),
          time_slot: newSlot,
          status: "rescheduled",
        })
        .eq("id", rescheduleAppt.id);
      if (error) throw error;
      toast({ title: "Appointment rescheduled" });
      setRescheduleAppt(null);
      setNewDate(undefined);
      setNewSlot("");
      onRefresh();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setRescheduling(false);
    }
  };

  // Simple slot generation for reschedule (9AM-6PM default)
  const rescheduleSlots = generateSlots("9 AM to 6 PM");

  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No appointments yet.</p>
        </CardContent>
      </Card>
    );
  }

  const renderCard = (a: any, section: "pending" | "upcoming" | "past") => {
    const cfg = statusConfig[a.status] || statusConfig.pending;
    return (
      <Card key={a.id} className="hover:border-primary/30 transition-colors">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary shrink-0" />
                <p className="font-semibold text-foreground">{a.patient_name || "Patient"}</p>
                {a.patient_age && <span className="text-xs text-muted-foreground">({a.patient_age}y{a.patient_gender ? `, ${a.patient_gender}` : ""})</span>}
              </div>
              <p className="text-sm text-muted-foreground">{a.hospital_name}</p>
              {a.medical_issue && (
                <p className="text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1 inline-block">
                  Issue: {a.medical_issue}
                </p>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {new Date(a.appointment_date).toLocaleDateString("en-IN", {
                  weekday: "short", year: "numeric", month: "short", day: "numeric",
                })} · {a.time_slot}
              </div>
              {a.patient_phone && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {a.patient_phone}
                </p>
              )}
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              <Badge variant={cfg.variant as any}>{cfg.label}</Badge>

              {/* Pending: Accept / Reject / Reschedule */}
              {section === "pending" && a.status === "pending" && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    className="gap-1 text-xs"
                    disabled={updating === a.id}
                    onClick={() => updateStatus(a.id, "confirmed")}
                  >
                    {updating === a.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-xs"
                    onClick={() => { setRescheduleAppt(a); setNewDate(undefined); setNewSlot(""); }}
                  >
                    <RefreshCw className="w-3 h-3" /> Reschedule
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="gap-1 text-xs" disabled={updating === a.id}>
                        <X className="w-3 h-3" /> Reject
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reject Appointment?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Reject the appointment request from {a.patient_name || "the patient"} on{" "}
                          {new Date(a.appointment_date).toLocaleDateString()} at {a.time_slot}?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => updateStatus(a.id, "rejected")}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Yes, Reject
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}

              {/* Upcoming accepted: only Complete button */}
              {section === "upcoming" && ["confirmed", "rescheduled"].includes(a.status) && (
                <div className="flex flex-wrap gap-2">
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
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <div className="space-y-6">
        {pending.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" /> Pending Requests ({pending.length})
            </h3>
            <div className="space-y-3">{pending.map((a) => renderCard(a, "pending"))}</div>
          </div>
        )}
        {upcoming.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Upcoming ({upcoming.length})</h3>
            <div className="space-y-3">{upcoming.map((a) => renderCard(a, "upcoming"))}</div>
          </div>
        )}
        {past.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Past</h3>
            <div className="space-y-3">{past.map((a) => renderCard(a, "past"))}</div>
          </div>
        )}
      </div>

      {/* Reschedule Dialog */}
      <Dialog open={!!rescheduleAppt} onOpenChange={(o) => { if (!o) setRescheduleAppt(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
          </DialogHeader>
          {rescheduleAppt && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Rescheduling for <span className="font-medium text-foreground">{rescheduleAppt.patient_name}</span>
              </p>
              <div className="space-y-2">
                <Label>New Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !newDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newDate ? format(newDate, "PPP") : "Pick a new date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newDate}
                      onSelect={setNewDate}
                      disabled={(d) => d < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {newDate && (
                <div className="space-y-2">
                  <Label>New Time Slot</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                    {rescheduleSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setNewSlot(slot)}
                        className={cn(
                          "px-3 py-2 rounded-lg text-sm font-medium border transition-all",
                          newSlot === slot
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card text-foreground border-border hover:border-primary/50"
                        )}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleReschedule} disabled={!newDate || !newSlot || rescheduling} className="gap-2">
              {rescheduling ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DoctorAppointmentsTab;
