import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, Activity, Settings, Shield } from "lucide-react";
import { motion } from "framer-motion";

const AdminDashboardPanel = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Admin Panel</h2>
        <Badge className="bg-primary/10 text-primary border-primary/20">Admin</Badge>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: "—", icon: Users, color: "text-blue-500" },
          { label: "Appointments", value: "—", icon: Activity, color: "text-green-500" },
          { label: "Scan Reports", value: "—", icon: FileText, color: "text-orange-500" },
          { label: "Doctors", value: "—", icon: Settings, color: "text-purple-500" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color} opacity-70`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Admin Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Manage users, roles, appointments, and system settings from the backend.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminDashboardPanel;
