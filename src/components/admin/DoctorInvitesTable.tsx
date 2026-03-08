import React from "react";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { format } from "date-fns";

interface Invite {
  id: string;
  doctor_name: string;
  doctor_email: string;
  status: string;
  created_at: string;
}

interface DoctorInvitesTableProps {
  invites: Invite[];
}

const DoctorInvitesTable: React.FC<DoctorInvitesTableProps> = ({ invites }) => {
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DoctorInvitesTable;
