import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { motion } from "framer-motion";
import { Facebook, Instagram, Youtube, Linkedin, Play, CheckCircle, XCircle, ArrowRight, Heart, CalendarDays, IndianRupee } from "lucide-react";
import aboutHero from "@/assets/about-hero.png";
import type1Img from "@/assets/about/type1.png";
import type2Img from "@/assets/about/type2.png";
import type3Img from "@/assets/about/type3.png";
import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61558841344582" },
  { icon: Instagram, href: "https://www.instagram.com/medagghealthcare" },
  { icon: Youtube, href: "https://youtube.com/@medagghealthcare" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/medagg-healthcare/" },
];

const patientTypes = [
  {
    img: type1Img,
    type: "Type 1",
    quote: "I already know I need a procedure, help me find the best hospital.",
    desc: "You have a diagnosis but need guidance on where to get the best care with minimal waiting time.",
    testimonial: "Medagg helped me find a clinic for my knee procedure with a 2-week shorter wait time.",
    name: "Suraiya",
    city: "Kolkata",
  },
  {
    img: type2Img,
    type: "Type 2",
    quote: "I have symptoms but don't know where to start.",
    desc: "You're experiencing health issues but unsure which specialist to see or what treatments to consider.",
    testimonial: "The care team guided me to the right specialist after months of trying to figure out my chronic pain issues.",
    name: "Thomas",
    city: "Chennai",
  },
  {
    img: type3Img,
    type: "Type 3",
    quote: "I need a second opinion before I make a decision.",
    desc: "You've received a diagnosis or treatment plan but want to explore alternatives before proceeding.",
    testimonial: "Medagg's second opinion saved me from unnecessary spinal surgery — I'm now pain-free with minimal treatment.",
    name: "Nazim",
    city: "Hyderabad",
  },
];

const othersPoints = [
  { title: "Advertising-Driven", desc: "Platforms that prioritize sponsored listings over patient needs, creating confusion about the best options." },
  { title: "Long Delays", desc: "Weeks of waiting for appointments, followed by more waiting for treatment plans and procedures." },
  { title: "No Guidance", desc: "Patients left to navigate complex medical systems alone, with minimal support or explanation." },
  { title: "Hidden Costs", desc: "Unclear pricing structures leading to surprise bills and financial stress during recovery." },
];

const medaggPoints = [
  { title: "Care Custodians", desc: "A dedicated care team focused solely on finding you the best treatment option based on medical needs, not advertising." },
  { title: "Rapid Response", desc: "Most patients connect with specialists within 48 hours, with treatment plans developed shortly after." },
  { title: "End-to-End Support", desc: "Our team guides you from initial questions through recovery, providing resources and answering concerns." },
  { title: "Complete Transparency", desc: "Upfront pricing, clear treatment explanations, and honest discussions about expected outcomes." },
];

const timeline = [
  { year: "2018", title: "Parent Vision Established", desc: "Founded by Ramesh Krishnan and Sumitha Karthik, Medagg Ventures LLP began with a bold mission — to reshape how healthcare in India is accessed, operated, and aggregated." },
  { year: "2021", title: "Medagg Healthcare Launched", desc: "On 17 November 2021, Medagg Healthcare was incorporated in Chennai, introducing the Care Custodian model to support patients from inquiry to recovery." },
  { year: "2023", title: "Interventional Radiology Becomes Our Niche", desc: "Medagg established Interventional Radiology (IR) as its core niche, championing minimally invasive, non-surgical treatments." },
  { year: "2024", title: "From Tamil Nadu to the Wider South", desc: "After completing strong operations across Tamil Nadu, Medagg began expanding into major South Indian cities — including Kerala, Karnataka, Andhra Pradesh, and Telangana." },
  { year: "2025", title: "Connecting India Through Care Pathways", desc: "Medagg completed its presence across all key South Indian cities and expanded into East and West India, reaching 20+ cities." },
  { year: "Future", title: "Scaling Further", desc: "With a focus on national integration, digital precision, and end-to-end patient journeys, Medagg Healthcare is scaling to make quality, minimally invasive care accessible to every individual, everywhere." },
];

const stats = [
  { icon: Heart, value: 2500, prefix: "", suffix: "+", label: "Patients Helped" },
  { icon: CalendarDays, value: 5000, prefix: "", suffix: "+", label: "Consultations Booked" },
  { icon: IndianRupee, value: 50000, prefix: "₹", suffix: "", label: "Average Patient Savings" },
];

const useCountUp = (target: number, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
};

