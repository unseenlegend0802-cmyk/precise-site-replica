import { Link } from "react-router-dom";
import { MapPin, Clock, CalendarCheck, IndianRupee, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hospital } from "@/data/hospitals";

interface PracticingLocationsProps {
  hospitals: Hospital[];
  doctorName: string;
}

const PracticingLocations = ({ hospitals, doctorName }: PracticingLocationsProps) => {
  if (hospitals.length === 0) return null;

  return (
    <div className="mb-8" id="book-section">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-primary" /> Practicing Locations
      </h2>
      <div className="grid gap-4">
        {hospitals.map((h, i) => (
          <Card key={i} className="border-border bg-card-gradient hover:border-primary/30 transition-colors">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Hospital Info */}
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-foreground text-lg">{h.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />{h.address}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {h.availableTime && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-primary" />{h.availableTime}
                      </span>
                    )}
                    {h.consultationFee && (
                      <Badge variant="secondary" className="text-xs gap-1">
                        <IndianRupee className="w-3 h-3" /> {h.consultationFee}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 sm:items-end shrink-0">
                  <Button asChild className="rounded-full px-6">
                    <Link to={`/find-hospital?doctor=${encodeURIComponent(doctorName)}`}>
                      <CalendarCheck className="w-4 h-4 mr-1.5" /> Book Appointment
                    </Link>
                  </Button>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${h.mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3" /> Get Directions
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PracticingLocations;
