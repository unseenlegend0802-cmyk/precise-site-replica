import careCustodianImg from "@/assets/services/care-custodian.svg";
import careCompanionImg from "@/assets/services/care-companion.jpg";
import secondOpinionImg from "@/assets/services/second-opinion.svg";

const services = [
  {
    title: "CARE CUSTODIAN",
    desc: "Care Custodians offer expert guidance on alternative treatments to surgery.",
    img: careCustodianImg,
  },
  {
    title: "CARE COMPANION",
    desc: "We connect you with top hospitals and expert doctors for exceptional care.",
    img: careCompanionImg,
  },
  {
    title: "SECOND OPINION",
    desc: "Medagg Healthcare offers expert second opinions, connecting you with top doctors to ensure the best approach for your health concerns.",
    img: secondOpinionImg,
  },
];

const ServicesSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Our Services</h2>
          <p className="text-muted-foreground text-lg">
            Care that's safer, smarter, and surgery-free.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <div
              key={i}
              className="bg-card-gradient rounded-xl border border-border p-6 text-center hover:border-primary/50 transition-all duration-300 group"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-stat flex items-center justify-center overflow-hidden">
                <img src={s.img} alt={s.title} className="w-12 h-12 object-contain" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