const About = () => {
  const [videoPlaying, setVideoPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section — full-width image overlay */}
      <section className="relative min-h-[60vh] lg:min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={aboutHero} alt="Healthcare Team Collaboration" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/70" />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-20 lg:py-28">
          <AnimatedSection>
            <p className="text-sm text-muted-foreground mb-3">Follow Us On :</p>
            <div className="flex gap-3 mb-8">
              {socialLinks.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary/80 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 max-w-2xl">
              Skip Surgery, Embrace <span className="text-primary">Precision</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Medagg Healthcare champions Interventional Radiology across India — bridging knowledge gaps, simplifying patient decisions, and building trust through ethical, minimally invasive innovation that transforms treatment into smarter, safer, and more human care.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Born out of AGGregation */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <img src={aboutHero} alt="Medagg Team" className="rounded-2xl w-full shadow-xl" />
            </AnimatedSection>
            <AnimatedSection direction="right">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                Medagg was born out of the burning need for{" "}
                <span className="text-primary">AGG</span>regation in the{" "}
                <span className="text-primary">MED</span>ical space!
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Established in 2021, we are a pioneering force in advancing Interventional Radiology (IR) — the science of performing precise, image-guided, minimally invasive treatments that reduce recovery time and improve outcomes.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Led by experienced Interventionists and healthcare business leaders, we combine medical expertise with operational insight to reshape how patients and hospitals experience care. At Medagg, technology meets integrity — we believe the future of healthcare is non-surgical, transparent, and patient-first.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Guided by ethics rather than advertising, we provide unbiased access to trusted hospitals and specialists, ensuring patients can compare costs, understand options, and make confident decisions.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Types of Patients We Serve */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Types of Patients We Serve
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                No matter where you are in your healthcare journey, we're here to help you find the right path forward.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8">
            {patientTypes.map((pt, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <div className="bg-card-gradient rounded-2xl border border-border p-6 hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-5">
                    <img src={pt.img} alt={pt.type} className="w-16 h-16 rounded-xl object-cover" />
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">{pt.type}</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-3 leading-snug">
                    "{pt.quote}"
                  </h3>
                  <p className="text-sm text-muted-foreground mb-5 flex-1">{pt.desc}</p>
                  <div className="bg-secondary/60 rounded-xl p-4 border border-border/50">
                    <p className="text-sm italic text-muted-foreground mb-2">"{pt.testimonial}"</p>
                    <p className="text-xs font-medium text-foreground">{pt.name} • {pt.city}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do Differently */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                What We Do Differently
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                See how Medagg transforms the typical healthcare experience into something truly patient-centered.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Others Column */}
            <AnimatedSection direction="left">
              <div className="rounded-2xl border border-destructive/30 bg-card-gradient p-6 h-full">
                <h3 className="text-xl font-bold text-destructive mb-6 flex items-center gap-2">
                  <XCircle className="w-5 h-5" /> Others
                </h3>
                <div className="space-y-5">
                  {othersPoints.map((p, i) => (
                    <div key={i} className="flex gap-3">
                      <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">{p.title}</h4>
                        <p className="text-sm text-muted-foreground">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
            {/* Medagg Column */}
            <AnimatedSection direction="right">
              <div className="rounded-2xl border border-primary/30 bg-card-gradient p-6 h-full">
                <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Medagg
                </h3>
                <div className="space-y-5">
                  {medaggPoints.map((p, i) => (
                    <div key={i} className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">{p.title}</h4>
                        <p className="text-sm text-muted-foreground">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Story of Transformation — Video + Timeline */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                The Story of Our <span className="text-primary">Transformation</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Over the years, we've evolved with purpose, turning challenges into milestones and vision into reality.
              </p>
            </div>
          </AnimatedSection>

          {/* Side-by-side: Timeline left, Video right */}
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Timeline — left */}
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
              {timeline.map((item, i) => (
                <AnimatedSection
                  key={i}
                  direction="left"
                  delay={i * 0.1}
                >
                  <div className="relative flex items-start mb-10 pl-14">
                    <div className="absolute left-6 w-3 h-3 rounded-full bg-primary border-2 border-background -translate-x-1.5 mt-2 z-10" />
                    <div>
                      <span className="text-2xl font-bold text-primary">{item.year}</span>
                      <h3 className="text-lg font-semibold text-foreground mt-1 mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {/* Video — right, sticky */}
            <AnimatedSection direction="right" className="lg:sticky lg:top-28">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-muted">
                {!videoPlaying ? (
                  <>
                    <img
                      src="https://img.youtube.com/vi/0j7HJsPdSnw/maxresdefault.jpg"
                      alt="Medagg Healthcare Video"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-background/40 flex items-center justify-center">
                      <button
                        onClick={() => setVideoPlaying(true)}
                        className="w-20 h-20 rounded-full bg-primary flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                      >
                        <Play className="w-8 h-8 text-primary-foreground ml-1" />
                      </button>
                    </div>
                  </>
                ) : (
                  <iframe
                    src="https://www.youtube.com/embed/0j7HJsPdSnw?autoplay=1"
                    title="Medagg Healthcare Video"
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Trusted by Patients Across India
              </h2>
              <p className="text-muted-foreground text-lg">
                Join thousands of patients who have found better healthcare solutions through Medagg.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
            {stats.map((s, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <motion.div
                  className="text-center py-8 rounded-2xl bg-card-gradient border border-border hover:border-primary/50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <p className="text-3xl md:text-4xl font-bold text-primary mb-2">{s.value}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="bg-pink-gradient rounded-2xl p-8 lg:p-14 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready To Explore Non-Surgical Options?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto text-lg">
                Discover safer, faster, and effective treatments — no scars, no stitches, and same-day recovery.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-background text-foreground px-8 py-3.5 rounded-lg font-semibold hover:opacity-90 transition-opacity text-base"
              >
                Talk With Medagg
                <ArrowRight className="w-4 h-4" />
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
