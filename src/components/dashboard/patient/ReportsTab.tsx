import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Upload } from "lucide-react";

interface ScanReport {
  id: string;
  file_name: string;
  summary: string;
  detected_conditions: string[];
  created_at: string;
}

interface ReportsTabProps {
  reports: ScanReport[];
}

const ReportsTab: React.FC<ReportsTabProps> = ({ reports }) => {
  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No scan reports yet.</p>
          <Button asChild>
            <Link to="/scan-report">
              <Upload className="w-4 h-4 mr-2" /> Upload Your First Report
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button asChild size="sm" className="gap-2">
          <Link to="/scan-report">
            <Upload className="w-4 h-4" /> Upload New Report
          </Link>
        </Button>
      </div>
      <div className="space-y-3">
        {reports.map((r) => (
          <Card key={r.id} className="hover:border-primary/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-primary shrink-0" />
                    <p className="font-medium truncate">{r.file_name || "Report"}</p>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{r.summary}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {r.detected_conditions?.map((c) => (
                      <Badge key={c} variant="outline" className="text-xs border-primary/40 text-primary">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                  <Calendar className="w-3 h-3" />
                  {new Date(r.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReportsTab;
