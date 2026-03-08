-- Allow admins to read all appointments
CREATE POLICY "Admins can read all appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to read all scan reports
CREATE POLICY "Admins can read all scan reports"
ON public.scan_reports
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));