import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { BookingProvider } from "@/contexts/BookingContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import About from "./pages/About";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import TreatmentDetail from "./pages/TreatmentDetail";
import ScanReport from "./pages/ScanReport";
import FindHospital from "./pages/FindHospital";
import Auth from "./pages/Auth";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ResetPassword from "./pages/ResetPassword";
import BookAppointment from "./pages/BookAppointment";
import DoctorProfile from "./pages/DoctorProfile";
import BlogPost from "./pages/BlogPost";
import Unauthorized from "./pages/Unauthorized";
import AddDoctor from "./pages/AddDoctor";
import DoctorRegister from "./pages/DoctorRegister";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorInviteRedirect from "./components/DoctorInviteRedirect";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BookingProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <DoctorInviteRedirect />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/treatment/:slug" element={<TreatmentDetail />} />
              <Route path="/scan-report" element={<ScanReport />} />
              <Route path="/find-hospital" element={<FindHospital />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/doctor/:slug" element={<DoctorProfile />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/doctor-register" element={<DoctorRegister />} />
              <Route path="/doctor-login" element={<DoctorLogin />} />

              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <PatientDashboard />
                </ProtectedRoute>
              } />
              <Route path="/doctor-dashboard" element={
                <ProtectedRoute allowedRoles={["doctor", "admin"]}>
                  <DoctorDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin-dashboard" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/add-doctor" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AddDoctor />
                </ProtectedRoute>
              } />
              <Route path="/book-appointment" element={
                <ProtectedRoute>
                  <BookAppointment />
                </ProtectedRoute>
              } />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </BookingProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
