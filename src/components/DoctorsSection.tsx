import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { featuredDoctors, FeaturedDoctor } from "@/data/featuredDoctors";
import { getDoctorImage } from "@/utils/doctorImages";

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
  const [doctors, setDoctors] = useState<FeaturedDoctor[]>(featuredDoctors);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("doctors")
        .select("slug, name, qualification, specialization, image_url, hospital_name")
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        // Merge DB doctors with local assets for images
        const dbDoctors: FeaturedDoctor[] = (data as DbDoctor[]).map((d) => ({
          name: d.name,
          slug: d.slug,
          qualification: d.qualification || "",
          specialization: d.specialization || "",
          city: d.hospital_name || "",
          image: d.image_url || getDoctorImage(d.slug) || "",
        }));

        // Also include featured doctors that aren't in DB
        const dbSlugs = new Set(dbDoctors.map((d) => d.slug));
        const localOnly = featuredDoctors.filter((d) => !dbSlugs.has(d.slug));
        setDoctors([...dbDoctors, ...localOnly]);
      }
    };
    load();
  }, []);

  const visible = showAll ? doctors : doctors.slice(0, 4);

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
                <p className="text-xs text-muted-foreground">{d.city}</p>
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
