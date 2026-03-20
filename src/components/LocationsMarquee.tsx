import mapImg from "@/assets/india-map.png";

const cities = [
  "Ahmedabad", "Bangalore", "Bhubaneswar", "Calicut", "Chennai",
  "Coimbatore", "Delhi", "Goa", "Hyderabad", "Jaipur",
  "Kolkata", "Madurai", "Perinthalmanna", "Salem", "Surat",
  "Trivandrum", "Vijayawada", "Vizag",
];

const LocationsMarquee = () => {
  return (
    <section className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Non-Surgical Solutions
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Why go under the knife when you don't have to?
            </p>
            <img src={mapImg} alt="Medagg locations across India" className="max-w-md w-full" />
          </div>

          {/* Scrolling cities */}
          <div className="overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap">
              {cities.map((city) => (
                <span
                  key={city}
                  className="px-4 py-2 rounded-full bg-muted border border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
                >
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationsMarquee;
