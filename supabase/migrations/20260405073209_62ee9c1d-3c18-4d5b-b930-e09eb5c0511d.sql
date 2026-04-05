
-- Allow doctors to upload images
CREATE POLICY "Doctors can upload own images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'doctor-images'
  AND has_role(auth.uid(), 'doctor'::public.app_role)
);

-- Allow doctors to update/replace their images
CREATE POLICY "Doctors can update own images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'doctor-images'
  AND has_role(auth.uid(), 'doctor'::public.app_role)
)
WITH CHECK (
  bucket_id = 'doctor-images'
  AND has_role(auth.uid(), 'doctor'::public.app_role)
);
