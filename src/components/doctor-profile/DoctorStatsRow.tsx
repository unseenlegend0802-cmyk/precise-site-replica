import { TrendingUp, ShieldCheck, Heart, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DoctorStatsRowProps {
  successRate: number;
  complicationRate: number;
  avgRecoveryTime: string;
  totalProcedures: number;
}

const DoctorStatsRow = ({ successRate, complicationRate, avgRecoveryTime, totalProcedures }: DoctorStatsRowProps) => {
  const stats = [
    { icon: TrendingUp, label: "Success Rate", value: `${successRate}%`, color: "text-green-400", show: successRate > 0 },
    { icon: ShieldCheck, label: "Complication Rate", value: `${complicationRate}%`, color: "text-blue-400", show: complicationRate > 0 },
    { icon: Heart, label: "Avg Recovery", value: avgRecoveryTime, color: "text-primary", show: !!avgRecoveryTime },
    { icon: Award, label: "Total Procedures", value: totalProcedures.toLocaleString(), color: "text-yellow-400", show: totalProcedures > 0 },
  ].filter(s => s.show);

  if (stats.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, i) => (
        <Card key={i} className="border-border bg-card-gradient">
          <CardContent className="p-4 text-center">
            <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
            <p className="text-lg font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DoctorStatsRow;
