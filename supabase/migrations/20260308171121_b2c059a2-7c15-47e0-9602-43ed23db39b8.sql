
-- Create storage bucket for doctor images
INSERT INTO storage.buckets (id, name, public) VALUES ('doctor-images', 'doctor-images', true);

-- Allow anyone to read doctor images
CREATE POLICY "Anyone can read doctor images" ON storage.objects FOR SELECT USING (bucket_id = 'doctor-images');

-- Allow admins to upload doctor images
CREATE POLICY "Admins can upload doctor images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'doctor-images' AND public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete doctor images
CREATE POLICY "Admins can delete doctor images" ON storage.objects FOR DELETE USING (bucket_id = 'doctor-images' AND public.has_role(auth.uid(), 'admin'));

-- Add admin INSERT policy on doctors
CREATE POLICY "Admins can insert doctors" ON public.doctors FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add admin UPDATE policy on doctors
CREATE POLICY "Admins can update doctors" ON public.doctors FOR UPDATE USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add admin DELETE policy on doctors
CREATE POLICY "Admins can delete doctors" ON public.doctors FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Add columns for hospital_name, consultation_fee, email to doctors table
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS hospital_name text;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS consultation_fee text;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS email text;
