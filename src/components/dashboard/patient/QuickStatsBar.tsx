import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Calendar, Stethoscope, Activity } from "lucide-react";

interface QuickStatsBarProps {
  reportsCount: number;
  upcomingCount: number;
  doctorsCount: number;
  completedCount: number;
}

const QuickStatsBar: React.FC<QuickStatsBarProps> = ({
  reportsCount,
  upcomingCount,
  doctorsCount,
  completedCount,
}) => {
  const stats = [
    { label: "Reports", value: reportsCount, icon: FileText, color: "text-blue-400" },
    { label: "Upcoming", value: upcomingCount, icon: Calendar, color: "text-emerald-400" },
    { label: "Doctors", value: doctorsCount, icon: Stethoscope, color: "text-violet-400" },
    { label: "Completed", value: completedCount, icon: Activity, color: "text-amber-400" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((s) => (
        <Card key={s.label} className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <s.icon className={`w-5 h-5 ${s.color} shrink-0`} />
            <div>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickStatsBar;
