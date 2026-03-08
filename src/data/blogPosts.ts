export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  content: string; // markdown-style paragraphs
}

export const blogCategories = [
  "All",
  "Liver Cancer",
  "Prostate / BPH",
  "Thyroid Nodules",
  "Varicose Veins",
  "Women's Health",
  "IR & Procedures",
  "General Health",
] as const;

export const blogPosts: BlogPost[] = [
  // ── Liver Cancer ──
  {
    slug: "essential-food-for-liver-cancer-what-to-eat-and-what-to-avoid",
    title: "Essential Food for Liver Cancer: What to Eat and What to Avoid",
    excerpt: "Food won't cure cancer, but the right diet supports liver function, boosts immunity, and helps recovery during treatment. Here's what to eat and what to avoid.",
    image: "https://nosurgeries.in/Essential-Food-for-Liver-Cancer_-1024x557.jpg",
    category: "Liver Cancer",
    date: "Jun 5, 2025",
    readTime: "6 min read",
    content: `A liver cancer diagnosis can feel overwhelming, but nutrition plays a crucial supportive role. While no diet can cure cancer, certain foods help your liver function better, strengthen immunity, and aid recovery during treatment.\n\n## Foods to Embrace\n\n**Leafy Greens & Cruciferous Vegetables** — Spinach, kale, broccoli, and cauliflower are packed with antioxidants and phytochemicals that support detoxification pathways in the liver.\n\n**Lean Proteins** — Fish, chicken, eggs, and legumes provide essential amino acids for tissue repair without overloading the liver.\n\n**Whole Grains** — Brown rice, oats, and quinoa deliver sustained energy and fiber that helps regulate digestion.\n\n**Healthy Fats** — Olive oil, avocados, and nuts contain anti-inflammatory omega fatty acids beneficial for liver health.\n\n**Fruits Rich in Antioxidants** — Berries, citrus fruits, and papaya supply vitamins C and E which combat oxidative stress.\n\n## Foods to Avoid\n\n**Alcohol** — Even small amounts strain the liver and can accelerate disease progression.\n\n**Processed & Fried Foods** — High in trans fats and preservatives that burden an already compromised liver.\n\n**Excess Salt** — Can worsen fluid retention (ascites), a common complication of liver disease.\n\n**Red & Processed Meat** — Linked to increased liver inflammation when consumed in excess.\n\n**Sugary Beverages** — Contribute to fatty liver and metabolic stress.\n\n## Practical Tips\n\n- Eat small, frequent meals to reduce digestive strain\n- Stay well-hydrated with water and herbal teas\n- Consult a nutritionist who specializes in oncology diets\n- Keep a food diary to track what helps and what doesn't\n\nAt Medagg, we connect you with specialists who provide holistic care — including nutritional guidance — alongside advanced, minimally invasive treatments through Interventional Radiology.`,
  },
  {
    slug: "liver-cancer-treatment-cost",
    title: "Liver Cancer Treatment Cost: Get the Best Options in India",
    excerpt: "Understand liver cancer treatment costs in India, why care is affordable yet high quality, and how IR offers cost-effective, minimally invasive options.",
    image: "https://nosurgeries.in/Affordable-Liver-Cancer-Treatment-Cost_-1024x557.jpg",
    category: "Liver Cancer",
    date: "May 28, 2025",
    readTime: "5 min read",
    content: `Liver cancer treatment in India offers world-class care at a fraction of international costs. Understanding the cost landscape helps patients plan better.\n\n## Cost Overview\n\nTreatment costs vary based on the stage of cancer, the type of procedure, hospital location, and the treating specialist. In general:\n\n- **TACE (Transarterial Chemoembolization)**: ₹1.5–3 lakh per session\n- **Radiofrequency Ablation (RFA)**: ₹2–4 lakh\n- **Liver Resection Surgery**: ₹4–10 lakh\n- **Liver Transplant**: ₹20–35 lakh\n\n## Why India Is Cost-Effective\n\nIndia's hospitals leverage advanced technology, experienced surgeons, and efficient healthcare delivery systems. Patients from across Asia and Africa travel to India for quality cancer care.\n\n## Interventional Radiology Advantage\n\nIR-based procedures like TACE and RFA are not only less invasive but also significantly more affordable than open surgery. Benefits include:\n\n- Shorter hospital stays (often 1–2 days)\n- Faster recovery with less pain\n- Lower overall treatment costs\n- Repeatability when needed\n\n## Insurance & Financial Support\n\nMany insurance providers in India now cover IR procedures. Medagg's Care Custodians can help you navigate insurance claims and EMI options for treatment.\n\nContact our team to get a personalized cost estimate based on your diagnosis and preferred city.`,
  },
  {
    slug: "stage-4-liver-cancer-symptoms-treatment-and-care-options",
    title: "Stage 4 Liver Cancer: Symptoms, Treatment, and Care Options",
    excerpt: "Stage 4 liver cancer is advanced but not the end of the road. Learn symptoms, diagnosis, modern treatments including IR, and how to plan care.",
    image: "https://nosurgeries.in/Navigating-Stage-4-Liver-Cancer-1024x557.jpg",
    category: "Liver Cancer",
    date: "May 20, 2025",
    readTime: "7 min read",
    content: `A Stage 4 liver cancer diagnosis is serious, but modern medicine offers multiple pathways to manage the disease, improve quality of life, and extend survival.\n\n## Understanding Stage 4\n\nStage 4 means the cancer has spread beyond the liver to nearby lymph nodes or distant organs. It's classified as:\n\n- **Stage 4A**: Spread to nearby lymph nodes\n- **Stage 4B**: Spread to distant organs like lungs or bones\n\n## Common Symptoms\n\n- Unexplained weight loss and fatigue\n- Jaundice (yellowing of skin and eyes)\n- Abdominal swelling and pain\n- Loss of appetite and nausea\n- Easy bruising or bleeding\n\n## Treatment Options\n\nWhile curative treatment may not be possible at this stage, palliative and life-extending options include:\n\n**Transarterial Chemoembolization (TACE)** — Delivers chemotherapy directly to the tumor while blocking its blood supply. Minimally invasive via IR.\n\n**Targeted Therapy** — Drugs like Sorafenib and Lenvatinib that slow tumor growth.\n\n**Immunotherapy** — Checkpoint inhibitors that help the immune system fight cancer cells.\n\n**Supportive Care** — Pain management, nutritional support, and psychological counseling.\n\n## Planning Care\n\nMedagg connects patients with multidisciplinary teams across India who specialize in advanced liver cancer management using both conventional and IR-based approaches.`,
  },
  // ── Prostate / BPH ──
  {
    slug: "understanding-the-difference-between-bph-and-prostate-cancer",
    title: "Understanding the Difference Between BPH and Prostate Cancer",
    excerpt: "BPH and prostate cancer share symptoms but differ greatly. Learn how to distinguish them and explore non-surgical treatment paths.",
    image: "https://nosurgeries.in/Understanding-the-Difference-Between-BPH-and-Prostate-Cancer-1024x557.jpg",
    category: "Prostate / BPH",
    date: "May 15, 2025",
    readTime: "5 min read",
    content: `Many men worry when they experience urinary symptoms — is it BPH or prostate cancer? Understanding the difference is the first step toward peace of mind.\n\n## What Is BPH?\n\nBenign Prostatic Hyperplasia (BPH) is a non-cancerous enlargement of the prostate gland. It's extremely common in men over 50 and causes urinary symptoms like:\n\n- Frequent urination, especially at night\n- Weak urine stream\n- Difficulty starting urination\n- Feeling of incomplete bladder emptying\n\n## What Is Prostate Cancer?\n\nProstate cancer is a malignant growth in the prostate. Early-stage prostate cancer often has no symptoms, which is why screening is important. Advanced stages may cause:\n\n- Blood in urine or semen\n- Bone pain (if metastasized)\n- Erectile dysfunction\n- Similar urinary symptoms as BPH\n\n## Key Differences\n\n| Feature | BPH | Prostate Cancer |\n|---------|-----|----------------|\n| Nature | Benign (non-cancerous) | Malignant |\n| Growth | Inward (compresses urethra) | Outward (can spread) |\n| PSA Levels | Mildly elevated | Often significantly elevated |\n| Treatment | Medications, PAE | Surgery, radiation, hormonal therapy |\n\n## Non-Surgical BPH Treatment\n\n**Prostate Artery Embolization (PAE)** is a minimally invasive IR procedure that shrinks the prostate by blocking its blood supply. Benefits include:\n\n- No general anesthesia required\n- Same-day discharge\n- Preserves sexual function\n- 85-90% symptom improvement\n\nMedagg connects you with experienced interventional radiologists who perform PAE across India.`,
  },
  {
    slug: "enlarged-prostate-diet-effective-foods-to-reduce-prostate-enlargement",
    title: "Enlarged Prostate Diet: Effective Foods to Reduce Prostate Enlargement",
    excerpt: "Discover which foods can help manage BPH symptoms naturally and which to avoid for better prostate health.",
    image: "https://medagghealthcare.com/wp-content/uploads/2024/10/83723702-d072-4129-8c53-dd40b9236b20.jpeg",
    category: "Prostate / BPH",
    date: "May 10, 2025",
    readTime: "5 min read",
    content: `Diet plays a significant role in managing Benign Prostatic Hyperplasia (BPH). While food alone can't cure an enlarged prostate, certain dietary choices can help reduce symptoms and slow progression.\n\n## Foods That Help\n\n**Tomatoes (Lycopene)** — Studies show lycopene may reduce prostate growth. Cooked tomatoes are especially beneficial.\n\n**Pumpkin Seeds** — Rich in zinc, which is essential for prostate health.\n\n**Green Tea** — Contains catechins that may inhibit prostate cell growth.\n\n**Fatty Fish** — Omega-3 fatty acids in salmon, sardines, and mackerel reduce inflammation.\n\n**Soy Products** — Isoflavones in tofu and soy milk may help regulate hormones.\n\n## Foods to Limit\n\n- **Red meat and dairy** — May increase BPH risk\n- **Caffeine and alcohol** — Irritate the bladder\n- **Spicy foods** — Can worsen urinary symptoms\n- **Refined carbohydrates** — Contribute to inflammation\n\n## Lifestyle Tips\n\n- Stay physically active (30 min daily exercise)\n- Maintain a healthy weight\n- Stay hydrated but reduce fluids before bedtime\n- Practice pelvic floor exercises\n\nFor men whose symptoms persist despite dietary changes, Prostate Artery Embolization (PAE) offers a minimally invasive solution. Talk to a Medagg Care Custodian to learn more.`,
  },
  // ── Thyroid Nodules ──
  {
    slug: "how-to-shrink-thyroid-nodules-without-surgery",
    title: "How To Shrink Thyroid Nodules Without Surgery: A Comprehensive Guide",
    excerpt: "Thyroid nodules are common and usually benign. Learn about non-surgical options including radiofrequency ablation for shrinking nodules.",
    image: "https://images.surferseo.art/91bfacab-acaf-41a9-9b20-566cfd7c2f60.jpeg",
    category: "Thyroid Nodules",
    date: "May 5, 2025",
    readTime: "6 min read",
    content: `Thyroid nodules affect up to 50% of the population by age 60, though most are benign and don't require surgery. For those that cause symptoms or cosmetic concern, non-surgical treatments are increasingly available.\n\n## Understanding Thyroid Nodules\n\nThyroid nodules are abnormal growths within the thyroid gland. Most are:\n- Benign (95%+ of cases)\n- Discovered incidentally during imaging\n- Asymptomatic unless large\n\n## When Treatment Is Needed\n\nTreatment may be considered when nodules:\n- Cause difficulty swallowing or breathing\n- Are cosmetically bothersome\n- Are growing rapidly\n- Show suspicious features on biopsy\n\n## Non-Surgical Treatment Options\n\n**Radiofrequency Ablation (RFA)** — A minimally invasive IR procedure where a needle-like probe delivers heat to shrink the nodule. Benefits:\n- 50-80% volume reduction within 12 months\n- Local anesthesia only\n- Same-day procedure\n- Minimal scarring\n- Preserves thyroid function\n\n**Ethanol Ablation** — Effective for cystic nodules, where alcohol is injected to collapse the cyst.\n\n**Laser Ablation** — Similar to RFA but uses laser energy.\n\n**Active Surveillance** — For small, stable, benign nodules, regular monitoring with ultrasound may be sufficient.\n\n## Why Choose IR Over Surgery?\n\nTraditional thyroidectomy removes part or all of the thyroid, requiring lifelong hormone replacement. IR-based ablation preserves the gland while effectively treating the nodule.\n\nMedagg connects you with thyroid ablation specialists across India. Contact us for a consultation.`,
  },
  {
    slug: "understanding-hot-and-cold-thyroid-nodules",
    title: "Understanding Hot and Cold Thyroid Nodules: A Comprehensive Overview",
    excerpt: "Thyroid nodules classified as 'hot' or 'cold' based on thyroid scans. Learn what each means for diagnosis and treatment.",
    image: "https://images.surferseo.art/ee40d002-94ac-495e-8861-3fa2cbd15abe.jpeg",
    category: "Thyroid Nodules",
    date: "Apr 28, 2025",
    readTime: "5 min read",
    content: `When a thyroid scan is performed, nodules are classified based on their iodine uptake. Understanding these classifications helps guide diagnosis and treatment decisions.\n\n## Hot Nodules\n\nHot nodules absorb more iodine than surrounding tissue, appearing bright on scans. They are:\n- Almost always benign\n- Often autonomously functioning\n- May cause hyperthyroidism\n- Rarely cancerous (<1%)\n\n## Cold Nodules\n\nCold nodules absorb less iodine, appearing dark on scans. They are:\n- More common than hot nodules\n- Most are still benign (85-90%)\n- Have a higher cancer risk (5-15%)\n- Usually require biopsy (FNA) for evaluation\n\n## Diagnosis Pathway\n\n1. **Thyroid Function Tests** — TSH, T3, T4 levels\n2. **Ultrasound** — Evaluates size, composition, and suspicious features\n3. **Thyroid Scan** — Determines hot vs cold classification\n4. **Fine Needle Aspiration** — For cold or suspicious nodules\n\n## Treatment Based on Type\n\n**Hot Nodules**: Radioactive iodine therapy or radiofrequency ablation\n**Cold Nodules (Benign)**: Monitoring or ablation if symptomatic\n**Cold Nodules (Suspicious)**: Surgical excision or ablation based on biopsy results\n\nMedagg's network includes thyroid specialists who offer advanced non-surgical ablation techniques for eligible patients.`,
  },
  // ── Varicose Veins ──
  {
    slug: "laser-treatment-for-varicose-veins-costs-benefits-and-side-effects",
    title: "Laser Treatment for Varicose Veins: Costs, Benefits, and Side Effects",
    excerpt: "Endovenous laser treatment (EVLT) is the gold standard for varicose veins. Understand costs, benefits, recovery, and what to expect.",
    image: "https://medagghealthcare.com/wp-content/uploads/2024/10/Varicose-Veins.png",
    category: "Varicose Veins",
    date: "Apr 20, 2025",
    readTime: "6 min read",
    content: `Varicose veins affect millions of Indians, causing pain, swelling, and cosmetic concerns. Endovenous Laser Treatment (EVLT) has revolutionized how we treat this condition.\n\n## What Is EVLT?\n\nEndovenous Laser Treatment uses laser energy delivered through a thin fiber inserted into the affected vein. The laser heats and seals the vein, redirecting blood flow to healthy veins.\n\n## Benefits\n\n- **Minimally invasive** — Performed through a tiny needle puncture\n- **Local anesthesia** — No general anesthesia needed\n- **Quick procedure** — Takes 30-60 minutes\n- **Same-day discharge** — Walk out of the hospital\n- **High success rate** — 95-98% closure rate\n- **Minimal scarring** — No surgical incisions\n\n## Cost in India\n\nEVLT costs typically range from ₹40,000 to ₹1,00,000 per leg, depending on:\n- Severity of varicose veins\n- Hospital and city\n- Number of veins treated\n- Insurance coverage\n\n## Recovery\n\n- Resume normal activities within 1-2 days\n- Wear compression stockings for 2-4 weeks\n- Avoid strenuous exercise for 1-2 weeks\n- Follow-up ultrasound at 1 week and 3 months\n\n## Possible Side Effects\n\n- Mild bruising and soreness (temporary)\n- Numbness along the treated vein (rare)\n- Skin discoloration (usually fades)\n\nMedagg partners with vascular specialists across India who perform EVLT with excellent outcomes. Book a consultation today.`,
  },
  {
    slug: "varicose-veins-stages-and-non-surgical-treatment-options",
    title: "Varicose Veins Stages and Non-Surgical Treatment Options",
    excerpt: "Varicose veins progress through stages. Learn to identify your stage and discover the best non-surgical treatment for each.",
    image: "https://images.surferseo.art/671af622-f4f7-4937-9a75-4d7f95b6df81.jpeg",
    category: "Varicose Veins",
    date: "Apr 15, 2025",
    readTime: "5 min read",
    content: `Understanding the stages of varicose veins helps patients and doctors choose the right treatment at the right time.\n\n## CEAP Classification Stages\n\n**C0 — No visible signs** but symptoms like heaviness or aching may be present.\n\n**C1 — Spider veins** (telangiectasias) — Small, web-like veins visible under the skin.\n\n**C2 — Varicose veins** — Enlarged, bulging, twisted veins visible on the surface.\n\n**C3 — Edema** — Swelling in the affected leg, especially after prolonged standing.\n\n**C4 — Skin changes** — Discoloration, eczema, or thickening of skin around the ankles.\n\n**C5 — Healed ulcer** — Previous venous ulcer that has healed.\n\n**C6 — Active ulcer** — Open wound caused by chronic venous insufficiency.\n\n## Treatment by Stage\n\n**C0-C1**: Compression stockings, exercise, lifestyle changes\n**C2-C3**: Endovenous Laser Ablation (EVLA), Radiofrequency Ablation, Sclerotherapy\n**C4-C6**: Comprehensive IR treatment + wound care\n\n## Why Non-Surgical?\n\nTraditional stripping surgery requires general anesthesia, hospital admission, and weeks of recovery. Modern IR techniques offer:\n- Day-care procedures\n- Immediate mobility\n- Better cosmetic outcomes\n- Lower recurrence rates\n\nDon't wait for advanced stages. Contact Medagg to get connected with a varicose vein specialist near you.`,
  },
  // ── Women's Health ──
  {
    slug: "fallopian-tube-blockage-treatment-without-surgery",
    title: "Fallopian Tube Blockage Treatment Without Surgery",
    excerpt: "Fallopian tube blockage is a leading cause of infertility. Learn about non-surgical recanalization through Interventional Radiology.",
    image: "https://nosurgeries.in/fallopian_tube.png",
    category: "Women's Health",
    date: "Apr 10, 2025",
    readTime: "6 min read",
    content: `Fallopian tube blockage accounts for approximately 25-35% of female infertility cases. While IVF is often suggested, a less invasive option exists: Fallopian Tube Recanalization (FTR).\n\n## What Causes Blockage?\n\n- Pelvic inflammatory disease (PID)\n- Endometriosis\n- Previous ectopic pregnancy\n- Pelvic surgery or adhesions\n- Tuberculosis (common in India)\n\n## Fallopian Tube Recanalization (FTR)\n\nFTR is a minimally invasive IR procedure that opens blocked fallopian tubes using a catheter and guidewire, all guided by fluoroscopy (real-time X-ray).\n\n### How It Works\n\n1. A thin catheter is inserted through the cervix\n2. Contrast dye identifies the blockage location\n3. A micro-guidewire gently opens the blockage\n4. Dye flow confirms successful recanalization\n\n### Benefits\n\n- **No surgery, no incisions** — Done through natural pathways\n- **30-minute procedure** — Performed as outpatient\n- **No general anesthesia** — Mild sedation only\n- **High success rate** — 70-90% for proximal blockages\n- **Natural conception possible** — Within months after the procedure\n- **Fraction of IVF cost** — ₹30,000-60,000 vs ₹1.5-2.5 lakh for IVF\n\n## Who Is a Candidate?\n\nFTR works best for:\n- Proximal (near the uterus) blockages\n- Mucus plug obstructions\n- Mild adhesive blockages\n\nIt may not be suitable for:\n- Distal (fimbrial end) blockages\n- Severe tubal damage\n- Hydrosalpinx\n\nMedagg's network includes fertility-focused interventional radiologists across India. Get a free consultation to explore your options.`,
  },
  {
    slug: "treatment-for-uterine-fibroids-without-surgery",
    title: "Treatment for Uterine Fibroids Without Surgery",
    excerpt: "Uterine fibroids don't always need hysterectomy. Discover how Uterine Artery Embolization (UAE) offers a non-surgical solution.",
    image: "https://medagghealthcare.com/wp-content/uploads/2024/08/Treatment-for-Uterine-Fibroids-without-surgery-1024x576.png",
    category: "Women's Health",
    date: "Apr 5, 2025",
    readTime: "6 min read",
    content: `Uterine fibroids are non-cancerous growths that affect up to 70% of women by age 50. While hysterectomy has been the traditional treatment, Uterine Artery Embolization (UAE) offers a uterus-preserving alternative.\n\n## What Are Fibroids?\n\nFibroids (leiomyomas) are muscular tumors that grow in or on the uterine wall. Types include:\n- **Intramural** — Within the uterine wall (most common)\n- **Subserosal** — On the outer surface\n- **Submucosal** — Protruding into the uterine cavity\n\n## Symptoms\n\n- Heavy or prolonged menstrual bleeding\n- Pelvic pain and pressure\n- Frequent urination\n- Difficulty conceiving\n- Abdominal bloating\n\n## Uterine Artery Embolization (UAE)\n\nUAE is performed by an interventional radiologist who:\n1. Makes a tiny puncture in the wrist or groin artery\n2. Threads a catheter to the uterine arteries\n3. Injects tiny particles that block blood flow to fibroids\n4. Fibroids shrink over 3-6 months\n\n### Benefits of UAE\n\n- **Preserves the uterus** — No hysterectomy needed\n- **Treats all fibroids at once** — Regardless of number or location\n- **Minimally invasive** — Single puncture, no incisions\n- **Quick recovery** — Back to work in 1-2 weeks\n- **90% symptom improvement** — Significant reduction in bleeding and pain\n\n### Cost\n\nUAE typically costs ₹1-2.5 lakh in India, compared to ₹2-5 lakh for surgical myomectomy or hysterectomy.\n\nMedagg partners with UAE specialists across 20+ cities. Talk to our Care Custodians for guidance.`,
  },
  // ── IR & Procedures ──
  {
    slug: "what-is-interventional-radiology",
    title: "What Is Interventional Radiology? A Complete Guide",
    excerpt: "Interventional Radiology uses advanced imaging to perform minimally invasive procedures. Learn how IR is transforming healthcare.",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=400&fit=crop",
    category: "IR & Procedures",
    date: "Mar 30, 2025",
    readTime: "7 min read",
    content: `Interventional Radiology (IR) is a medical specialty that uses image-guided techniques to perform minimally invasive procedures. It's revolutionizing how conditions are diagnosed and treated across nearly every organ system.\n\n## How Does IR Work?\n\nInterventional radiologists use real-time imaging — including ultrasound, fluoroscopy, CT, and MRI — to guide tiny instruments through blood vessels or directly through the skin to treat conditions from inside the body.\n\n## Common IR Procedures\n\n**Vascular Procedures:**\n- Prostate Artery Embolization (PAE) for enlarged prostate\n- Uterine Artery Embolization (UAE) for fibroids\n- Varicocele Embolization for male infertility\n- Endovenous Ablation for varicose veins\n\n**Tumor Treatments:**\n- Transarterial Chemoembolization (TACE) for liver cancer\n- Radiofrequency Ablation for tumors\n- Cryoablation for various cancers\n\n**Diagnostic & Therapeutic:**\n- Image-guided biopsies\n- Abscess drainage\n- Fallopian Tube Recanalization\n- Thyroid Nodule Ablation\n\n## Benefits of IR\n\n- **Minimally invasive** — Small punctures instead of large incisions\n- **Faster recovery** — Days instead of weeks\n- **Less pain** — Often done under local anesthesia\n- **Lower risk** — Fewer complications than open surgery\n- **Cost-effective** — Shorter hospital stays\n\n## IR in India\n\nIndia has a growing network of skilled interventional radiologists, but awareness remains low. Medagg is bridging this gap by connecting patients with IR specialists across 20+ cities.\n\nDiscover if an IR procedure is right for your condition. Contact Medagg today.`,
  },
  {
    slug: "prostate-artery-embolization-non-surgical-bph-solution",
    title: "Prostate Artery Embolization: A Non-Surgical BPH Solution",
    excerpt: "PAE is a safe, effective alternative to surgery for enlarged prostate. Understand the procedure, benefits, and what to expect.",
    image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&h=400&fit=crop",
    category: "IR & Procedures",
    date: "Mar 20, 2025",
    readTime: "5 min read",
    content: `Prostate Artery Embolization (PAE) is emerging as a game-changing treatment for men suffering from Benign Prostatic Hyperplasia (BPH) who want to avoid surgery.\n\n## What Is PAE?\n\nPAE is a minimally invasive procedure performed by an interventional radiologist. A catheter is inserted through a small puncture (usually in the wrist) and guided to the arteries supplying the prostate. Tiny microspheres are injected to reduce blood flow, causing the prostate to shrink.\n\n## Who Is It For?\n\nPAE is suitable for men who:\n- Have moderate to severe BPH symptoms\n- Want to avoid surgery (TURP or open prostatectomy)\n- Have large prostates (>80ml)\n- Are on blood thinners\n- Want to preserve sexual function\n\n## The Procedure\n\n1. Local anesthesia at the wrist\n2. Catheter navigation under fluoroscopy\n3. Selective embolization of prostatic arteries\n4. Procedure takes 1-2 hours\n5. Same-day or next-day discharge\n\n## Results\n\n- 85-90% of patients report significant symptom improvement\n- Average prostate volume reduction of 25-40%\n- Benefits continue to improve over 3-6 months\n- Sexual function preserved in virtually all patients\n\n## PAE vs TURP\n\n| Feature | PAE | TURP |\n|---------|-----|------|\n| Anesthesia | Local | Spinal/General |\n| Hospital Stay | Same-day | 2-3 days |\n| Recovery | 3-5 days | 4-6 weeks |\n| Sexual Side Effects | Rare | Common |\n| Large Prostates | Excellent | Limited |\n\nMedagg's network includes PAE specialists across India. Book your consultation today.`,
  },
  // ── General Health ──
  {
    slug: "how-medagg-is-revolutionizing-healthcare-across-india",
    title: "How Medagg Is Revolutionizing Healthcare Across India",
    excerpt: "From 1 city to 20+, Medagg's journey in building India's largest interventional radiology network is transforming patient access to care.",
    image: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=600&h=400&fit=crop",
    category: "General Health",
    date: "Mar 15, 2025",
    readTime: "4 min read",
    content: `Healthcare in India is fragmented. Patients struggle to find the right specialist, compare treatment options, or understand what's available beyond traditional surgery. Medagg Healthcare was founded to change this.\n\n## The Problem\n\n- **Information asymmetry** — Patients don't know about minimally invasive alternatives\n- **Advertising-driven platforms** — Sponsored listings don't prioritize patient needs\n- **Geographic barriers** — Advanced IR specialists are concentrated in metros\n- **Cost confusion** — Lack of transparent pricing\n\n## Medagg's Approach\n\n**Care Custodians** — Dedicated healthcare navigators who guide patients from first inquiry to recovery.\n\n**Ethical Guidance** — We don't accept advertising from hospitals. Recommendations are based purely on medical merit.\n\n**National Network** — 200+ partnered hospitals across 20+ cities, with a focus on Interventional Radiology.\n\n**Technology Integration** — AI-powered health tools, scan analysis, and doctor matching.\n\n## Impact So Far\n\n- 2,500+ patients helped\n- 5,000+ consultations booked\n- Average patient savings of ₹50,000\n- Expansion from Tamil Nadu to pan-India\n\n## What's Next\n\nMedagg is building India's most comprehensive IR care network — making non-surgical treatments accessible, affordable, and trustworthy for every Indian.\n\nJoin us on this journey. Whether you're a patient, doctor, or hospital, there's a place for you in the Medagg ecosystem.`,
  },
  {
    slug: "the-role-of-care-custodians-in-your-treatment-journey",
    title: "The Role of Care Custodians in Your Treatment Journey",
    excerpt: "A Care Custodian is your personal healthcare navigator. From consultations to recovery, here's how they simplify your medical journey.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
    category: "General Health",
    date: "Mar 10, 2025",
    readTime: "4 min read",
    content: `Navigating the healthcare system can be overwhelming, especially when facing a new diagnosis. That's where Medagg's Care Custodians come in.\n\n## What Is a Care Custodian?\n\nA Care Custodian is a trained healthcare navigator assigned to every Medagg patient. They serve as your single point of contact throughout your treatment journey.\n\n## What They Do\n\n**Pre-Treatment:**\n- Understand your condition and concerns\n- Research and recommend the best specialists\n- Compare hospitals, costs, and success rates\n- Schedule appointments and second opinions\n- Help with insurance pre-authorization\n\n**During Treatment:**\n- Coordinate with the medical team\n- Ensure all pre-procedure requirements are met\n- Provide emotional support and answer questions\n- Handle logistics (travel, accommodation if needed)\n\n**Post-Treatment:**\n- Follow up on recovery milestones\n- Coordinate follow-up appointments\n- Address any concerns or complications\n- Provide ongoing health guidance\n\n## Why It Matters\n\nStudies show that guided healthcare leads to:\n- Better treatment outcomes\n- Higher patient satisfaction\n- Reduced anxiety and confusion\n- Lower out-of-pocket costs\n\n## Real Stories\n\n*"My Care Custodian helped me find a clinic for my knee procedure with a 2-week shorter wait time."* — Suraiya, Kolkata\n\n*"The care team guided me to the right specialist after months of trying to figure out my chronic pain issues."* — Thomas, Chennai\n\nEvery Medagg patient gets a Care Custodian — free of charge. Contact us to start your guided healthcare journey.`,
  },
  {
    slug: "knee-pain-treatment-without-surgery",
    title: "Knee Pain Treatment Without Surgery",
    excerpt: "Knee osteoarthritis affects millions. Learn about Genicular Artery Embolization (GAE) — a breakthrough non-surgical treatment.",
    image: "https://images.surferseo.art/e054e88a-8604-4222-9d8f-02cd9b853069.png",
    category: "General Health",
    date: "Mar 5, 2025",
    readTime: "5 min read",
    content: `Knee arthritis (osteoarthritis) affects roughly 7% of the global population. For many, knee replacement surgery seems like the only option — but Genicular Artery Embolization (GAE) is changing that.\n\n## What Is GAE?\n\nGenicular Artery Embolization is a minimally invasive IR procedure that targets the abnormal blood vessels around an arthritic knee that contribute to inflammation and pain.\n\n## How It Works\n\n1. A tiny catheter is inserted through a puncture in the wrist or groin\n2. Under fluoroscopic guidance, it's navigated to the genicular arteries\n3. Microscopic particles are injected to reduce abnormal blood flow\n4. Inflammation decreases, leading to pain relief\n\n## Benefits\n\n- **Non-surgical** — No incisions, stitches, or implants\n- **Quick procedure** — 60-90 minutes\n- **Minimal recovery** — Return to activities within days\n- **Pain reduction** — 70-80% of patients report significant improvement\n- **Delays or avoids knee replacement** — Buys years of pain-free mobility\n\n## Who Is a Candidate?\n\nGAE is ideal for patients who:\n- Have mild to moderate knee osteoarthritis\n- Haven't responded well to medications or injections\n- Want to delay knee replacement\n- Are not surgical candidates due to age or health conditions\n\n## Cost\n\nGAE typically costs ₹1-2 lakh in India — significantly less than knee replacement surgery (₹3-5 lakh per knee).\n\nMedagg connects you with GAE specialists across India. Book a consultation to explore this option.`,
  },
  {
    slug: "varicocele-treatment-without-surgery",
    title: "Varicocele Treatment Without Surgery: Varicocele Embolization",
    excerpt: "Varicocele embolization offers a non-surgical, catheter-based solution for varicocele with faster recovery and excellent outcomes.",
    image: "https://medagghealthcare.com/wp-content/uploads/2024/08/Varicocele-treatment-without-surgery-1024x576.png",
    category: "General Health",
    date: "Feb 28, 2025",
    readTime: "5 min read",
    content: `Varicocele — enlarged veins in the scrotum — affects about 15% of men and is a leading cause of male infertility. Varicocele Embolization offers a non-surgical alternative to traditional surgery.\n\n## What Is Varicocele?\n\nA varicocele occurs when the veins within the scrotum (pampiniform plexus) become enlarged due to faulty valves, similar to varicose veins in the legs. This can:\n- Raise testicular temperature\n- Reduce sperm quality and count\n- Cause pain and discomfort\n- Lead to testicular atrophy\n\n## Varicocele Embolization\n\nThis IR procedure involves:\n1. A small puncture in the neck or groin vein\n2. A catheter is guided to the testicular vein\n3. Coils or a sclerosing agent blocks the abnormal veins\n4. Blood redirects through healthy pathways\n\n## Benefits Over Surgery\n\n| Feature | Embolization | Surgery |\n|---------|-------------|--------|\n| Anesthesia | Local/Sedation | General/Spinal |\n| Incisions | None (puncture only) | 1-3 incisions |\n| Recovery | 1-2 days | 1-2 weeks |\n| Success Rate | 90-95% | 90-95% |\n| Recurrence | <5% | 5-15% |\n| Bilateral Treatment | Same session | Separate procedures |\n\n## Results\n\n- Pain relief within days\n- Sperm parameters improve in 3-6 months\n- Natural conception rates increase significantly\n\nMedagg partners with varicocele embolization specialists across India. Book a consultation today.`,
  },
];

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((b) => b.slug === slug);
}

export function getBlogsByCategory(category: string): BlogPost[] {
  if (category === "All") return blogPosts;
  return blogPosts.filter((b) => b.category === category);
}
