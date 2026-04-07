import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, ArrowRight } from "lucide-react";

interface Appointment {
  id: string;
  doctor_name: string;
  hospital_name: string;
  appointment_date: string;
  time_slot: string;
  status: string;
  medical_issue?: string | null;
}

interface TreatmentsTabProps {
  appointments: Appointment[];
}

const statusColor: Record<string, string> = {
  confirmed: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
};

const TreatmentsTab: React.FC<TreatmentsTabProps> = ({ appointments }) => {
  // Group appointments by medical_issue to create "treatment plans"
  const treatmentMap = new Map<string, Appointment[]>();
  appointments.forEach((a) => {
    const issue = a.medical_issue || "General Consultation";
    if (!treatmentMap.has(issue)) treatmentMap.set(issue, []);
    treatmentMap.get(issue)!.push(a);
  });

  if (treatmentMap.size === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No treatments recorded yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Your treatment plans will appear here once you book appointments.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {Array.from(treatmentMap.entries()).map(([issue, appts]) => {
        const latest = appts[0];
        const isOngoing = appts.some(
          (a) => a.status !== "cancelled" && new Date(a.appointment_date) >= new Date(new Date().toDateString())
        );
        return (
          <Card key={issue} className="hover:border-primary/30 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary shrink-0" />
                  <h3 className="font-semibold text-foreground">{issue}</h3>
                </div>
                <Badge variant={isOngoing ? "default" : "secondary"}>
                  {isOngoing ? "Ongoing" : "Completed"}
                </Badge>
              </div>
              <div className="ml-7 space-y-2">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Doctor:</span> {latest.doctor_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Hospital:</span> {latest.hospital_name}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                  <Calendar className="w-3 h-3" />
                  <span>{appts.length} visit{appts.length > 1 ? "s" : ""}</span>
                  <ArrowRight className="w-3 h-3" />
                  <span>
                    Latest:{" "}
                    {new Date(latest.appointment_date).toLocaleDateString("en-IN", {
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

export default TreatmentsTab;
