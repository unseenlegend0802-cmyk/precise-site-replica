import Header from "@/components/Header";
import TreatmentBar from "@/components/TreatmentBar";
import HeroSection from "@/components/HeroSection";
import LocationsMarquee from "@/components/LocationsMarquee";
import TreatmentsSection from "@/components/TreatmentsSection";
import ServicesSection from "@/components/ServicesSection";

import PatientJourneySection from "@/components/PatientJourneySection";
import BookAppointmentBanner from "@/components/BookAppointmentBanner";
import WhyMedaggSection from "@/components/WhyMedaggSection";
import DoctorsSection from "@/components/DoctorsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import DiagnosisCtaSection from "@/components/DiagnosisCtaSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="relative">
        <HeroSection />
        <TreatmentBar />
      </div>
      <AnimatedSection>
        <DiagnosisCtaSection />
      </AnimatedSection>
      <AnimatedSection>
        <LocationsMarquee />
      </AnimatedSection>
      <AnimatedSection>
        <TreatmentsSection />
      </AnimatedSection>
      <AnimatedSection>
        <ServicesSection />
      </AnimatedSection>


      <AnimatedSection>
        <PatientJourneySection />
      </AnimatedSection>
      <AnimatedSection>
        <BookAppointmentBanner />
      </AnimatedSection>
      <AnimatedSection>
        <WhyMedaggSection />
      </AnimatedSection>
      <AnimatedSection>
        <DoctorsSection />
      </AnimatedSection>
      <AnimatedSection direction="right">
        <TestimonialsSection />
      </AnimatedSection>
      <AnimatedSection>
        <ContactSection />
      </AnimatedSection>
      <AnimatedSection>
        <FAQSection />
      </AnimatedSection>
      <Footer />
    </div>
  );
};

export default Index;
