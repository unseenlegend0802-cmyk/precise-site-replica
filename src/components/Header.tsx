import { useState } from "react";
import { Phone, Menu, X } from "lucide-react";

const navLinks = ["About", "Blogs", "Contact Us"];
const ctaLinks = ["Partner With Us", "Become an Investor", "Book Appointment"];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-foreground">
            <span className="text-primary">M</span>EDAGG
          </span>
          <span className="text-xs text-muted-foreground hidden sm:block">HEALTHCARE</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a key={link} href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              {link}
            </a>
          ))}
        </nav>

        {/* Phone & CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          <a href="tel:+919363656010" className="flex items-center gap-2 text-sm text-foreground">
            <Phone className="w-4 h-4 text-primary" />
            +91 93636 56010
          </a>
          {ctaLinks.map((link, i) => (
            <a
              key={link}
              href="#contact"
              className={`text-xs px-3 py-2 rounded-md border transition-colors font-medium ${
                i === 2
                  ? "bg-primary text-primary-foreground border-primary hover:opacity-90"
                  : "border-muted-foreground/30 text-foreground hover:border-primary"
              }`}
            >
              {link}
            </a>
          ))}
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
            <a key={link} href="#" className="block text-sm text-foreground py-2">
              {link}
            </a>
          ))}
          <a href="tel:+919363656010" className="flex items-center gap-2 text-sm text-foreground py-2">
            <Phone className="w-4 h-4 text-primary" />
            +91 93636 56010
          </a>
          <a href="#contact" className="block w-full text-center bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium">
            Book Appointment
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
