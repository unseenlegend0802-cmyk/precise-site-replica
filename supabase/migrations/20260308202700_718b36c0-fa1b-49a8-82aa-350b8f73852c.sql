-- Add consultation_notes column to appointments
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS consultation_notes text;

-- Create doctor_availability table
CREATE TABLE IF NOT EXISTS public.doctor_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  day_of_week integer NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(doctor_id, day_of_week)
);

ALTER TABLE public.doctor_availability ENABLE ROW LEVEL SECURITY;

-- Doctors can manage their own availability
CREATE POLICY "Doctors can view own availability"
  ON public.doctor_availability FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Doctors can insert own availability"
  ON public.doctor_availability FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Doctors can update own availability"
  ON public.doctor_availability FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Doctors can delete own availability"
  ON public.doctor_availability FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Anyone can read availability (for booking)
CREATE POLICY "Anyone can read doctor availability"
  ON public.doctor_availability FOR SELECT
  USING (true);

-- Allow doctors to update appointment notes
CREATE POLICY "Doctors can update appointment notes"
  ON public.appointments FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'doctor'::app_role))
  WITH CHECK (has_role(auth.uid(), 'doctor'::app_role));

-- Doctors can view appointments assigned to them
CREATE POLICY "Doctors can view assigned appointments"
  ON public.appointments FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'doctor'::app_role));