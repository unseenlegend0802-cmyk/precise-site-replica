import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const handleMouseEnter = (i: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenIndex(i);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenIndex(null), 150);
  };

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  return (
    <>
      {/* Desktop navbar — floats over hero */}
      <div className="hidden lg:block absolute left-0 right-0 z-40" style={{ top: 0 }}>
        <div className="max-w-6xl mx-auto px-2 relative">
          {/* Scroll arrows */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-50 bg-secondary/80 hover:bg-secondary text-foreground rounded-full p-1 shadow-md"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-50 bg-secondary/80 hover:bg-secondary text-foreground rounded-full p-1 shadow-md"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Scrollable Row */}
          <div
            ref={scrollRef}
            className="flex items-center py-2.5 overflow-x-auto scrollbar-hide"
          >
            {treatments.map((t, i) => (
              <div
                key={i}
                className="relative flex items-center"
                onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                    openIndex === i
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/90 hover:text-foreground"
                  }`}
                >
                  {t.label}
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Separator */}
                {i < treatments.length - 1 && (
                  <div className="w-px h-4 bg-foreground/20 mx-0.5 shrink-0" />
                )}

                {/* Dropdown */}
                <div
                  className={`absolute left-0 top-full mt-1 min-w-[240px] bg-foreground rounded-lg shadow-xl z-50 transform transition-all duration-300 ${
                    openIndex === i
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 translate-y-2 pointer-events-none"
                  }`}
                  onMouseEnter={() => handleMouseEnter(i)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="py-2">
                    {t.options.map((opt, j) => (
                      <Link
                        key={j}
                        to={`/treatment/${opt.slug}`}
                        className="block px-5 py-2.5 text-sm text-background hover:bg-muted-foreground/20 transition-colors"
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
