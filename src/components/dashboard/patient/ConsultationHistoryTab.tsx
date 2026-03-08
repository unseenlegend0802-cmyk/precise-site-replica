import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Calendar } from "lucide-react";

interface Appointment {
  id: string;
  doctor_name: string;
  hospital_name: string;
  appointment_date: string;
  time_slot: string;
  status: string;
  medical_issue?: string | null;
}

interface ConsultationHistoryTabProps {
  appointments: Appointment[];
}

const ConsultationHistoryTab: React.FC<ConsultationHistoryTabProps> = ({ appointments }) => {
  const completed = appointments.filter(
    (a) => a.status === "completed" || (a.status === "confirmed" && new Date(a.appointment_date) < new Date(new Date().toDateString()))
  );

  if (completed.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Stethoscope className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No past consultations found.</p>
          <p className="text-xs text-muted-foreground mt-1">Your completed appointments will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {completed.map((a) => (
        <Card key={a.id} className="hover:border-primary/30 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Stethoscope className="w-4 h-4 text-primary shrink-0" />
                  <p className="font-semibold text-foreground">{a.doctor_name}</p>
                </div>
                <p className="text-sm text-muted-foreground">{a.hospital_name}</p>
                {a.medical_issue && (
                  <p className="text-xs text-muted-foreground mt-1">Concern: {a.medical_issue}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant="secondary">Completed</Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(a.appointment_date).toLocaleDateString("en-IN", {
                    year: "numeric", month: "short", day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ConsultationHistoryTab;
