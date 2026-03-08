
-- Drop all existing restrictive policies on doctor_invites and recreate them as permissive
DROP POLICY IF EXISTS "Admins can read invites" ON public.doctor_invites;
DROP POLICY IF EXISTS "Admins can insert invites" ON public.doctor_invites;
DROP POLICY IF EXISTS "Admins can update invites" ON public.doctor_invites;
DROP POLICY IF EXISTS "Admins can delete invites" ON public.doctor_invites;
DROP POLICY IF EXISTS "Anon can read invite by token" ON public.doctor_invites;
DROP POLICY IF EXISTS "Authenticated can update invite status" ON public.doctor_invites;

-- Recreate as PERMISSIVE policies (the default)
CREATE POLICY "Anyone can read invite by token"
  ON public.doctor_invites FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert invites"
  ON public.doctor_invites FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update invites"
  ON public.doctor_invites FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete invites"
  ON public.doctor_invites FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow authenticated users to mark invite as accepted (for doctor registration)
CREATE POLICY "Authenticated can update invite status"
  ON public.doctor_invites FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
