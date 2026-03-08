import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { hospitals } from "@/data/hospitals";
import { featuredDoctors } from "@/data/featuredDoctors";
import Header from "@/components/Header";
import TreatmentBar from "@/components/TreatmentBar";
import Footer from "@/components/Footer";
import ProcedurePathway from "@/components/ProcedurePathway";
import DoctorHeaderCard from "@/components/doctor-profile/DoctorHeaderCard";
import DoctorStatsRow from "@/components/doctor-profile/DoctorStatsRow";
import ProcedurePortfolio from "@/components/doctor-profile/ProcedurePortfolio";
import PracticingLocations from "@/components/doctor-profile/PracticingLocations";
import { ArrowLeft } from "lucide-react";

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
      } else {
        const featured = featuredDoctors.find((d) => d.slug === slug);
        if (featured) {
          setDoctor({
            id: "",
            slug: featured.slug,
            name: featured.name,
            qualification: featured.qualification,
            specialization: featured.specialization,
            experience: "",
            bio: "",
            image_url: featured.image,
            overall_success_rate: 0,
            complication_rate: 0,
            avg_recovery_time: "",
            languages: [],
          });
        }
      }
      setLoading(false);
    };
    load();
  }, [slug]);

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

        <DoctorHeaderCard
          doctor={doctor}
          hasHospitals={doctorHospitals.length > 0}
        />

        <DoctorStatsRow
          successRate={doctor.overall_success_rate}
          complicationRate={doctor.complication_rate}
          avgRecoveryTime={doctor.avg_recovery_time}
          totalProcedures={totalProcedures}
        />

        <ProcedurePortfolio procedures={procedures} />

        <PracticingLocations hospitals={doctorHospitals} doctorName={doctor.name} />

        <ProcedurePathway />
      </div>

      <Footer />
    </div>
  );
};

export default DoctorProfile;
