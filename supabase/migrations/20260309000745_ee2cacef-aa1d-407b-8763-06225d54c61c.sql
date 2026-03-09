-- Fix accept_doctor_invite to avoid querying auth.users (can cause permission denied)
CREATE OR REPLACE FUNCTION public.accept_doctor_invite(_invite_token uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _invite record;
  _email text;
BEGIN
  _email := lower(coalesce(auth.jwt() ->> 'email', ''));

  -- Find pending invite matching token and caller's email (from JWT)
  SELECT * INTO _invite
  FROM public.doctor_invites
  WHERE invite_token = _invite_token
    AND status = 'pending'
    AND lower(doctor_email) = _email;

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