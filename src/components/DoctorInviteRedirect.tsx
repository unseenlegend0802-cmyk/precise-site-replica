import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

/**
 * Global component that checks if a newly-logged-in user has a pending
 * doctor invite and redirects them to the registration page.
 */
const DoctorInviteRedirect = () => {
  const { user, roleLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const checkedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user || roleLoading) return;
    // Don't check if already on doctor-register
    if (location.pathname === "/doctor-register") return;
    // Only check once per user session
    if (checkedRef.current === user.id) return;
    checkedRef.current = user.id;

    const checkInvite = async () => {
      const { data: invite } = await supabase
        .from("doctor_invites")
        .select("invite_token")
        .eq("doctor_email", user.email ?? "")
        .eq("status", "pending")
        .maybeSingle();

      if (invite) {
        navigate(`/doctor-register?token=${invite.invite_token}`, { replace: true });
      }
    };

    checkInvite();
  }, [user, roleLoading, location.pathname, navigate]);

  return null;
};

export default DoctorInviteRedirect;
