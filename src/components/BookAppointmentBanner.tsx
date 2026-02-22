import happyImg from "@/assets/happy-patients.png";

const BookAppointmentBanner = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="bg-pink-gradient rounded-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 items-center">
            <div className="p-8 lg:p-12 space-y-4">
              <p className="text-primary-foreground/80 text-sm">
                Are you looking to get a Consultation for your healthcare needs?
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
                Book Your Appointment with Experts Near You
              </h2>
              <a
                href="#contact"
                className="inline-block bg-background text-foreground px-8 py-3 rounded-md font-medium hover:opacity-90 transition-opacity mt-4"
              >
                Book Appointment
              </a>
            </div>
            <div className="flex justify-center lg:justify-end">
              <img src={happyImg} alt="Doctor with patient" className="max-h-[300px] object-contain" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookAppointmentBanner;
