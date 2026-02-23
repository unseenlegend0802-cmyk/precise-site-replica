import { useState, useRef, useEffect } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

const treatments = [
  { label: "Enlarged Prostate", options: ["Prostate Artery Embolization"] },
  { label: "Knee Pain", options: ["Genicular Artery Embolization"] },
  { label: "Thyroid Nodule", options: ["Thyroid Nodule Ablation"] },
  { label: "Varicocele", options: ["Varicocele Embolization"] },
  { label: "Fallopian Tube Block", options: ["Fallopian Tube Recanalization"] },
  { label: "Uterine Fibroids", options: ["Uterine Artery Embolization"] },
  { label: "Breast Nodules", options: ["Breast Nodule VAE", "Breast Nodule Cryoablation", "Breast Nodule Radiofrequency Ablation"] },
  { label: "Plantar Fasciitis", options: ["Plantar Fasciitis Embolization"] },
  { label: "Varicose Veins", options: ["Endovenous Ablation"] },
  { label: "Diabetic Foot", options: ["Endovascular Recanalization & Stenting"] },
  { label: "Frozen Shoulder", options: ["Adhesive Capsulitis Embolization"] },
];

const TreatmentBar = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = (i: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenIndex(i);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenIndex(null), 150);
  };

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  return (
    <>
      {/* Purple strip */}
      <div className="h-1.5 bg-primary w-full" />

      {/* Desktop navbar */}
      <div className="hidden lg:block bg-muted/60 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
            {treatments.map((t, i) => (
              <div
                key={i}
                className="relative shrink-0"
                onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="flex items-center gap-1.5 text-sm font-medium px-3.5 py-2 rounded-md bg-accent text-accent-foreground transition-all duration-200 hover:opacity-90 whitespace-nowrap"
                >
                  {t.label}
                  <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown with smooth height animation */}
                <div
                  className={`absolute top-full left-0 mt-1 bg-background rounded-lg shadow-lg border border-border min-w-[240px] z-50 transition-all duration-300 origin-top ${
                    openIndex === i
                      ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 scale-y-75 -translate-y-1 pointer-events-none"
                  }`}
                  onMouseEnter={() => handleMouseEnter(i)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="py-1.5">
                    {t.options.map((opt, j) => (
                      <a
                        key={j}
                        href="#treatments"
                        className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted/80 hover:text-primary transition-colors"
                      >
                        {opt}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile navbar */}
      <div className="lg:hidden bg-muted/60 border-b border-border">
        <div className="container mx-auto px-4 flex items-center justify-between py-2.5">
          <span className="text-sm font-semibold text-foreground">Treatments</span>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-foreground">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="px-4 pb-3 space-y-1 animate-fade-in">
            {treatments.map((t, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="flex items-center justify-between w-full text-sm font-medium px-3 py-2.5 rounded-md bg-accent text-accent-foreground"
                >
                  {t.label}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
                </button>
                {openIndex === i && (
                  <div className="ml-3 mt-1 mb-1 border-l-2 border-primary/30 pl-3">
                    {t.options.map((opt, j) => (
                      <a key={j} href="#treatments" className="block text-sm py-2 text-muted-foreground hover:text-primary transition-colors">
                        {opt}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TreatmentBar;
