import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { hospitals } from "@/data/hospitals";
import Header from "@/components/Header";
import TreatmentBar from "@/components/TreatmentBar";
import Footer from "@/components/Footer";
import ProcedurePathway from "@/components/ProcedurePathway";
import { ArrowLeft, MapPin, Clock, Award, ShieldCheck, Heart, TrendingUp, Star, Globe } from "lucide-react";
import { resolveDoctorImage } from "@/utils/doctorImages";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Doctor {
  id: string;
  slug: string;
  name: string;
  qualification: string;
  specialization: string;
  experience: string;
  bio: string;
  image_url: string | null;
  overall_success_rate: number;
  complication_rate: number;
  avg_recovery_time: string;
  languages: string[];
}

interface DoctorProcedure {
  id: string;
  procedure_name: string;
  procedure_slug: string | null;
  procedure_count: number;
  success_rate: number;
}

const DoctorProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [procedures, setProcedures] = useState<DoctorProcedure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      const { data: doc } = await supabase
        .from("doctors")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (doc) {
        setDoctor(doc as Doctor);
        const { data: procs } = await supabase
          .from("doctor_procedures")
          .select("*")
          .eq("doctor_id", doc.id);
        setProcedures((procs as DoctorProcedure[]) || []);
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  // Find hospitals where this doctor practices
  const doctorHospitals = doctor
    ? hospitals.filter((h) => h.doctor === doctor.name)
    : [];

  const totalProcedures = procedures.reduce((sum, p) => sum + p.procedure_count, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <TreatmentBar />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-pulse text-muted-foreground">Loading doctor profile...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <TreatmentBar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Doctor Not Found</h1>
          <Link to="/find-hospital" className="text-primary hover:underline">← Browse Doctors</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TreatmentBar />

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <Link to="/find-hospital" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Hospitals
        </Link>

        {/* Doctor Header Card */}
        <Card className="mb-8 overflow-hidden border-border bg-card-gradient">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row gap-6 p-6">
              {/* Photo */}
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-xl overflow-hidden bg-muted shrink-0 mx-auto md:mx-0">
                {resolveDoctorImage(doctor.image_url) ? (
                  <img src={resolveDoctorImage(doctor.image_url)!} alt={doctor.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary">
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
                <Badge className="bg-primary/15 text-primary border-0">{doctor.specialization}</Badge>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" />{doctor.experience} experience</span>
                  <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-primary" />{doctor.languages?.join(", ")}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{doctor.bio}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: TrendingUp, label: "Success Rate", value: `${doctor.overall_success_rate}%`, color: "text-green-400" },
            { icon: ShieldCheck, label: "Complication Rate", value: `${doctor.complication_rate}%`, color: "text-blue-400" },
            { icon: Heart, label: "Avg Recovery", value: doctor.avg_recovery_time, color: "text-primary" },
            { icon: Award, label: "Total Procedures", value: totalProcedures.toLocaleString(), color: "text-yellow-400" },
          ].map((stat, i) => (
            <Card key={i} className="border-border bg-card-gradient">
              <CardContent className="p-4 text-center">
                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Procedure Success Portfolio */}
        {procedures.length > 0 && (
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
        )}

        {/* Hospitals */}
        {doctorHospitals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> Practicing Locations
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {doctorHospitals.map((h, i) => (
                <Card key={i} className="border-border bg-card-gradient">
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-foreground">{h.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{h.address}</p>
                    {h.availableTime && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{h.availableTime}</p>
                    )}
                    {h.consultationFee && (
                      <Badge variant="secondary" className="text-xs">{h.consultationFee}</Badge>
                    )}
                    <Link
                      to={`/find-hospital?doctor=${encodeURIComponent(doctor.name)}`}
                      className="inline-block mt-2 text-xs bg-primary text-primary-foreground px-4 py-1.5 rounded-md font-medium hover:opacity-90"
                    >
                      Book Appointment →
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Procedure Pathway */}
        <ProcedurePathway />
      </div>

      <Footer />
    </div>
  );
};

export default DoctorProfile;
