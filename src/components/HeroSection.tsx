import { Search, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import doctorImg from "@/assets/doctor-hero.png";

const stats = [
  { value: "1st", label: "IR Network in India" },
  { value: "200+", label: "Partnered Hospitals" },
  { value: "20+", label: "Operating Cities" },
];

const HeroSection = () => {
  return (
    <section className="bg-hero relative overflow-hidden min-h-[85vh] flex items-center">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              No Surgery. No Scars.
              <br />
              <span className="text-primary">Just Results.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              Experience care without fear, without surgery, and with quick recovery.
            </p>

            {/* Search Bar */}
            <div className="flex items-center bg-secondary rounded-full overflow-hidden max-w-lg border border-border">
              <div className="flex items-center gap-2 px-4 flex-1">
                <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Facing symptoms? Type them in"
                  className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none py-3 w-full"
                />
              </div>
              <button className="bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:opacity-90 transition-opacity">
                Search
              </button>
            </div>

            {/* Social */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-sm text-muted-foreground">Follow Us On :</span>
              <div className="flex gap-3">
                {[Facebook, Instagram, Youtube, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Doctor + Stats */}
          <div className="relative flex justify-center lg:justify-end">
            <img
              src={doctorImg}
              alt="Doctor"
              className="relative z-10 max-h-[500px] lg:max-h-[600px] object-contain"
            />
            {/* Stats badges */}
            <div className="absolute right-0 top-1/4 z-20 space-y-4">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-stat backdrop-blur-md rounded-xl px-4 py-3 border border-primary/20"
                >
                  <span className="text-lg font-bold text-primary">{s.value}</span>
                  <span className="text-sm text-foreground">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
