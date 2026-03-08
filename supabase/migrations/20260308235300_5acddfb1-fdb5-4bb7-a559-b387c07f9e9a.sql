-- Fix: avoid referencing auth.users in RLS (causes "permission denied for table users")
-- Replace with JWT email claim check.

DROP POLICY IF EXISTS "Doctors can update own record" ON public.doctors;
DROP POLICY IF EXISTS "Doctors can insert own record" ON public.doctors;

CREATE POLICY "Doctors can update own record"
ON public.doctors
FOR UPDATE
TO authenticated
USING (
  email IS NOT NULL
  AND lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
)
WITH CHECK (
  email IS NOT NULL
  AND lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

CREATE POLICY "Doctors can insert own record"
ON public.doctors
FOR INSERT
TO authenticated
WITH CHECK (
  email IS NOT NULL
  AND lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);
