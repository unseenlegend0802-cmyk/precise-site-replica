import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "Will the Medagg Healthcare assist for ambulance service?", a: "Yes, we can help coordinate ambulance services if needed. However, Medagg is not an emergency care provider — we are an elective treatment platform focused on planned, non-emergency medical and interventional procedures." },
  { q: "Do you offer weekend and evening Appointments?", a: "Yes, we offer flexible appointment scheduling including weekends and evenings, subject to doctor availability." },
  { q: "How Medagg helps hospitals?", a: "Medagg partners with hospitals to connect them with patients seeking non-surgical, interventional radiology treatments, expanding their reach and patient base." },
  { q: "Will Medagg arrange for post treatment care?", a: "Yes. Medagg coordinates complete post-treatment care, including follow-ups, recovery guidance, and support services — ensuring your recovery is smooth and continuous." },
  { q: "Do you have teleconsultation services?", a: "Yes. We organize teleconsultations through our Care Custodians, connecting you with the hospitals and specialists of your choice — so you can access expert care from anywhere." },
  { q: "How do I find the Best Hospital?", a: "Our Care Custodians will assess your treatment needs and present suitable hospital options along with estimated costs — helping you make an informed and confident decision." },
  { q: "What information is required to register on Medagg Healthcare?", a: "To register, please provide your full name, date of birth, mobile number, and email ID. You can begin by clicking on the 'Book Appointment' tab at the top of our website." },
  { q: "Why do I need Care Custodians?", a: "Just like we rely on expert advisors for finance, education, or major life decisions — you deserve trusted guidance for your health too. Medagg's Care Custodians are experienced healthcare professionals who act as your personal care navigators." },
];

const FAQSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Got Questions? Find Quick Answers About Our Treatments And Patient Support.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-card-gradient rounded-xl border border-border px-6 data-[state=open]:border-primary/50"
            >
              <AccordionTrigger className="text-sm font-medium text-foreground hover:text-primary py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
