import { useState } from "react";

const languages = ["English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Bengali", "Marathi", "Gujarati", "Punjabi", "Urdu"];

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", language: "English", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you! Our Care Custodian will call you shortly.");
  };

  return (
    <section id="contact" className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Info */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Consult With Our Experts
            </h2>
            <p className="text-muted-foreground text-lg">
              Get Expert Guidance And Clarity On The Best Non-Surgical Treatments Tailored To You.
            </p>
            <div className="space-y-4">
              {[
                "Our Care Custodian Will Call You Once You Share Your Details",
                "The Care Custodian Will Understand Your Problem In Detail",
                "The Right Solution To Your Query Will Be Addressed With Suitable Options",
                "Consultation Will Be Fixed On Your Behalf",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 shrink-0 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {i + 1}
                  </div>
                  <p className="text-sm text-muted-foreground pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Form */}
          <form onSubmit={handleSubmit} className="bg-card-gradient rounded-xl border border-border p-6 space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-muted border border-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-muted border border-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-muted border border-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
            />
            <select
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value })}
              className="w-full bg-muted border border-border rounded-md px-4 py-3 text-sm text-foreground outline-none focus:border-primary transition-colors"
            >
              {languages.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <textarea
              placeholder="Describe your health concern..."
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full bg-muted border border-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors resize-none"
            />
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium hover:opacity-90 transition-opacity"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
