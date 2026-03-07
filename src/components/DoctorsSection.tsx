import { useState } from "react";
import { Link } from "react-router-dom";
import vinayagamaniImg from "@/assets/doctors/vinayagamani.png";
import balajiImg from "@/assets/doctors/balaji.png";
import saileshImg from "@/assets/doctors/sailesh.png";
import bhavaniImg from "@/assets/doctors/bhavani.png";
import AbhishekbansalImg from "@/assets/doctors/Abhishekbansal.png"

const allDoctors = [
  { name: "Dr. Vinayagamani", slug: "dr-vinayagamani", qual: "MBBS, DMRD, DNB", spec: "Interventional Radiology", city: "Madurai", img: vinayagamaniImg },
  { name: "Dr. Balaji Patel Kola", slug: "dr-balaji-patel-kola", qual: "MBBS, DMRD, DNB", spec: "Interventional Radiology", city: "Hyderabad", img: balajiImg },
  { name: "Dr. Sailesh Kumar Garge", slug: "dr-sailesh-kumar-garge", qual: "MBBS, DMRD, DNB", spec: "Interventional Radiology", city: "Hyderabad", img: saileshImg },
  { name: "Dr. Bhavani Shankar", slug: "dr-bhavani-shankar-manam", qual: "MBBS, DMRD, DNB", spec: "Interventional Radiology", city: "Vijayawada", img: bhavaniImg },
  { name: "Dr. Abhishek Bansal", slug: "dr-Abhishek-Bansal", qual: "MBBS, DMRD, DNB", spec: "Interventional Radiology", city: "Delhi", img: AbhishekbansalImg}
];

const DoctorsSection = () => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? allDoctors : allDoctors.slice(0, 4);

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
          {visible.map((d, i) => (
            <Link
              key={i}
              to={`/doctor/${d.slug}`}
              className="bg-card-gradient rounded-xl border border-border overflow-hidden group hover:border-primary/50 transition-all duration-300 block"
            >
              <div className="aspect-[3/4] overflow-hidden bg-muted">
                <img
                  src={d.img}
                  alt={d.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 space-y-1">
                <h3 className="font-semibold text-foreground">{d.name}</h3>
                <p className="text-xs text-muted-foreground">{d.qual}</p>
                <p className="text-xs text-primary">{d.spec}</p>
                <p className="text-xs text-muted-foreground">{d.city}</p>
                <span className="inline-block mt-2 text-xs bg-primary text-primary-foreground px-4 py-1.5 rounded-md font-medium hover:opacity-90">
                  View Profile →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {!showAll && allDoctors.length > 4 && (
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
