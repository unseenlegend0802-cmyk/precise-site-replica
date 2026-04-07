import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Stethoscope, FileText, Calendar as CalendarIcon } from "lucide-react";

interface Appointment {
  id: string;
  doctor_name: string;
  hospital_name: string;
  appointment_date: string;
  time_slot: string;
  status: string;
  medical_issue?: string | null;
  consultation_notes?: string | null;
}

interface ScanReport {
  id: string;
  file_name: string;
  summary: string;
  detected_conditions: string[];
  created_at: string;
}

interface MedicalTimelineTabProps {
  appointments: Appointment[];
  reports: ScanReport[];
}

type TimelineEvent = {
  id: string;
  date: Date;
  type: "appointment" | "report";
  title: string;
  subtitle: string;
  detail?: string;
  status?: string;
  badges?: string[];
};

const MedicalTimelineTab: React.FC<MedicalTimelineTabProps> = ({ appointments, reports }) => {
  const events: TimelineEvent[] = [];

  appointments.forEach((a) => {
    events.push({
      id: `appt-${a.id}`,
      date: new Date(a.appointment_date),
      type: "appointment",
      title: `Consultation with ${a.doctor_name}`,
      subtitle: a.hospital_name,
      detail: a.medical_issue || undefined,
      status: a.status,
    });
  });

  reports.forEach((r) => {
    events.push({
      id: `report-${r.id}`,
      date: new Date(r.created_at),
      type: "report",
      title: r.file_name || "Scan Report",
      subtitle: r.summary || "Report uploaded",
      badges: r.detected_conditions,
    });
  });

  events.sort((a, b) => b.date.getTime() - a.date.getTime());

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No medical history yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Your appointments and reports will form a timeline here.</p>
        </CardContent>
      </Card>
    );
  }

  // Group by month-year
  const grouped = new Map<string, TimelineEvent[]>();
  events.forEach((e) => {
    const key = e.date.toLocaleDateString("en-IN", { year: "numeric", month: "long" });
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(e);
  });

  const statusVariant = (s?: string) => {
    if (s === "confirmed") return "default";
    if (s === "cancelled") return "destructive";
    if (s === "completed") return "secondary";
    return "outline";
  };

  return (
    <div className="space-y-6">
      {Array.from(grouped.entries()).map(([monthYear, items]) => (
        <div key={monthYear}>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            {monthYear}
          </h3>
          <div className="relative ml-4 border-l-2 border-muted pl-6 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="relative">
                {/* Timeline dot */}
                <div
                  className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-background ${
                    item.type === "appointment" ? "bg-primary" : "bg-accent"
                  }`}
                />
                <Card className="hover:border-primary/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {item.type === "appointment" ? (
                        <Stethoscope className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-accent-foreground mt-0.5 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="font-medium text-sm text-foreground truncate">{item.title}</p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {item.date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">{item.subtitle}</p>
                        {item.detail && (
                          <p className="text-xs text-muted-foreground mt-1">Issue: {item.detail}</p>
                        )}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.status && (
                            <Badge variant={statusVariant(item.status)} className="text-xs capitalize">
                              {item.status}
                            </Badge>
                          )}
                          {item.badges?.map((b) => (
                            <Badge key={b} variant="outline" className="text-xs border-primary/40 text-primary">
                              {b}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MedicalTimelineTab;
