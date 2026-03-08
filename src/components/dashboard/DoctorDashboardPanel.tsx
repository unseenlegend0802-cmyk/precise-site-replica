import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Calendar, Users, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";

const DoctorDashboardPanel = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Stethoscope className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Doctor Panel</h2>
        <Badge className="bg-primary/10 text-primary border-primary/20">Doctor</Badge>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Upcoming Appointments", value: "—", icon: Calendar, color: "text-blue-500" },
          { label: "Total Patients", value: "—", icon: Users, color: "text-green-500" },
          { label: "Procedures Done", value: "—", icon: ClipboardList, color: "text-orange-500" },
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
          <CardTitle className="text-base">Your Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            View and manage your upcoming appointments, patient history, and procedure records.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DoctorDashboardPanel;
