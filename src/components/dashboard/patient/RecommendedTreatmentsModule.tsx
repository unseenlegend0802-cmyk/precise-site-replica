import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Clock, CheckCircle2, ArrowRight, Building2 } from "lucide-react";

interface ScanReport {
  id: string;
  file_name: string;
  summary: string;
  detected_conditions: string[];
  created_at: string;
}

interface Appointment {
  id: string;
  doctor_name: string;
  hospital_name: string;
  medical_issue?: string | null;
  consultation_notes?: string | null;
  status: string;
}

interface RecommendedTreatmentsModuleProps {
  reports: ScanReport[];
  appointments: Appointment[];
}

const RecommendedTreatmentsModule: React.FC<RecommendedTreatmentsModuleProps> = ({ reports, appointments }) => {
  // Build treatment recommendations from reports + consultation notes
  const conditions = new Set<string>();
  reports.forEach((r) => r.detected_conditions?.forEach((c) => conditions.add(c)));

  const completedConsults = appointments.filter(
    (a) => (a.status === "completed" || a.status === "confirmed") && a.consultation_notes
  );

  if (conditions.size === 0 && completedConsults.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary" /> Recommended Treatments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Upload a report or complete a consultation to get personalized treatment recommendations.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Heart className="w-4 h-4 text-primary" /> Recommended Treatments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from(conditions).slice(0, 3).map((condition) => {
          const relatedDoc = appointments.find(
            (a) => a.medical_issue?.toLowerCase().includes(condition.toLowerCase()) && a.status !== "cancelled"
          );

          return (
            <div key={condition} className="p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{condition}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Minimally invasive IR procedure recommended</p>
                </div>
                <Badge variant="outline" className="text-[10px] border-primary/40 text-primary shrink-0">IR Procedure</Badge>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Recovery: 2-5 days</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> High success rate</span>
                {relatedDoc && (
                  <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {relatedDoc.hospital_name}</span>
                )}
              </div>
              <div className="flex gap-2 pt-1">
                <Button asChild size="sm" variant="outline" className="text-xs gap-1">
                  <Link to={`/treatments`}>Understand Procedure <ArrowRight className="w-3 h-3" /></Link>
                </Button>
                <Button asChild size="sm" className="text-xs gap-1 bg-gradient-to-r from-primary to-pink-600">
                  <Link to="/find-hospital">Book Admission <ArrowRight className="w-3 h-3" /></Link>
                </Button>
              </div>
            </div>
          );
        })}

        {completedConsults.slice(0, 2).map((c) =>
          c.consultation_notes ? (
            <div key={c.id} className="p-3 rounded-lg bg-secondary/50 space-y-1">
              <p className="text-xs font-medium text-foreground">Doctor's Note — {c.doctor_name}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{c.consultation_notes}</p>
            </div>
          ) : null
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendedTreatmentsModule;
