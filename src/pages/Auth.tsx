import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useBooking } from "@/contexts/BookingContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import UserLoginTab from "@/components/auth/UserLoginTab";
import AdminLoginTab from "@/components/auth/AdminLoginTab";

const Auth = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const { hasPendingBooking } = useBooking();

  useEffect(() => {
    if (user) {
      if (hasPendingBooking) {
        navigate("/book-appointment", { replace: true });
      } else if (role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else if (role === "doctor") {
        navigate("/doctor-dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [user, role, navigate, hasPendingBooking]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-20 px-4 flex justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome</CardTitle>
              <CardDescription>Sign in to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="user" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="user">User Login</TabsTrigger>
                  <TabsTrigger value="admin">Admin Login</TabsTrigger>
                </TabsList>

                <TabsContent value="user">
                  <UserLoginTab />
                </TabsContent>

                <TabsContent value="admin">
                  <AdminLoginTab />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
