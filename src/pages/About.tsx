import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { Heart, Shield, Users, Award, Target, Zap } from "lucide-react";

const values = [
  { icon: Heart, title: "Patient-First Approach", desc: "Every decision we make begins with the patient's well-being at its core." },
  { icon: Shield, title: "Non-Surgical Excellence", desc: "We champion minimally invasive interventional radiology procedures." },
  { icon: Users, title: "Expert Doctor Network", desc: "200+ partnered hospitals with top interventional radiologists across India." },
  { icon: Award, title: "Trusted Guidance", desc: "Care Custodians guide you through every step of your treatment journey." },
  { icon: Target, title: "Precision Medicine", desc: "Tailored treatment plans using cutting-edge interventional radiology techniques." },
  { icon: Zap, title: "Quick Recovery", desc: "Most patients return to normal activities within days, not weeks." },
];

const milestones = [
  { year: "2022", event: "Medagg Healthcare founded with a vision to make non-surgical treatments accessible." },
  { year: "2023", event: "Expanded to 10+ cities with 100+ hospital partnerships across India." },
  { year: "2024", event: "Launched IRa — AI-powered health companion for instant guidance." },
  { year: "2025", event: "Serving 20+ cities with 200+ partnered hospitals and growing." },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="bg-hero py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              About <span className="text-primary">Medagg</span> Healthcare
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              India's 1st Interventional Radiology Network — connecting patients with non-surgical, minimally invasive treatments across 20+ cities.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <AnimatedSection direction="left">
              <div className="bg-card-gradient rounded-xl border border-border p-8 h-full">
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To make advanced, non-surgical treatments accessible to every individual across India. We believe that quality healthcare should be safe, affordable, and free from the fear of surgery. Through our network of expert interventional radiologists, we provide precision treatments that deliver results without scars.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <div className="bg-card-gradient rounded-xl border border-border p-8 h-full">
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To become India's most trusted healthcare platform where every patient receives personalized, compassionate care. We envision a future where non-surgical interventional procedures become the first choice for treatment, reducing recovery time and improving patient outcomes across the nation.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Our Core Values</h2>
              <p className="text-muted-foreground text-lg">What drives us every day</p>
            </div>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="bg-card-gradient rounded-xl border border-border p-6 hover:border-primary/50 transition-all duration-300 h-full">
                  <div className="w-14 h-14 mb-4 rounded-lg bg-stat flex items-center justify-center">
                    <v.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="container mx-auto px-4 max-w-3xl">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Our Journey</h2>
              <p className="text-muted-foreground text-lg">Key milestones in our mission to transform healthcare</p>
            </div>
          </AnimatedSection>
          <div className="space-y-8">
            {milestones.map((m, i) => (
              <AnimatedSection key={i} direction={i % 2 === 0 ? "left" : "right"} delay={i * 0.15}>
                <div className="flex gap-6 items-start">
                  <div className="w-20 shrink-0 text-right">
                    <span className="text-2xl font-bold text-primary">{m.year}</span>
                  </div>
                  <div className="flex-1 bg-card-gradient rounded-xl border border-border p-5">
                    <p className="text-sm text-muted-foreground">{m.event}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="bg-pink-gradient rounded-2xl p-8 lg:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to explore non-surgical options?
              </h2>
              <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
                Talk to our Care Custodians and discover safe, effective treatments tailored for you.
              </p>
              <a href="/contact" className="inline-block bg-background text-foreground px-8 py-3 rounded-md font-medium hover:opacity-90 transition-opacity">
                Book Appointment
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
