import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBooking } from "@/contexts/BookingContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, CheckCircle2, ArrowLeft, Stethoscope, MapPin, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { generateSlots } from "@/utils/generateSlots";
import { useToast } from "@/hooks/use-toast";

const BookAppointment = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { selectedHospital, patientName, medicalIssue, clearBooking, hasPendingBooking } = useBooking();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: patientName || "",
    age: "",
    gender: "",
    phone: "",
    medicalIssue: medicalIssue || "",
  });
  const [date, setDate] = useState<Date>();
  const [timeSlot, setTimeSlot] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [dbSlots, setDbSlots] = useState<string[] | null>(null);

  // Use DB availability if found, otherwise fall back to static availableTime
  const allSlots = dbSlots !== null ? dbSlots : (selectedHospital ? generateSlots(selectedHospital.availableTime) : []);
  const availableSlots = allSlots.filter((s) => !bookedSlots.includes(s));

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!loading && !hasPendingBooking) {
      navigate("/find-hospital", { replace: true });
    }
  }, [loading, hasPendingBooking, navigate]);

  // Fetch booked slots when date changes
  useEffect(() => {
    if (!date || !selectedHospital) return;
    const fetchBookedSlots = async () => {
      setLoadingSlots(true);
      setTimeSlot("");
      try {
        const dateStr = format(date, "yyyy-MM-dd");
        const { data } = await supabase
          .from("appointments")
          .select("time_slot")
          .eq("doctor_name", selectedHospital.doctor)
          .eq("hospital_name", selectedHospital.name)
          .eq("appointment_date", dateStr);
        setBookedSlots((data || []).map((r: any) => r.time_slot));
      } catch {
        setBookedSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchBookedSlots();
  }, [date, selectedHospital]);

  if (loading || !user || !selectedHospital) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !timeSlot) {
      toast({ title: "Please select a date and time slot", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("appointments").insert({
        user_id: user.id,
        doctor_name: selectedHospital.doctor,
        hospital_name: selectedHospital.name,
        appointment_date: format(date, "yyyy-MM-dd"),
        time_slot: timeSlot,
        patient_name: formData.name,
        patient_age: formData.age ? parseInt(formData.age) : null,
        patient_gender: formData.gender || null,
        patient_phone: formData.phone || null,
        medical_issue: formData.medicalIssue || null,
      });
      if (error) {
        if (error.code === "23505") {
          toast({ title: "This slot is already booked", description: "Please select a different time slot.", variant: "destructive" });
          // Refresh slots
          setBookedSlots((prev) => [...prev, timeSlot]);
          setTimeSlot("");
        } else {
          toast({ title: "Booking failed", description: error.message, variant: "destructive" });
        }
        return;
      }
      setConfirmed(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-28 pb-20 px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="border-primary/30">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Appointment Confirmed!</h2>
                  <p className="text-muted-foreground">Your appointment has been booked successfully.</p>

                  <div className="bg-secondary rounded-lg p-6 text-left space-y-3">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-primary" />
                      <span className="font-medium text-foreground">{selectedHospital.doctor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{selectedHospital.name}, {selectedHospital.city}</span>
                    </div>
                    {date && (
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">{format(date, "PPP")} at {timeSlot}</span>
                      </div>
                    )}
                    {formData.medicalIssue && (
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-primary mt-0.5" />
                        <span className="text-muted-foreground">Concern: {formData.medicalIssue}</span>
                      </div>
                    )}
                    <div className="border-t border-border pt-3 mt-3">
                      <p className="text-sm text-muted-foreground">Patient: <span className="text-foreground font-medium">{formData.name}</span></p>
                      {formData.phone && <p className="text-sm text-muted-foreground">Phone: {formData.phone}</p>}
                    </div>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={() => { clearBooking(); navigate("/"); }}>
                      Back to Home
                    </Button>
                    <Button onClick={() => { clearBooking(); navigate("/dashboard"); }}>
                      Go to Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold mb-2">
              Book <span className="text-gradient">Appointment</span>
            </h1>

            {/* Selected Doctor Summary */}
            <Card className="mb-6 border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Stethoscope className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">{selectedHospital.doctor}</p>
                    <p className="text-sm text-muted-foreground">{selectedHospital.name}, {selectedHospital.city} · {selectedHospital.specialization}</p>
                    {selectedHospital.availableTime && (
                      <p className="text-xs text-muted-foreground mt-1">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Consultation hours: {selectedHospital.availableTime}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Patient Form */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input id="age" type="number" min="1" max="120" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select value={formData.gender} onValueChange={(v) => setFormData({ ...formData, gender: v })}>
                        <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" placeholder="+91XXXXXXXXXX" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issue">Medical Issue / Concern</Label>
                    <Textarea id="issue" value={formData.medicalIssue} onChange={(e) => setFormData({ ...formData, medicalIssue: e.target.value })} rows={3} placeholder="Describe your medical concern..." />
                  </div>

                  {/* Date Selection */}
                  <div className="space-y-2">
                    <Label>Preferred Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(d) => d < new Date()}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Dynamic Time Slots */}
                  {date && (
                    <div className="space-y-2">
                      <Label>Available Time Slots</Label>
                      {loadingSlots ? (
                        <div className="flex items-center gap-2 text-muted-foreground text-sm py-3">
                          <Loader2 className="w-4 h-4 animate-spin" /> Loading available slots...
                        </div>
                      ) : allSlots.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-3">No consultation hours available for this doctor. Please contact the hospital directly.</p>
                      ) : availableSlots.length === 0 ? (
                        <p className="text-sm text-destructive py-3">All slots are booked for this date. Please choose a different date.</p>
                      ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                          {allSlots.map((slot) => {
                            const isBooked = bookedSlots.includes(slot);
                            const isSelected = timeSlot === slot;
                            return (
                              <button
                                key={slot}
                                type="button"
                                disabled={isBooked}
                                onClick={() => setTimeSlot(slot)}
                                className={cn(
                                  "px-3 py-2 rounded-lg text-sm font-medium border transition-all",
                                  isBooked
                                    ? "bg-muted text-muted-foreground border-border cursor-not-allowed line-through opacity-50"
                                    : isSelected
                                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                                    : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
                                )}
                              >
                                {slot}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  <Button type="submit" className="w-full" size="lg" disabled={submitting || !date || !timeSlot}>
                    {submitting ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Booking...</>
                    ) : (
                      "Confirm Appointment"
                    )}
                  </Button>
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

export default BookAppointment;
