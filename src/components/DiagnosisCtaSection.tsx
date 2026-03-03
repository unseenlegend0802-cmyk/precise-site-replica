import { FileSearch, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DiagnosisCtaSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 lg:py-16 bg-secondary">
      <div className="container mx-auto px-4 text-center space-y-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Have you consulted a doctor previously and do you have a diagnosis report?
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate("/scan-report")}
            className="flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-medium text-base hover:opacity-90 transition-opacity"
          >
            <FileSearch className="w-5 h-5" />
            Yes, I have a Diagnosis Report
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="flex items-center gap-3 bg-card-gradient border border-border text-foreground px-8 py-4 rounded-xl font-medium text-base hover:border-primary transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            No, I don't have a Diagnosis Report
          </button>
        </div>
      </div>
    </section>
  );
};

export default DiagnosisCtaSection;
