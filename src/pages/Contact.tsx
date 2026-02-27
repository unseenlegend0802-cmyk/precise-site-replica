import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import ContactSection from "@/components/ContactSection";
import { Phone, Mail, MapPin, Clock, FileSearch } from "lucide-react";
import { Link } from "react-router-dom";

const contactInfo = [
  { icon: Phone, label: "Phone", value: "+91 93636 56010", href: "tel:+919363656010" },
  { icon: Mail, label: "Email", value: "info@medagghealthcare.com", href: "mailto:info@medagghealthcare.com" },
  { icon: MapPin, label: "Location", value: "Chennai, Tamil Nadu, India", href: "#" },
  { icon: Clock, label: "Working Hours", value: "Mon - Sat, 9 AM - 7 PM", href: "#" },
];

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="bg-hero py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions about non-surgical treatments? Our Care Custodians are here to help you every step of the way.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Cards + Scan Report */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((c, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <a
                  href={c.href}
                  className="block bg-card-gradient rounded-xl border border-border p-6 text-center hover:border-primary/50 transition-all duration-300"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-stat flex items-center justify-center">
                    <c.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{c.label}</h3>
                  <p className="text-sm text-muted-foreground">{c.value}</p>
                </a>
              </AnimatedSection>
            ))}
          </div>

          {/* Scan Report CTA */}
          <AnimatedSection delay={0.4}>
            <Link
              to="/scan-report"
              className="mt-8 flex items-center gap-4 bg-card-gradient rounded-xl border border-primary/30 p-6 hover:border-primary/60 transition-all duration-300 group"
            >
              <div className="w-14 h-14 shrink-0 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <FileSearch className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground mb-1">Upload & Scan Medical Report</h3>
                <p className="text-sm text-muted-foreground">
                  Upload your lab report (PDF, JPG, PNG) and get AI-powered analysis with flagged biomarkers and treatment suggestions.
                </p>
              </div>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Reuse ContactSection form */}
      <AnimatedSection>
        <ContactSection />
      </AnimatedSection>

      {/* Map embed */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-3">Find Us</h2>
              <p className="text-muted-foreground">Visit us at our office in Chennai</p>
            </div>
            <div className="rounded-xl overflow-hidden border border-border h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.886539092!2d80.04419894804689!3d13.047985899999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265ea4f7d3361%3A0x6e61a70b6863d433!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Medagg Healthcare Location"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
