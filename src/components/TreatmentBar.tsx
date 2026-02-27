import { useState, useRef, useEffect } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const treatments = [
  { label: "Enlarged Prostate", options: [{ name: "Prostate Artery Embolization", slug: "prostate-artery-embolization" }] },
  { label: "Knee Pain", options: [{ name: "Genicular Artery Embolization", slug: "genicular-artery-embolization" }] },
  { label: "Thyroid Nodule", options: [{ name: "Thyroid Nodule Ablation", slug: "thyroid-nodule-ablation" }] },
  { label: "Varicocele", options: [{ name: "Varicocele Embolization", slug: "varicocele-embolization" }] },
  { label: "Fallopian Tube Block", options: [{ name: "Fallopian Tube Recanalization", slug: "fallopian-tube-recanalization" }] },
  { label: "Uterine Fibroids", options: [{ name: "Uterine Artery Embolization", slug: "uterine-artery-embolization" }] },
  { label: "Breast Nodules", options: [
    { name: "Breast Nodule VAE", slug: "breast-nodule-vae" },
    { name: "Breast Nodule Cryoablation", slug: "breast-nodule-cryoablation" },
    { name: "Breast Nodule Radiofrequency Ablation", slug: "breast-nodule-radiofrequency-ablation" },
  ]},
  { label: "Plantar Fasciitis", options: [{ name: "Plantar Fasciitis Embolization", slug: "plantar-fasciitis-embolization" }] },
  { label: "Varicose Veins", options: [{ name: "Endovenous Ablation", slug: "endovenous-ablation" }] },
  { label: "Diabetic Foot", options: [{ name: "Endovascular Recanalization & Stenting", slug: "endovascular-recanalization-stenting" }] },
  { label: "Frozen Shoulder", options: [{ name: "Adhesive Capsulitis Embolization", slug: "adhesive-capsulitis-embolization" }] },
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
      {/* Desktop navbar */}
      <div className="hidden lg:block bg-muted/60 border-b border-border">
        <div className="container mx-auto px-1 relative">
          
            {/* Scroll Wrapper */}
            <div className="relative">
              {/* Scrollable Row */}
              <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
                
                {treatments.map((t, i) => (
                  <div
                    key={i}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(i)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      onClick={() => setOpenIndex(openIndex === i ? null : i)}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-foreground hover:text-primary bg-transparent transition-all duration-200 whitespace-nowrap"
                    >
                      {t.label}
                      <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`} />
                    </button>

                    {/* Dropdown with smooth animation */}
                    <div
                      className={`absolute left-0 top-full w-full bg-background shadow-lg z-40 border-t transform transition-all duration-300 ${
                        openIndex === i
                          ? "opacity-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 translate-y-1 pointer-events-none"
                      }`}
                      onMouseEnter={() => handleMouseEnter(i)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="py-1.5">
                        {t.options.map((opt, j) => (
                          <Link
                            key={j}
                            to={`/treatment/${opt.slug}`}
                            className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted/80 hover:text-primary transition-colors"
                            onClick={() => setOpenIndex(null)}
                          >
                            {opt.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                      <Link
                        key={j}
                        to={`/treatment/${opt.slug}`}
                        className="block text-sm py-2 text-muted-foreground hover:text-primary transition-colors"
                        onClick={() => { setOpenIndex(null); setMobileOpen(false); }}
                      >
                        {opt.name}
                      </Link>
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
