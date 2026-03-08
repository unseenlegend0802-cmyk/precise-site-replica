import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface DoctorProcedure {
  id: string;
  procedure_name: string;
  procedure_slug: string | null;
  procedure_count: number;
  success_rate: number;
}

interface ProcedurePortfolioProps {
  procedures: DoctorProcedure[];
}

const ProcedurePortfolio = ({ procedures }: ProcedurePortfolioProps) => {
  if (procedures.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Star className="w-5 h-5 text-primary" /> Procedure Success Portfolio
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {procedures.map((p) => (
          <Card key={p.id} className="border-border bg-card-gradient hover:border-primary/50 transition-colors">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  {p.procedure_slug ? (
                    <Link to={`/treatment/${p.procedure_slug}`} className="font-semibold text-foreground hover:text-primary transition-colors">
                      {p.procedure_name}
                    </Link>
                  ) : (
                    <p className="font-semibold text-foreground">{p.procedure_name}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5">{p.procedure_count}+ procedures performed</p>
                </div>
                <Badge variant="secondary" className="text-xs">{p.success_rate}%</Badge>
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Success Rate</span>
                  <span>{p.success_rate}%</span>
                </div>
                <Progress value={p.success_rate} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProcedurePortfolio;
