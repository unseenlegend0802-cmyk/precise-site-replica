-- Make accept_doctor_invite idempotent: allow already-accepted invites to still upgrade role
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

  -- Match invite by token + caller email; allow pending OR accepted so the operation is retry-safe
  SELECT * INTO _invite
  FROM public.doctor_invites
  WHERE invite_token = _invite_token
    AND status IN ('pending', 'accepted')
    AND lower(doctor_email) = _email;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Upgrade role to doctor
  UPDATE public.user_roles
  SET role = 'doctor'
  WHERE user_id = auth.uid();

  IF NOT FOUND THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (auth.uid(), 'doctor');
  END IF;

  -- If invite still pending, mark accepted (retry-safe)
  UPDATE public.doctor_invites
  SET status = 'accepted'
  WHERE invite_token = _invite_token
    AND status = 'pending';

  RETURN true;
END;
$$;