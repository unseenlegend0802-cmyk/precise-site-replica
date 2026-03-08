
-- Insert Dr. Amol Nagvekar profile
INSERT INTO public.doctors (slug, name, qualification, specialization, experience, bio, image_url, overall_success_rate, complication_rate, avg_recovery_time, languages)
VALUES (
  'dr-Amol-Nagvekar',
  'Dr. Amol Nagvekar',
  'MBBS, DNB, FVIR',
  'Vascular & Interventional Radiology',
  '12+ years',
  'Dr. Amol Nagvekar is a seasoned Vascular and Interventional Radiologist based in Jaipur with over 12 years of experience. He specializes in minimally invasive image-guided procedures including varicose vein treatments, uterine fibroid embolization, and prostate artery embolization. Known for his patient-centric approach and high success rates, he has performed thousands of procedures with excellent outcomes.',
  NULL,
  96,
  1.8,
  '3-5 days',
  ARRAY['English', 'Hindi', 'Marathi']
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  qualification = EXCLUDED.qualification,
  specialization = EXCLUDED.specialization,
  experience = EXCLUDED.experience,
  bio = EXCLUDED.bio,
  overall_success_rate = EXCLUDED.overall_success_rate,
  complication_rate = EXCLUDED.complication_rate,
  avg_recovery_time = EXCLUDED.avg_recovery_time,
  languages = EXCLUDED.languages;

-- Insert procedures for Dr. Amol Nagvekar
INSERT INTO public.doctor_procedures (doctor_id, procedure_name, procedure_slug, procedure_count, success_rate)
SELECT d.id, p.procedure_name, p.procedure_slug, p.procedure_count, p.success_rate
FROM public.doctors d
CROSS JOIN (VALUES
  ('Varicose Vein Treatment', 'varicose-veins', 850, 97),
  ('Uterine Fibroid Embolization', 'uterine-fibroids', 420, 95),
  ('Prostate Artery Embolization', 'prostate-enlargement', 280, 94),
  ('Varicocele Embolization', 'varicocele', 350, 96),
  ('Deep Vein Thrombosis Treatment', NULL, 200, 93)
) AS p(procedure_name, procedure_slug, procedure_count, success_rate)
WHERE d.slug = 'dr-Amol-Nagvekar'
AND NOT EXISTS (
  SELECT 1 FROM public.doctor_procedures dp 
  WHERE dp.doctor_id = d.id AND dp.procedure_name = p.procedure_name
);
