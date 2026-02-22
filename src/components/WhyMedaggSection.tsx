import precisionImg from "@/assets/why/precision.svg";
import custodianImg from "@/assets/why/custodian.svg";
import insuranceImg from "@/assets/why/insurance.png";
import secondOpinionImg from "@/assets/why/second-opinion.svg";
import postCareImg from "@/assets/why/post-care.svg";
import emiImg from "@/assets/why/emi.svg";

const reasons = [
  { title: "Precision Treatments, Simplified", desc: "Skip surgery, not care. Medagg connects you with specialists who offer safe, minimally invasive solutions tailored to your condition.", img: precisionImg },
  { title: "CARE CUSTODIAN", desc: "From first consultation to follow-up, your Medagg Care Custodian ensures a smooth, transparent, and personalized treatment journey.", img: custodianImg },
  { title: "Insurance, Made Easy", desc: "We help you find the right hospital and handle insurance coordination — all major providers are accepted.", img: insuranceImg },
  { title: "SECOND OPINION", desc: "Get clarity before you decide. Medagg connects you with experienced specialists who assess your case and recommend the best treatment path.", img: secondOpinionImg },
  { title: "Complete Post-Procedure Support", desc: "Recovery doesn't stop after treatment. Medagg ensures you get the right post-procedure support, from follow-up consultations to rehabilitation guidance.", img: postCareImg },
  { title: "Flexible, No-Cost EMI", desc: "Quality care should never be out of reach. Medagg offers zero-cost EMI options that make advanced treatments more accessible and affordable.", img: emiImg },
];

const WhyMedaggSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Why Medagg</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Medagg offers expert, non-surgical treatments with personalized care. We guide you with precision, compassion, and trusted medical expertise.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r, i) => (
            <div
              key={i}
              className="bg-card-gradient rounded-xl border border-border p-6 hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-14 h-14 mb-4 rounded-lg bg-stat flex items-center justify-center">
                <img src={r.img} alt={r.title} className="w-8 h-8 object-contain" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">{r.title}</h3>
              <p className="text-sm text-muted-foreground">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyMedaggSection;
