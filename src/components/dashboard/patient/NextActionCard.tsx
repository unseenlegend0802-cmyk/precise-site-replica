import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Search, Calendar, ClipboardList, Building2, UserCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

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

interface NextActionCardProps {
  stage: PatientStage;
  conditionName?: string;
}

const stageConfig: Record<
  PatientStage,
  { title: string; description: string; icon: React.ElementType; action: string; link: string; color: string }
> = {
  new: {
    title: "Upload Your Medical Report",
    description: "Start your treatment journey by uploading a scan report for AI-powered analysis.",
    icon: Upload,
    action: "Upload Report",
    link: "/scan-report",
    color: "from-primary to-pink-600",
  },
  report_uploaded: {
    title: "Find a Specialist Doctor",
    description: "Your report has been analyzed. Let's find the right Interventional Radiologist for you.",
    icon: Search,
    action: "Find Doctor",
    link: "/find-hospital",
    color: "from-blue-600 to-cyan-500",
  },
  doctor_selected: {
    title: "Book Your Consultation",
    description: "You've selected a doctor. Book an outpatient consultation to discuss your treatment options.",
    icon: Calendar,
    action: "Book Consultation",
    link: "/find-hospital",
    color: "from-emerald-600 to-teal-500",
  },
  op_booked: {
    title: "Consultation Scheduled",
    description: "Your OP consultation is booked. Please attend on time and carry all relevant reports.",
    icon: Calendar,
    action: "View Appointments",
    link: "#appointments",
    color: "from-amber-600 to-orange-500",
  },
  op_completed: {
    title: "View Your Treatment Plan",
    description: "Your consultation is complete. Review the recommended treatment plan from your doctor.",
    icon: ClipboardList,
    action: "View Treatment Plan",
    link: "#treatments",
    color: "from-violet-600 to-purple-500",
  },
  procedure_recommended: {
    title: "Book Your Admission",
    description: "A minimally invasive procedure has been recommended. Book your inpatient admission now.",
    icon: Building2,
    action: "Book Admission",
    link: "/find-hospital",
    color: "from-primary to-rose-500",
  },
  ip_booked: {
    title: "Admission Confirmed",
    description: "Your procedure admission is booked. Follow pre-procedure guidelines shared by your doctor.",
    icon: Building2,
    action: "View Details",
    link: "#appointments",
    color: "from-emerald-600 to-green-500",
  },
  ip_completed: {
    title: "Recovery in Progress",
    description: "Your procedure is complete. Follow post-care instructions and track your recovery.",
    icon: UserCheck,
    action: "Recovery Guide",
    link: "#timeline",
    color: "from-teal-600 to-cyan-500",
  },
  followup_due: {
    title: "Book Your Follow-Up",
    description: "It's time for your follow-up appointment. Stay on track with your recovery journey.",
    icon: Calendar,
    action: "Book Follow-Up",
    link: "/find-hospital",
    color: "from-amber-500 to-orange-500",
  },
  completed: {
    title: "Treatment Journey Complete",
    description: "Congratulations! Your treatment journey is complete. Stay healthy and reach out anytime.",
    icon: UserCheck,
    action: "View Timeline",
    link: "#timeline",
    color: "from-emerald-500 to-green-500",
  },
};

const NextActionCard: React.FC<NextActionCardProps> = ({ stage, conditionName }) => {
  const config = stageConfig[stage] || stageConfig.new;
  const Icon = config.icon;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <Card className="border-primary/30 overflow-hidden relative">
        <div className={`absolute inset-0 bg-gradient-to-r ${config.color} opacity-10`} />
        <CardContent className="p-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${config.color} shrink-0`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">Next Recommended Action</p>
              <h3 className="text-lg font-bold text-foreground">{config.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{config.description}</p>
              {conditionName && (
                <p className="text-xs text-primary mt-1">Detected condition: {conditionName}</p>
              )}
            </div>
            <Button asChild className="gap-2 shrink-0 bg-gradient-to-r from-primary to-pink-600 hover:opacity-90">
              <Link to={config.link}>
                {config.action} <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NextActionCard;
