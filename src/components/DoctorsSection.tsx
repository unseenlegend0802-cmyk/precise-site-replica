import { useState } from "react";
import { Link } from "react-router-dom";
import { featuredDoctors } from "@/data/featuredDoctors";

const DoctorsSection = () => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? featuredDoctors : featuredDoctors.slice(0, 4);

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
                <img
                  src={d.image}
                  alt={d.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
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

        {!showAll && featuredDoctors.length > 4 && (
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
