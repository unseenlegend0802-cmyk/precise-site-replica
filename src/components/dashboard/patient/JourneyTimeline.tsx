import React from "react";
import { Upload, Search, Calendar, Stethoscope, ClipboardList, Building2, HeartPulse, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type PatientStage =
  | "new"
  | "report_uploaded"
  | "doctor_selected"
  | "op_booked"
  | "op_completed"
  | "procedure_recommended"
  | "ip_booked"
  | "ip_completed"
  | "followup_due"
  | "completed";

interface JourneyTimelineProps {
  currentStage: PatientStage;
}

const stages: { key: PatientStage; label: string; icon: React.ElementType }[] = [
  { key: "report_uploaded", label: "Report Uploaded", icon: Upload },
  { key: "doctor_selected", label: "Doctor Selected", icon: Search },
  { key: "op_booked", label: "Consultation Booked", icon: Calendar },
  { key: "op_completed", label: "Consultation Done", icon: Stethoscope },
  { key: "procedure_recommended", label: "Procedure Recommended", icon: ClipboardList },
  { key: "ip_booked", label: "Admission Booked", icon: Building2 },
  { key: "ip_completed", label: "Procedure Done", icon: HeartPulse },
  { key: "followup_due", label: "Follow-Up", icon: UserCheck },
];

const stageOrder: PatientStage[] = [
  "new",
  "report_uploaded",
  "doctor_selected",
  "op_booked",
  "op_completed",
  "procedure_recommended",
  "ip_booked",
  "ip_completed",
  "followup_due",
  "completed",
];

const JourneyTimeline: React.FC<JourneyTimelineProps> = ({ currentStage }) => {
  const currentIdx = stageOrder.indexOf(currentStage);

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center min-w-[700px] gap-0">
        {stages.map((s, i) => {
          const sIdx = stageOrder.indexOf(s.key);
          const isCompleted = sIdx < currentIdx || currentStage === "completed";
          const isCurrent = sIdx === currentIdx;
          const Icon = s.icon;

          return (
            <React.Fragment key={s.key}>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all",
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : isCurrent
                      ? "border-primary bg-primary/20 text-primary animate-pulse"
                      : "border-muted bg-muted/50 text-muted-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={cn(
                    "text-[10px] text-center leading-tight max-w-[80px]",
                    isCompleted || isCurrent ? "text-foreground font-medium" : "text-muted-foreground"
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < stages.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 -mt-5 min-w-[20px]",
                    sIdx < currentIdx ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default JourneyTimeline;
