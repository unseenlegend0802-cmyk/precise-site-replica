import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { hospitals, cities } from "@/data/hospitals";
import { MapPin, Stethoscope, GraduationCap, Clock, Search, CalendarCheck, IndianRupee } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const FindHospital = () => {
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(hospitals[0]);

  const filtered = hospitals.filter((h) => {
    const matchCity = selectedCity === "All" || h.city === selectedCity;
    const matchSearch =
      !search ||
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.doctor.toLowerCase().includes(search.toLowerCase()) ||
      h.specialization.toLowerCase().includes(search.toLowerCase());
    return matchCity && matchSearch;
  });

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
            {/* Hospital cards */}
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
                    onClick={() => setSelectedHospital(h)}
                    className={`cursor-pointer rounded-xl border p-5 transition-all duration-200 ${
                      selectedHospital === h
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Doctor Avatar */}
                      <Avatar className="w-16 h-16 shrink-0 border-2 border-primary/20">
                        {h.doctorImage ? (
                          <AvatarImage src={h.doctorImage} alt={h.doctor} />
                        ) : null}
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                          {h.doctor.split(" ").filter(w => w.length > 2).map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-foreground text-lg">{h.name}</h3>
                          <Badge variant="secondary" className="shrink-0">{h.city}</Badge>
                        </div>

                        <div className="flex items-center gap-2 text-primary font-medium">
                          <Stethoscope className="w-4 h-4" />
                          {h.doctor}
                        </div>

                        <div className="grid sm:grid-cols-2 gap-1.5 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{h.qualification}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            {h.experience} experience
                          </div>
                          <div className="flex items-center gap-1.5 sm:col-span-2">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            {h.address}
                          </div>
                        </div>

                        {/* Available Time & Fee */}
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          {h.availableTime && (
                            <span className="inline-flex items-center gap-1.5 bg-secondary text-foreground px-2.5 py-1 rounded-md">
                              <Clock className="w-3.5 h-3.5 text-primary" />
                              {h.availableTime}
                            </span>
                          )}
                          {h.consultationFee && (
                            <span className="inline-flex items-center gap-1.5 bg-secondary text-foreground px-2.5 py-1 rounded-md">
                              <IndianRupee className="w-3.5 h-3.5 text-primary" />
                              {h.consultationFee}
                            </span>
                          )}
                          {!h.availableTime && !h.consultationFee && (
                            <span className="text-xs text-muted-foreground italic">Contact for availability & fees</span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                          <Link
                            to="/contact"
                            className="inline-flex items-center gap-1.5 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md font-medium hover:opacity-90"
                          >
                            <CalendarCheck className="w-3 h-3" />
                            Book Appointment
                          </Link>
                          <a
                            href={`https://www.google.com/maps/search/${h.mapQuery}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                          >
                            Get Directions →
                          </a>
                        </div>
                      </div>
                    </div>
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
