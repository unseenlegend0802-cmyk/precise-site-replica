import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Stethoscope } from "lucide-react";

interface Appointment {
  id: string;
  doctor_name: string;
  hospital_name: string;
  appointment_date: string;
  time_slot: string;
  status: string;
  medical_issue?: string | null;
}

interface FollowUpsTabProps {
  appointments: Appointment[];
}

const FollowUpsTab: React.FC<FollowUpsTabProps> = ({ appointments }) => {
  const today = new Date(new Date().toDateString());

  // Follow-ups: upcoming confirmed appointments (future dates)
  const followUps = appointments.filter(
    (a) => a.status === "confirmed" && new Date(a.appointment_date) >= today
  ).sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime());

  if (followUps.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No upcoming follow-ups.</p>
          <p className="text-xs text-muted-foreground mt-1">Scheduled follow-up appointments will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {followUps.map((a) => {
        const apptDate = new Date(a.appointment_date);
        const diffDays = Math.ceil((apptDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const isToday = diffDays === 0;
        const isTomorrow = diffDays === 1;

        return (
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
                  <p className="text-xs text-muted-foreground mt-1">Time: {a.time_slot}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge
                    variant={isToday ? "destructive" : isTomorrow ? "default" : "secondary"}
                  >
                    {isToday ? "Today" : isTomorrow ? "Tomorrow" : `In ${diffDays} days`}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {apptDate.toLocaleDateString("en-IN", {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default FollowUpsTab;
