import { useState } from "react";
import { Phone, Menu, X, User, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "About", to: "/about" },
  { label: "Scan Report", to: "/scan-report" },
  { label: "Blogs", to: "/blogs" },
  { label: "Contact Us", to: "/contact" },
];

const ctaLinks = [
  { label: "Partner With Us", to: "/contact" },
  { label: "Become an Investor", to: "/contact" },
  { label: "Book Appointment", to: "/contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 relative bg-background/95 shadow-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-foreground">
            <span className="text-primary">M</span>EDAGG
          </span>
          <span className="text-xs text-muted-foreground hidden sm:block">HEALTHCARE</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`text-sm font-medium transition-colors ${
                location.pathname === link.to ? "text-primary" : "text-foreground hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Phone & CTAs */}
        <div className="hidden lg:flex items-center gap-3 flex-nowrap">
          <a href="tel:+919363656010" className="flex items-center gap-2 text-sm text-foreground">
            <Phone className="w-4 h-4 text-primary" />
            +91 93636 56010
          </a>
          {ctaLinks.map((link, i) => (
            <Link
              key={link.label}
              to={link.to}
              className={`text-xs px-3 py-2 rounded-md border transition-colors font-medium ${
                i === 2
                  ? "bg-primary text-primary-foreground border-primary hover:scale-105 hover:shadow-md transition-all" 
                  : "border-muted-foreground/30 text-foreground hover:border-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to={user ? "/dashboard" : "/auth"}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-md border border-muted-foreground/30 text-foreground hover:border-primary transition-colors font-medium"
          >
            <User className="w-3.5 h-3.5" />
            {user ? "Dashboard" : "Sign In"}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-secondary border-t border-border p-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm py-2 ${
                location.pathname === link.to ? "text-primary" : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a href="tel:+919363656010" className="flex items-center gap-2 text-sm text-foreground py-2">
            <Phone className="w-4 h-4 text-primary" />
            +91 93636 56010
          </a>
          <Link
            to="/contact"
            onClick={() => setMobileOpen(false)}
            className="block w-full text-center bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium"
          >
            Book Appointment
          </Link>
          <Link
            to={user ? "/dashboard" : "/auth"}
            onClick={() => setMobileOpen(false)}
            className="block text-sm py-2 text-foreground"
          >
            {user ? "Dashboard" : "Sign In"}
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
