import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { hospitals, cities } from "@/data/hospitals";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import HospitalCard from "@/components/HospitalCard";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBooking } from "@/contexts/BookingContext";
import { Hospital } from "@/data/hospitals";

const FindHospital = () => {
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(hospitals[0]);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { setSelectedHospital: setBookingHospital, patientName, medicalIssue } = useBooking();

  // Auto-filter from scan report data passed via location state
  const scanData = location.state?.scanData;
  const detectedConditions: string[] = scanData?.detectedConditions || [];

  const filtered = hospitals.filter((h) => {
    const matchCity = selectedCity === "All" || h.city === selectedCity;
    const matchSearch =
      !search ||
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.doctor.toLowerCase().includes(search.toLowerCase()) ||
      h.specialization.toLowerCase().includes(search.toLowerCase());

    // Auto filter from scanned report conditions
    const matchReport =
      detectedConditions.length === 0 ||
      detectedConditions.some((cond) =>
        h.specialization.toLowerCase().includes(cond.toLowerCase())
      );

    return matchCity && matchSearch && matchReport;
  });

  const handleBookAppointment = (hospital: Hospital) => {
    setBookingHospital(hospital);
    if (!user) {
      navigate("/auth");
    } else {
      navigate("/book-appointment");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="bg-hero py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Find a <span className="text-primary">Hospital</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Locate our partner hospitals with expert interventional radiologists across India.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Scan data banner */}
      {detectedConditions.length > 0 && (
        <section className="py-4 bg-primary/5 border-b border-primary/20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              Showing hospitals matching your scan results:{" "}
              <span className="text-primary font-medium">{detectedConditions.join(", ")}</span>
            </p>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="py-8 bg-secondary border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search hospital, doctor, or specialization..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {["All", ...cities].map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    selectedCity === city
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border text-foreground hover:border-primary/50"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hospital List + Map */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-4 max-h-[700px] overflow-y-auto pr-2">
              <AnimatePresence mode="popLayout">
                {filtered.length === 0 && (
                  <p className="text-muted-foreground text-center py-12">No hospitals found matching your criteria.</p>
                )}
                {filtered.map((h, i) => (
                  <motion.div
                    key={h.name + h.doctor}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <HospitalCard
                      hospital={h}
                      isSelected={selectedHospital === h}
                      onClick={() => setSelectedHospital(h)}
                      onBook={handleBookAppointment}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Map */}
            <div className="lg:col-span-2 sticky top-24">
              <div className="rounded-xl overflow-hidden border border-border h-[400px] lg:h-[700px]">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${selectedHospital.mapQuery}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${selectedHospital.name} location`}
                />
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm text-muted-foreground">
                  Showing: <span className="text-foreground font-medium">{selectedHospital.name}</span> — {selectedHospital.city}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FindHospital;
