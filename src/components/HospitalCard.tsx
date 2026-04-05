import { Hospital } from "@/data/hospitals";
import { MapPin, Stethoscope, GraduationCap, Clock, CalendarCheck, IndianRupee, Navigation2 } from "lucide-react";
import { formatDistance } from "@/utils/hospitalDistance";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HospitalCardProps {
  hospital: Hospital & { distance?: number };
  isSelected?: boolean;
  onClick?: () => void;
  onBook?: (hospital: Hospital) => void;
  className?: string;
}

const HospitalCard = ({ hospital: h, isSelected, onClick, onBook, className = "" }: HospitalCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl border p-5 transition-all duration-200 ${
        isSelected
          ? "border-primary bg-primary/5 shadow-md"
          : "border-border bg-card hover:border-primary/40"
      } ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <Avatar className="w-16 h-16 shrink-0 border-2 border-primary/20">
          {h.doctorImage ? <AvatarImage src={h.doctorImage} alt={h.doctor} /> : null}
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
            {h.doctor.split(" ").filter(w => w.length > 2).map(w => w[0]).join("").slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-foreground text-lg">{h.name}</h3>
            <div className="flex items-center gap-1.5 shrink-0">
              {(h as any).distance !== undefined && (
                <Badge variant="outline" className="gap-1 text-primary border-primary/30">
                  <Navigation2 className="w-3 h-3" />
                  {formatDistance((h as any).distance)}
                </Badge>
              )}
              <Badge variant="secondary">{h.city}</Badge>
            </div>
          </div>

          <Link
            to={`/doctor/${h.doctor.toLowerCase().replace(/\./g, "").replace(/\s+/g, "-")}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 text-primary font-medium hover:underline"
          >
            <Stethoscope className="w-4 h-4" />
            {h.doctor}
          </Link>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Stethoscope className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">{h.specialization}</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-1.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{h.qualification}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              {h.experience} experience
            </div>
            <div className="flex items-center gap-1.5 sm:col-span-2">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {h.address}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            {h.availableTime && (
              <span className="inline-flex items-center gap-1.5 bg-secondary text-foreground px-2.5 py-1 rounded-md">
                <Clock className="w-3.5 h-3.5 text-primary" />
                {h.availableTime}
              </span>
            )}
            {h.consultationFee && (
              <span className="inline-flex items-center gap-1.5 bg-secondary text-foreground px-2.5 py-1 rounded-md">
                <IndianRupee className="w-3.5 h-3.5 text-primary" />
                {h.consultationFee}
              </span>
            )}
            {!h.availableTime && !h.consultationFee && (
              <span className="text-xs text-muted-foreground italic">Contact for availability & fees</span>
            )}
          </div>

          <div className="flex items-center gap-3 pt-1">
            {onBook ? (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onBook(h);
                }}
                className="gap-1.5"
              >
                <CalendarCheck className="w-3 h-3" />
                Book Appointment
              </Button>
            ) : (
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md font-medium hover:opacity-90"
              >
                <CalendarCheck className="w-3 h-3" />
                Book Appointment
              </Link>
            )}
            <a
              href={`https://www.google.com/maps/search/${h.mapQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              Get Directions →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalCard;
