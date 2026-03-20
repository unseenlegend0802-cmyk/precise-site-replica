import mapImg from "@/assets/india-map.png";

const cities = [
  "Ahmedabad", "Bangalore", "Bhubaneswar", "Calicut", "Chennai",
  "Coimbatore", "Delhi", "Goa", "Hyderabad", "Jaipur",
  "Kolkata", "Madurai", "Perinthalmanna", "Salem", "Surat", "Trivandrum", "Vizag",
  "Vijayawada",
];

const LocationsMarquee = () => {
  return (
    <section className="py-16 bg-background overflow-hidden">
      <div className="container mx-auto px-4 text-center mb-10">
        <h2 className="text-3xl font-bold mb-3">
          Non-Surgical <span className="text-gradient">Solutions</span>
        </h2>
        <p className="text-muted-foreground">
          Why go under the knife when you don't have to?
        </p>
      </div>

      {/* Scrolling cities */}
      <div className="overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...cities, ...cities].map((city, i) => (
            <span
              key={i}
              className="mx-6 text-lg font-medium text-muted-foreground hover:text-primary transition-colors cursor-default"
            >
              {city}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationsMarquee;
