import { ChevronRight } from "lucide-react";

const treatments = [
  "Enlarged Prostate",
  "Knee Pain",
  "Thyroid Nodule",
  "Varicocele",
  "Fallopian Tube Block",
  "Uterine Fibroids",
  "Breast Nodules",
  "Plantar Fasciitis",
  "Varicose Veins",
];

const TreatmentBar = () => {
  return (
    <div className="bg-secondary border-b border-border overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-3">
          {treatments.map((t, i) => (
            <a
              key={i}
              href="#treatments"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary whitespace-nowrap px-3 py-1 transition-colors shrink-0"
            >
              {t}
              <ChevronRight className="w-3 h-3" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TreatmentBar;
