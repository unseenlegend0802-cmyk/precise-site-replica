import { Link } from "react-router-dom";
import { Clock, Globe, CalendarCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Doctor {
  name: string;
  qualification: string;
  specialization: string;
  experience: string;
  bio: string;
  image_url: string | null;
  languages: string[];
}

interface DoctorHeaderCardProps {
  doctor: Doctor;
  hasHospitals: boolean;
}

const DoctorHeaderCard = ({ doctor, hasHospitals }: DoctorHeaderCardProps) => {
  return (
    <Card className="mb-8 overflow-hidden border-border bg-card-gradient">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row gap-6 p-6 md:p-8">
          {/* Photo */}
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden bg-muted shrink-0 mx-auto md:mx-0 ring-2 ring-primary/20">
            {doctor.image_url ? (
              <img src={doctor.image_url} alt={doctor.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary bg-primary/10">
                {doctor.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{doctor.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">{doctor.qualification}</p>
            </div>
            <Badge className="bg-primary/15 text-primary border-0 text-xs">{doctor.specialization}</Badge>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {doctor.experience && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" />{doctor.experience} experience
                </span>
              )}
              {doctor.languages?.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-primary" />{doctor.languages.join(", ")}
                </span>
              )}
            </div>
            {doctor.bio && (
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 md:line-clamp-none">{doctor.bio}</p>
            )}

          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorHeaderCard;
