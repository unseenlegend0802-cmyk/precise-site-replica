import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { BookingProvider } from "@/contexts/BookingContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import TreatmentDetail from "./pages/TreatmentDetail";
import ScanReport from "./pages/ScanReport";
import FindHospital from "./pages/FindHospital";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import BookAppointment from "./pages/BookAppointment";
import DoctorProfile from "./pages/DoctorProfile";
import BlogPost from "./pages/BlogPost";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BookingProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/treatment/:slug" element={<TreatmentDetail />} />
              <Route path="/scan-report" element={<ScanReport />} />
              <Route path="/find-hospital" element={<FindHospital />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/book-appointment" element={<BookAppointment />} />
              <Route path="/doctor/:slug" element={<DoctorProfile />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </BookingProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
