import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";

const Unauthorized = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="pt-28 pb-20 px-4 flex justify-center">
      <div className="text-center max-w-md">
        <ShieldX className="w-16 h-16 text-destructive mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-foreground mb-3">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You don't have permission to access this page. Contact an administrator if you believe this is an error.
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild><Link to="/dashboard">Go to Dashboard</Link></Button>
          <Button variant="outline" asChild><Link to="/">Go Home</Link></Button>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Unauthorized;
