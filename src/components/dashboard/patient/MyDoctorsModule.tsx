import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, ArrowRight } from "lucide-react";

interface Appointment {
  id: string;
  doctor_name: string;
  hospital_name: string;
  status: string;
  appointment_date: string;
  medical_issue?: string | null;
}

interface MyDoctorsModuleProps {
  appointments: Appointment[];
}

const MyDoctorsModule: React.FC<MyDoctorsModuleProps> = ({ appointments }) => {
  // Deduplicate doctors from appointments
  const doctorMap = new Map<string, { name: string; hospital: string; lastVisit: string; issue?: string | null }>();
  appointments
    .filter((a) => a.status !== "cancelled" && a.status !== "rejected")
    .forEach((a) => {
      if (!doctorMap.has(a.doctor_name) || new Date(a.appointment_date) > new Date(doctorMap.get(a.doctor_name)!.lastVisit)) {
        doctorMap.set(a.doctor_name, {
          name: a.doctor_name,
          hospital: a.hospital_name,
          lastVisit: a.appointment_date,
          issue: a.medical_issue,
        });
      }
    });

  const doctors = Array.from(doctorMap.values());

  if (doctors.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-primary" /> My Doctors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No doctors consulted yet.</p>
          <Button asChild size="sm" variant="outline" className="mt-3 gap-1">
            <Link to="/find-hospital">Find a Doctor <ArrowRight className="w-3 h-3" /></Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-primary" /> My Doctors
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {doctors.slice(0, 3).map((d) => (
          <div key={d.name} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-secondary/50">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{d.name}</p>
              <p className="text-xs text-muted-foreground truncate">{d.hospital}</p>
              {d.issue && <Badge variant="outline" className="mt-1 text-[10px] border-primary/30 text-primary">{d.issue}</Badge>}
            </div>
            <Button asChild size="sm" variant="outline" className="shrink-0 gap-1 text-xs">
              <Link to="/find-hospital">Continue <ArrowRight className="w-3 h-3" /></Link>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MyDoctorsModule;
