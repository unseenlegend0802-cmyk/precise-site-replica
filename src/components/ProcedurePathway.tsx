import { FileText, Brain, Search, Stethoscope, ClipboardCheck, CalendarCheck, Building2, HeartPulse, Activity, UserCheck } from "lucide-react";

const steps = [
  { icon: FileText, label: "Upload Medical Report", desc: "Share your scan or test results" },
  { icon: Brain, label: "AI Report Analysis", desc: "AI extracts key findings" },
  { icon: Search, label: "Condition Detection", desc: "Identify treatable conditions" },
  { icon: Stethoscope, label: "Consult IR Specialist", desc: "Speak with an expert" },
  { icon: ClipboardCheck, label: "Confirm Treatment Plan", desc: "Agree on best approach" },
  { icon: CalendarCheck, label: "Book Procedure", desc: "Schedule your treatment" },
  { icon: Building2, label: "Hospital Admission", desc: "Arrive for your procedure" },
  { icon: HeartPulse, label: "Procedure Performed", desc: "Minimally invasive treatment" },
  { icon: Activity, label: "Recovery", desc: "Fast recovery with support" },
  { icon: UserCheck, label: "Follow-up", desc: "Post-procedure check-up" },
];

interface Props {
  currentStep?: number; // 0-indexed, for dashboard tracking
  className?: string;
}

const ProcedurePathway = ({ currentStep, className = "" }: Props) => {
  return (
    <div className={`bg-card-gradient border border-border rounded-xl p-6 ${className}`}>
      <h3 className="text-lg font-bold text-foreground mb-6 text-center">Your Treatment Journey</h3>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {steps.map((step, i) => {
          const isActive = currentStep !== undefined && i <= currentStep;
          const isCurrent = currentStep !== undefined && i === currentStep;
          return (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                isCurrent
                  ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : isActive
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}>
                <step.icon className="w-5 h-5" />
              </div>
              <p className={`text-xs font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProcedurePathway;
