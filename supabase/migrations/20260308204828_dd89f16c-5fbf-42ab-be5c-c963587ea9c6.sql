
-- Create doctor_invites table
CREATE TABLE public.doctor_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_name text NOT NULL,
  doctor_email text NOT NULL,
  invite_token uuid NOT NULL DEFAULT gen_random_uuid(),
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  invited_by uuid NOT NULL,
  UNIQUE(invite_token),
  UNIQUE(doctor_email)
);

-- Enable RLS
ALTER TABLE public.doctor_invites ENABLE ROW LEVEL SECURITY;

-- Only admins can insert invites
CREATE POLICY "Admins can insert invites"
  ON public.doctor_invites FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can read all invites
CREATE POLICY "Admins can read invites"
  ON public.doctor_invites FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Anon can read invites by token for registration validation
CREATE POLICY "Anon can read invite by token"
  ON public.doctor_invites FOR SELECT
  TO anon
  USING (true);

-- Admins can update invites
CREATE POLICY "Admins can update invites"
  ON public.doctor_invites FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Authenticated users can update invite status (for registration flow)
CREATE POLICY "Authenticated can update invite status"
  ON public.doctor_invites FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Admins can delete invites
CREATE POLICY "Admins can delete invites"
  ON public.doctor_invites FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow doctors to update their own doctor record by email match
CREATE POLICY "Doctors can update own record"
  ON public.doctors FOR UPDATE
  TO authenticated
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  WITH CHECK (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Allow doctors to insert own record during onboarding
CREATE POLICY "Doctors can insert own record"
  ON public.doctors FOR INSERT
  TO authenticated
  WITH CHECK (email = (SELECT email FROM auth.users WHERE id = auth.uid()));
