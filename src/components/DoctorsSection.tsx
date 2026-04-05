import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { featuredDoctors, FeaturedDoctor } from "@/data/featuredDoctors";
import { getDoctorImage } from "@/utils/doctorImages";
import { useUserLocation } from "@/hooks/useUserLocation";
import { getCityCoordinates, haversineDistance } from "@/utils/cityCoordinates";
import { formatDistance } from "@/utils/hospitalDistance";
import { Navigation2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DbDoctor {
  slug: string;
  name: string;
  qualification: string | null;
  specialization: string | null;
  image_url: string | null;
  hospital_name: string | null;
}

const DoctorsSection = () => {
  const [showAll, setShowAll] = useState(false);
  const [doctors, setDoctors] = useState<(FeaturedDoctor & { distance?: number })[]>(featuredDoctors);
  const { coordinates: userLocation } = useUserLocation();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("doctors")
        .select("slug, name, qualification, specialization, image_url, hospital_name")
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        const dbDoctors: FeaturedDoctor[] = (data as DbDoctor[]).map((d) => ({
          name: d.name,
          slug: d.slug,
          qualification: d.qualification || "",
          specialization: d.specialization || "",
          city: d.hospital_name || "",
          image: getDoctorImage(d.slug) || d.image_url || "",
        }));

        const dbSlugs = new Set(dbDoctors.map((d) => d.slug));
        const localOnly = featuredDoctors.filter((d) => !dbSlugs.has(d.slug));
        setDoctors([...dbDoctors, ...localOnly]);
      }
    };
    load();
  }, []);

  const sorted = useMemo(() => {
    if (!userLocation) return doctors;
    return [...doctors]
      .map((d) => {
        const coords = getCityCoordinates(d.city);
        const distance = coords ? haversineDistance(userLocation, coords) : undefined;
        return { ...d, distance };
      })
      .sort((a, b) => {
        if (a.distance === undefined && b.distance === undefined) return 0;
        if (a.distance === undefined) return 1;
        if (b.distance === undefined) return -1;
        return a.distance - b.distance;
      });
  }, [doctors, userLocation]);

  const visible = showAll ? sorted : sorted.slice(0, 4);

  return (
    <section className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Our Doctors</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our expert doctors provide personalized, non-surgical care with a patient-first approach, guiding you to safe and effective treatments.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visible.map((d) => (
            <Link
              key={d.slug}
              to={`/doctor/${d.slug}`}
              className="bg-card-gradient rounded-xl border border-border overflow-hidden group hover:border-primary/50 transition-all duration-300 block"
            >
              <div className="aspect-[3/4] overflow-hidden bg-muted">
                {d.image ? (
                  <img
                    src={d.image}
                    alt={d.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-primary/50">
                    {d.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                )}
              </div>
              <div className="p-4 space-y-1">
                <h3 className="font-semibold text-foreground">{d.name}</h3>
                <p className="text-xs text-muted-foreground">{d.qualification}</p>
                <p className="text-xs text-primary">{d.specialization}</p>
                <div className="flex items-center gap-1.5">
                  <p className="text-xs text-muted-foreground">{d.city}</p>
                  {d.distance !== undefined && (
                    <Badge variant="outline" className="text-[10px] gap-0.5 py-0 px-1.5 text-primary border-primary/30">
                      <Navigation2 className="w-2.5 h-2.5" />
                      {formatDistance(d.distance)}
                    </Badge>
                  )}
                </div>
                <span className="inline-block mt-2 text-xs bg-primary text-primary-foreground px-4 py-1.5 rounded-md font-medium hover:opacity-90">
                  View Profile →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {!showAll && doctors.length > 4 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(true)}
              className="text-primary border border-primary px-6 py-2 rounded-md text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default DoctorsSection;
