import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface Invite {
  id: string;
  doctor_name: string;
  doctor_email: string;
  status: string;
  created_at: string;
}

interface DoctorInvitesTableProps {
  invites: Invite[];
  onInviteResent?: () => void;
}

const DoctorInvitesTable: React.FC<DoctorInvitesTableProps> = ({ invites, onInviteResent }) => {
  const [resendingId, setResendingId] = useState<string | null>(null);

  const handleResend = async (invite: Invite) => {
    setResendingId(invite.id);
    try {
      // Delete the old invite so the edge function can create a fresh one
      await supabase.from("doctor_invites").delete().eq("id", invite.id);

      const { data, error } = await supabase.functions.invoke("send-doctor-invite", {
        body: { doctorName: invite.doctor_name, doctorEmail: invite.doctor_email },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({ title: "Invitation Resent", description: `A new invitation has been sent to ${invite.doctor_email}.` });
      onInviteResent?.();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to resend invitation.", variant: "destructive" });
    } finally {
      setResendingId(null);
    }
  };

  if (invites.length === 0) return null;

  return (
    <Card className="border-border mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Mail className="w-5 h-5 text-primary" /> Invited Doctors
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Invited On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invites.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-medium">{inv.doctor_name}</TableCell>
                <TableCell className="text-muted-foreground">{inv.doctor_email}</TableCell>
                <TableCell>
                  <Badge variant={inv.status === "accepted" ? "default" : "outline"} className={inv.status === "pending" ? "border-yellow-500 text-yellow-600" : ""}>
                    {inv.status === "pending" ? "Pending" : "Accepted"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {format(new Date(inv.created_at), "dd MMM yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  {inv.status === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      disabled={resendingId === inv.id}
                      onClick={() => handleResend(inv)}
                    >
                      {resendingId === inv.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <RefreshCw className="w-3.5 h-3.5" />
                      )}
                      {resendingId === inv.id ? "Sending..." : "Resend"}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DoctorInvitesTable;
