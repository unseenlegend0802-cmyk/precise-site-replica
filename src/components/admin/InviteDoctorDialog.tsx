import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface InviteDoctorDialogProps {
  onInviteSent: () => void;
}

const InviteDoctorDialog: React.FC<InviteDoctorDialogProps> = ({ onInviteSent }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!name.trim() || !email.trim()) {
      toast({ title: "Validation Error", description: "Both name and email are required.", variant: "destructive" });
      return;
    }

    setSending(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("send-doctor-invite", {
        body: { doctorName: name.trim(), doctorEmail: email.trim() },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({ title: "Invitation Sent!", description: `An invitation email has been sent to ${email}.` });
      setName("");
      setEmail("");
      setOpen(false);
      onInviteSent();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to send invitation.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Invite New Doctor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite a Doctor</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="invite-name">Doctor Name</Label>
            <Input id="invite-name" value={name} onChange={e => setName(e.target.value)} placeholder="Dr. John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email Address</Label>
            <Input id="invite-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="doctor@example.com" />
          </div>
          <Button className="w-full gap-2" onClick={handleSend} disabled={sending}>
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {sending ? "Sending..." : "Send Invitation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteDoctorDialog;
