import geniculateImg from "@/assets/treatments/geniculate.jpg";
import prostateImg from "@/assets/treatments/prostate.jpg";
import fallopianImg from "@/assets/treatments/fallopian.jpg";
import varicoceleImg from "@/assets/treatments/varicocele.jpg";
import thyroidImg from "@/assets/treatments/thyroid.jpg";
import uterineImg from "@/assets/treatments/uterine.jpg";
import varicoseImg from "@/assets/treatments/varicose.jpg";
import tavrImg from "@/assets/treatments/tavr.jpg";

const treatments = [
  { name: "Geniculate Artery Embolization", desc: "A non-surgical solution to relieve chronic knee pain safely.", img: geniculateImg },
  { name: "Prostate Artery Embolization", desc: "Minimally invasive relief for Prostate without surgery.", img: prostateImg },
  { name: "Fallopian Tube Recanalization", desc: "Non-surgical treatment to unblock fallopian tubes.", img: fallopianImg },
  { name: "Varicocele Embolization", desc: "Minimally invasive relief for varicocele without surgery.", img: varicoceleImg },
  { name: "Thyroid Nodule Ablation", desc: "Minimally invasive treatment for thyroid nodules.", img: thyroidImg },
  { name: "Uterine Fibroid Embolization", desc: "A non-surgical procedure to shrink fibroids and relieve symptoms.", img: uterineImg },
  { name: "Varicose Veins", desc: "Non-surgical treatment for varicose veins.", img: varicoseImg },
  { name: "Transcatheter Aortic Valve Replacement", desc: "Non-surgical aortic valve replacement for better heart function.", img: tavrImg },
];

const TreatmentsSection = () => {
  return (
    <section id="treatments" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Say Goodbye to Surgery
          </h2>
          <p className="text-muted-foreground text-lg">
            Explore Safer, Scar-Free Treatments
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {treatments.map((t, i) => (
            <div
              key={i}
              className="group bg-card-gradient rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-1">{t.name}</h3>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TreatmentsSection;
