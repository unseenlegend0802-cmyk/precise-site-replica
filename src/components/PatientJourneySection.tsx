import journeyImg from "@/assets/patient-journey.png";

const PatientJourneySection = () => {
  return (
    <section className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Patient Journey</h2>
        <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
          Every patient's journey is unique — and so is our care. From the first consultation to recovery, we guide you with compassion, clarity, and expert support at every step.
        </p>
        <img
          src={journeyImg}
          alt="Patient Journey Flowchart"
          className="mx-auto max-w-4xl w-full rounded-xl"
        />
      </div>
    </section>
  );
};

export default PatientJourneySection;
