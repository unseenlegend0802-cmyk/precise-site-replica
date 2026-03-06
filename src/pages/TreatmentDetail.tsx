import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTreatmentBySlug } from "@/data/treatments";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import TreatmentBar from "@/components/TreatmentBar";
import Footer from "@/components/Footer";
import ProcedurePathway from "@/components/ProcedurePathway";
import { ArrowLeft, CheckCircle2, Clock, TrendingUp, IndianRupee, Building2, ShieldCheck, Stethoscope } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MatchingDoctor {
  id: string;
  slug: string;
  name: string;
  qualification: string;
  specialization: string;
  experience: string;
  image_url: string | null;
  overall_success_rate: number;
  procedure_count: number;
}

const TreatmentDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const treatment = slug ? getTreatmentBySlug(slug) : undefined;
  const [matchingDoctors, setMatchingDoctors] = useState<MatchingDoctor[]>([]);

  useEffect(() => {
    if (!slug) return;
    const loadDoctors = async () => {
      const { data } = await supabase
        .from("doctor_procedures")
        .select("doctor_id, procedure_count, doctors(id, slug, name, qualification, specialization, experience, image_url, overall_success_rate)")
        .eq("procedure_slug", slug);

      if (data) {
        const docs: MatchingDoctor[] = data
          .filter((d: any) => d.doctors)
          .map((d: any) => ({
            ...d.doctors,
            procedure_count: d.procedure_count,
          }));
        // Deduplicate by doctor id
        const unique = Array.from(new Map(docs.map(d => [d.id, d])).values());
        setMatchingDoctors(unique);
      }
    };
    loadDoctors();
  }, [slug]);

  if (!treatment) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <TreatmentBar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Treatment Not Found</h1>
          <Link to="/" className="text-primary hover:underline">← Back to Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TreatmentBar />

      <div className="container mx-auto px-4 py-12 lg:py-20 max-w-5xl">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <span className="inline-block text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full mb-4">
          {treatment.condition}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{treatment.name}</h1>
        <p className="text-muted-foreground text-lg leading-relaxed mb-10">{treatment.description}</p>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <Card className="border-border bg-card-gradient">
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Recovery Time</p>
                <p className="text-base font-semibold text-foreground">{treatment.recoveryTime}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card-gradient">
            <CardContent className="p-4 flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Success Rate</p>
                <p className="text-base font-semibold text-foreground">{treatment.successRate}</p>
              </div>
            </CardContent>
          </Card>
          {treatment.costRange && (
            <Card className="border-border bg-card-gradient">
              <CardContent className="p-4 flex items-center gap-3">
                <IndianRupee className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Cost Range</p>
                  <p className="text-base font-semibold text-foreground">{treatment.costRange}</p>
                </div>
              </CardContent>
            </Card>
          )}
          {treatment.hospitalStay && (
            <Card className="border-border bg-card-gradient">
              <CardContent className="p-4 flex items-center gap-3">
                <Building2 className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Hospital Stay</p>
                  <p className="text-base font-semibold text-foreground">{treatment.hospitalStay}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Insurance Badge */}
        {treatment.insuranceEligible && (
          <div className="flex items-center gap-2 mb-10 bg-primary/5 border border-primary/20 rounded-lg px-4 py-3">
            <ShieldCheck className="w-5 h-5 text-green-400" />
            <span className="text-sm text-foreground">This procedure may be covered under health insurance. Verify with your provider.</span>
          </div>
        )}

        {/* How it works */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-3">How It Works</h2>
          <p className="text-muted-foreground leading-relaxed">{treatment.howItWorks}</p>
        </div>

        {/* Benefits */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-3">Key Benefits</h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {treatment.benefits.map((b, i) => (
              <li key={i} className="flex items-center gap-2.5 text-foreground">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Procedure Pathway */}
        <div className="mb-10">
          <ProcedurePathway />
        </div>

        {/* Matching Doctors */}
        {matchingDoctors.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-primary" /> Specialists for This Procedure
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {matchingDoctors.map((doc) => (
                <Link key={doc.id} to={`/doctor/${doc.slug}`} className="block">
                  <Card className="border-border bg-card-gradient hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-4 flex gap-4 items-start">
                      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-lg font-bold text-primary shrink-0 overflow-hidden">
                        {doc.image_url ? (
                          <img src={doc.image_url} alt={doc.name} className="w-full h-full object-cover" />
                        ) : (
                          doc.name.split(" ").map(n => n[0]).join("").slice(0, 2)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm">{doc.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{doc.qualification}</p>
                        <p className="text-xs text-primary mt-1">{doc.experience} exp</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary" className="text-[10px]">{doc.overall_success_rate}% success</Badge>
                          <Badge variant="secondary" className="text-[10px]">{doc.procedure_count}+ done</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">Ready to explore this treatment?</h3>
          <p className="text-sm text-muted-foreground mb-4">Book a consultation with our specialists today.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/find-hospital"
              className="inline-block bg-secondary text-secondary-foreground px-6 py-2.5 rounded-md font-medium text-sm hover:opacity-90 transition-opacity border border-border"
            >
              Find a Hospital
            </Link>
            <Link
              to="/contact"
              className="inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TreatmentDetail;
