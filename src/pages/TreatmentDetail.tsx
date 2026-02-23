import { useParams, Link } from "react-router-dom";
import { getTreatmentBySlug } from "@/data/treatments";
import Header from "@/components/Header";
import TreatmentBar from "@/components/TreatmentBar";
import Footer from "@/components/Footer";
import { ArrowLeft, CheckCircle2, Clock, TrendingUp } from "lucide-react";

const TreatmentDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const treatment = slug ? getTreatmentBySlug(slug) : undefined;

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

      <div className="container mx-auto px-4 py-12 lg:py-20 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <span className="inline-block text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full mb-4">
          {treatment.condition}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{treatment.name}</h1>
        <p className="text-muted-foreground text-lg leading-relaxed mb-10">{treatment.description}</p>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <div className="flex items-center gap-3 bg-card-gradient border border-border rounded-xl p-5">
            <Clock className="w-6 h-6 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Recovery Time</p>
              <p className="text-lg font-semibold text-foreground">{treatment.recoveryTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-card-gradient border border-border rounded-xl p-5">
            <TrendingUp className="w-6 h-6 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Success Rate</p>
              <p className="text-lg font-semibold text-foreground">{treatment.successRate}</p>
            </div>
          </div>
        </div>

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

        {/* CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">Ready to explore this treatment?</h3>
          <p className="text-sm text-muted-foreground mb-4">Book a consultation with our specialists today.</p>
          <Link
            to="/contact"
            className="inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Book Appointment
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TreatmentDetail;
