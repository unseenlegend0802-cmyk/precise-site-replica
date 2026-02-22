import iraImg from "@/assets/ira-bot.png";

const IraBotSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <img src={iraImg} alt="IRa Health Companion" className="max-h-[400px] object-contain" />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Meet IRa: Your Medagg Health Companion
            </h2>
            <p className="text-muted-foreground text-lg">
              From instant answers, booking appointments, or finding the right treatment, IRa is here to simplify your healthcare journey — anytime, anywhere.
            </p>
            <a
              href="#contact"
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-md font-medium hover:opacity-90 transition-opacity"
            >
              Book Appointment
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IraBotSection;
