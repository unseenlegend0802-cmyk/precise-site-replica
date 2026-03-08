
-- Fix user_roles: make SELECT permissive so users can read their role
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
CREATE POLICY "Users can read own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Make admin ALL policy permissive
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create a secure function to upgrade user to doctor (checks invite exists)
CREATE OR REPLACE FUNCTION public.accept_doctor_invite(_invite_token uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _invite record;
BEGIN
  -- Find pending invite matching token and caller's email
  SELECT * INTO _invite
  FROM public.doctor_invites
  WHERE invite_token = _invite_token
    AND status = 'pending'
    AND doctor_email = (SELECT email FROM auth.users WHERE id = auth.uid());

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Upgrade role to doctor
  UPDATE public.user_roles
  SET role = 'doctor'
  WHERE user_id = auth.uid();

  -- If no row was updated (user has no role row yet), insert one
  IF NOT FOUND THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (auth.uid(), 'doctor');
  END IF;

  RETURN true;
END;
$$;
