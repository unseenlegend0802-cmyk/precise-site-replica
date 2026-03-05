import { treatmentDetails } from "@/data/treatments";

const CONDITION_KEYWORDS: Record<string, string[]> = {
  "varicocele-embolization": ["varicocele"],
  "prostate-artery-embolization": ["prostate", "bph", "enlarged prostate"],
  "thyroid-nodule-ablation": ["thyroid"],
  "fallopian-tube-recanalization": ["fallopian", "tubal block"],
  "uterine-artery-embolization": ["uterine", "fibroid"],
  "endovenous-ablation": ["varicose"],
  "genicular-artery-embolization": ["knee pain", "osteoarthritis"],
  "breast-nodule-vae": ["breast nodule", "breast lump"],
  "plantar-fasciitis-embolization": ["plantar fasciitis", "heel pain"],
  "endovascular-recanalization-stenting": ["diabetic foot"],
  "adhesive-capsulitis-embolization": ["frozen shoulder"],
};

export function findTreatmentForConditions(conditions: string[]) {
  const joined = conditions.join(" ").toLowerCase();
  for (const [slug, keywords] of Object.entries(CONDITION_KEYWORDS)) {
    if (keywords.some((kw) => joined.includes(kw))) {
      const treatment = treatmentDetails.find((t) => t.slug === slug);
      if (treatment) return treatment;
    }
  }
  return null;
}
