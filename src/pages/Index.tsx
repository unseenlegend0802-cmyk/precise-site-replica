import Header from "@/components/Header";
import TreatmentBar from "@/components/TreatmentBar";
import HeroSection from "@/components/HeroSection";
import LocationsMarquee from "@/components/LocationsMarquee";
import TreatmentsSection from "@/components/TreatmentsSection";
import ServicesSection from "@/components/ServicesSection";
import IraBotSection from "@/components/IraBotSection";
import PatientJourneySection from "@/components/PatientJourneySection";
import BookAppointmentBanner from "@/components/BookAppointmentBanner";
import WhyMedaggSection from "@/components/WhyMedaggSection";
import DoctorsSection from "@/components/DoctorsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TreatmentBar />
      <HeroSection />
      <LocationsMarquee />
      <TreatmentsSection />
      <ServicesSection />
      <IraBotSection />
      <PatientJourneySection />
      <BookAppointmentBanner />
      <WhyMedaggSection />
      <DoctorsSection />
      <TestimonialsSection />
      <ContactSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
