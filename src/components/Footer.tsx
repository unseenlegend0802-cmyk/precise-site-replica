import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import isvirImg from "@/assets/isvir-member.jpg";

const treatments = [
  "Enlarged Prostate", "Knee Pain", "Thyroid Nodule", "Varicocele",
  "Fallopian Tube Block", "Uterine Fibroids", "Varicose Veins",
];

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">
              <span className="text-primary">M</span>EDAGG
            </h3>
            <p className="text-sm text-muted-foreground">
              Non-surgical healthcare solutions through Interventional Radiology. No Surgery. No Scars. Just Results.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Youtube, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <img src={isvirImg} alt="Member of ISVIR" className="h-16 rounded-md" />
          </div>

          {/* Treatments */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Treatments</h4>
            <ul className="space-y-2">
              {treatments.map((t) => (
                <li key={t}>
                  <a href="#treatments" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["About Us", "Blogs", "Contact Us", "Partner With Us", "Become an Investor"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Contact Us</h4>
            <div className="space-y-3">
              <a href="tel:+919363656010" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                <Phone className="w-4 h-4 shrink-0" /> +91 93636 56010
              </a>
              <a href="mailto:info@medagghealthcare.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                <Mail className="w-4 h-4 shrink-0" /> info@medagghealthcare.com
              </a>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" /> Chennai, Tamil Nadu, India
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © 2025 Medagg Healthcare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
