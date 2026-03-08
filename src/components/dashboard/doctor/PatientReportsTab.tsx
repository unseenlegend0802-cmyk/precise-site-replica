import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface PatientReportsTabProps {
  appointments: any[];
}

interface ReportWithPatient {
  id: string;
  file_name: string;
  summary: string;
  detected_conditions: string[];
  created_at: string;
  patient_name?: string;
}

const PatientReportsTab: React.FC<PatientReportsTabProps> = ({ appointments }) => {
  const [reports, setReports] = useState<ReportWithPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      // Get unique patient user_ids from appointments
      const userIds = [...new Set(appointments.map((a) => a.user_id))];
      if (userIds.length === 0) {
        setReports([]);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("scan_reports")
        .select("id, file_name, summary, detected_conditions, created_at, user_id")
        .in("user_id", userIds)
        .order("created_at", { ascending: false });

      if (data) {
        // Map user_id to patient_name from appointments
        const userNameMap: Record<string, string> = {};
        appointments.forEach((a) => {
          if (a.user_id && a.patient_name) userNameMap[a.user_id] = a.patient_name;
        });

        setReports(
          data.map((r: any) => ({
            ...r,
            patient_name: userNameMap[r.user_id] || "Patient",
          }))
        );
      }
      setLoading(false);
    };
    fetchReports();
  }, [appointments]);

  const filtered = reports.filter(
    (r) =>
      r.patient_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.file_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.detected_conditions?.some((c) => c.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Loading patient reports...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by patient, file, or condition..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No patient reports found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <Card key={r.id} className="hover:border-primary/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-primary shrink-0" />
                      <p className="font-medium truncate">{r.file_name || "Report"}</p>
                      <Badge variant="outline" className="text-xs">{r.patient_name}</Badge>
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
      )}
    </div>
  );
};

export default PatientReportsTab;
