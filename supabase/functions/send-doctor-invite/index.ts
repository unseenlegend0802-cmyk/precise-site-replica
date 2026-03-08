import { createClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify the caller is an admin
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check admin role
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { doctorName, doctorEmail } = await req.json();
    if (!doctorName || !doctorEmail) {
      return new Response(JSON.stringify({ error: "Name and email are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Remove any existing pending invite for this email so we can create a fresh one
    await adminClient.from("doctor_invites").delete().eq("doctor_email", doctorEmail).eq("status", "pending");

    // Create the invite record
    const { data: invite, error: insertError } = await adminClient
      .from("doctor_invites")
      .insert({
        doctor_name: doctorName,
        doctor_email: doctorEmail,
        invited_by: user.id,
      })
      .select("invite_token")
      .single();

    if (insertError) {
      throw insertError;
    }

    const redirectTo = `https://medagg-1.lovable.app/doctor-register?token=${invite.invite_token}`;

    // Try inviting the user (works for new users)
    const { error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(doctorEmail, {
      data: {
        full_name: doctorName,
        invite_token: invite.invite_token,
        role: "doctor",
      },
      redirectTo,
    });

    if (inviteError) {
      // If user already exists, send a magic link email via the OTP endpoint (this actually sends an email)
      if (inviteError.message?.includes("already been registered") || 
          inviteError.message?.includes("already exists") ||
          inviteError.status === 422) {
        
        // Use the OTP endpoint directly - this sends an actual email to the user
        const otpResponse = await fetch(`${supabaseUrl}/auth/v1/otp`, {
          method: "POST",
          headers: {
            "apikey": anonKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: doctorEmail,
            options: {
              emailRedirectTo: redirectTo,
              data: {
                full_name: doctorName,
                invite_token: invite.invite_token,
                role: "doctor",
              },
            },
          }),
        });

        if (!otpResponse.ok) {
          const errBody = await otpResponse.text();
          await adminClient.from("doctor_invites").delete().eq("invite_token", invite.invite_token);
          throw new Error(`Failed to send magic link email: ${errBody}`);
        }
        await otpResponse.text(); // consume body

        return new Response(
          JSON.stringify({ success: true, token: invite.invite_token, resent: true }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Other errors — clean up and throw
      await adminClient.from("doctor_invites").delete().eq("invite_token", invite.invite_token);
      throw inviteError;
    }

    return new Response(
      JSON.stringify({ success: true, token: invite.invite_token }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
