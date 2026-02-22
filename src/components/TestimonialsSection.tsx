import { Star } from "lucide-react";

const testimonials = [
  { name: "Suresh Suresh prabha", city: "Salem", text: "Hi I am suresh from old perungalathur. I have Varicose veins problem. Medagg health care took care very well and suggested nearby hospitals. Their service is very good and trustable.", initial: "S" },
  { name: "Abhina P Das", city: "Chennai", text: "Good platform with best service.", initial: "A" },
  { name: "Ramesh Sankaranarayanan", city: "Thanjavur", text: "I'm feeling excited to share my feedback about Medagg health care team. Really their support and coordination is professional & delightful.", initial: "R" },
  { name: "Kokila Yogesh Babu", city: "Chennai", text: "User friendly app to choose the appropriate hospital sitting at home. It was very much useful for treating my fibroid problem.", initial: "K" },
  { name: "C R Prakash", city: "Chennai", text: "Real professionals in offering advice about specialised doctors and hospitals. Appreciate their commitment to follow up even after advice.", initial: "C" },
  { name: "Durairaj", city: "Chennai", text: "Mark McLeod who is working with Medagg service is very excellent. He coordinated right from fixing doctor, hospital as per our convenience. His company motto is very much service oriented.", initial: "D" },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            What Our Patients Say
          </h2>
          <p className="text-muted-foreground text-lg">
            Real stories from real patients — see how Medagg's care made a real difference.
          </p>
        </div>

        {/* Scrolling container */}
        <div className="flex gap-6 animate-scroll-left" style={{ width: "max-content" }}>
          {[...testimonials, ...testimonials].map((t, i) => (
            <div
              key={i}
              className="w-[350px] shrink-0 bg-card-gradient rounded-xl border border-border p-6 space-y-4"
            >
              <div className="flex items-center gap-1 text-primary">
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">Google Review</span>
                <div className="flex ml-auto">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3 h-3 fill-primary text-primary" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-4">{t.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {t.initial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
