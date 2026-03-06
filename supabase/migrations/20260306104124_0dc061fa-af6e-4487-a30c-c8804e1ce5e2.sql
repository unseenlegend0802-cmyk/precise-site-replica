
-- Create doctors table for extended profile info
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  qualification TEXT,
  specialization TEXT,
  experience TEXT,
  bio TEXT,
  image_url TEXT,
  overall_success_rate NUMERIC(5,2),
  complication_rate NUMERIC(5,2),
  avg_recovery_time TEXT,
  languages TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create doctor_procedures table for success portfolio
CREATE TABLE public.doctor_procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
  procedure_name TEXT NOT NULL,
  procedure_slug TEXT,
  procedure_count INTEGER DEFAULT 0,
  success_rate NUMERIC(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_procedures ENABLE ROW LEVEL SECURITY;

-- Public read access for doctors
CREATE POLICY "Anyone can read doctors" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Anyone can read doctor_procedures" ON public.doctor_procedures FOR SELECT USING (true);
