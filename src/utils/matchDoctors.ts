import { hospitals, Hospital } from "@/data/hospitals";

// Maps detected conditions/keywords to specialization substrings
const conditionToSpecKeywords: Record<string, string[]> = {
  varicocele: ["vascular", "interventional radiology"],
  "varicose veins": ["vascular", "interventional radiology", "endovascular"],
  "varicose vein": ["vascular", "interventional radiology", "endovascular"],
  "thyroid nodule": ["interventional radiology"],
  "thyroid": ["interventional radiology"],
  "prostate enlargement": ["interventional radiology", "onco"],
  "prostate": ["interventional radiology"],
  "fallopian tubal block": ["interventional radiology"],
  "fallopian tube": ["interventional radiology"],
  "uterine fibroids": ["interventional radiology", "onco"],
  "uterine fibroid": ["interventional radiology", "onco"],
  fibroids: ["interventional radiology"],
  "breast nodule": ["interventional radiology", "onco"],
  stroke: ["neuro", "endovascular"],
  aneurysm: ["neuro", "vascular", "endovascular"],
  dvt: ["vascular", "interventional radiology"],
  "deep vein thrombosis": ["vascular", "interventional radiology"],
  liver: ["interventional radiology", "onco"],
  kidney: ["interventional radiology"],
  embolization: ["interventional radiology", "vascular"],
  cardiac: ["cardiology", "interventional"],
  heart: ["cardiology", "interventional"],
};

export function matchDoctors(detectedConditions: string[]): Hospital[] {
  if (!detectedConditions || detectedConditions.length === 0) return [];

  const specKeywords = new Set<string>();

  for (const condition of detectedConditions) {
    const lower = condition.toLowerCase();
    for (const [keyword, specs] of Object.entries(conditionToSpecKeywords)) {
      if (lower.includes(keyword)) {
        specs.forEach((s) => specKeywords.add(s));
      }
    }
  }

  // If no keyword matched, fall back to substring match against all specializations
  if (specKeywords.size === 0) {
    return hospitals.filter((h) => {
      const specLower = h.specialization.toLowerCase();
      return detectedConditions.some((c) => specLower.includes(c.toLowerCase()));
    });
  }

  return hospitals.filter((h) => {
    const specLower = h.specialization.toLowerCase();
    return Array.from(specKeywords).some((kw) => specLower.includes(kw));
  });
}
