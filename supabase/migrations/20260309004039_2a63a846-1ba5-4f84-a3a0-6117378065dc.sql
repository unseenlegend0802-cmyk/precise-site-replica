
-- Fix the accept_doctor_invite function to look up user_id from auth.users
-- instead of relying on auth.uid() which can be unreliable in some session states
CREATE OR REPLACE FUNCTION public.accept_doctor_invite(_invite_token uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _invite record;
  _caller_email text;
  _caller_uid uuid;
BEGIN
  -- Get email from JWT
  _caller_email := lower(coalesce(auth.jwt() ->> 'email', ''));

  -- Also try auth.uid() as primary, fallback to email lookup
  _caller_uid := auth.uid();

  -- If auth.uid() is null, look up from auth.users by email
  IF _caller_uid IS NULL AND _caller_email != '' THEN
    SELECT id INTO _caller_uid FROM auth.users WHERE lower(email) = _caller_email LIMIT 1;
  END IF;

  IF _caller_uid IS NULL THEN
    RAISE NOTICE 'accept_doctor_invite: no authenticated user found';
    RETURN false;
  END IF;

  -- Match invite by token + caller email; allow pending OR accepted for retry safety
  SELECT * INTO _invite
  FROM public.doctor_invites
  WHERE invite_token = _invite_token
    AND status IN ('pending', 'accepted')
    AND lower(doctor_email) = _caller_email;

  IF NOT FOUND THEN
    RAISE NOTICE 'accept_doctor_invite: invite not found for token=% email=%', _invite_token, _caller_email;
    RETURN false;
  END IF;

  -- Upsert role to doctor using the resolved uid
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_caller_uid, 'doctor')
  ON CONFLICT (user_id)
  DO UPDATE SET role = 'doctor';

  -- Mark invite accepted (retry-safe)
  UPDATE public.doctor_invites
  SET status = 'accepted'
  WHERE invite_token = _invite_token
    AND status = 'pending';

  RETURN true;
END;
$$;
