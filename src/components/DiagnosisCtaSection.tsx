import { FileSearch, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import iraImg from "@/assets/ira-bot.png";

const DiagnosisCtaSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 lg:py-24 bg-secondary relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          {/* IRa Bot Image with speech bubble effect */}
          <motion.div
            className="lg:col-span-2 flex justify-center"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl" />
              <img
                src={iraImg}
                alt="IRa Health Companion"
                className="relative max-h-[340px] object-contain drop-shadow-xl"
              />
            </div>
          </motion.div>

          {/* Speech bubble + CTA area */}
          <motion.div
            className="lg:col-span-3 space-y-6"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {/* Speech bubble */}
            <div className="relative bg-card-gradient border border-border rounded-2xl p-6 md:p-8 shadow-lg">
              {/* Triangle pointer towards IRa */}
              <div className="hidden lg:block absolute left-0 top-10 -translate-x-full">
                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[16px] border-r-border" />
              </div>
              <div className="hidden lg:block absolute left-0 top-10 -translate-x-[calc(100%-1px)]">
                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[16px] border-r-background" />
              </div>

              <p className="text-sm font-semibold text-primary mb-2 tracking-wide uppercase">
                IRa asks you…
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-snug">
                Have you consulted a doctor previously and do you have a diagnosis report?
              </h2>
              <p className="text-muted-foreground mt-3 text-base">
                Let me help you take the right next step — whether you already have a report or need expert guidance first.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={() => navigate("/scan-report")}
                className="flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-medium text-base shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <FileSearch className="w-5 h-5" />
                Yes, I have a Diagnosis Report
              </motion.button>
              <motion.button
                onClick={() => navigate("/contact")}
                className="flex items-center justify-center gap-3 bg-card-gradient border border-border text-foreground px-8 py-4 rounded-xl font-medium text-base hover:border-primary transition-colors"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageCircle className="w-5 h-5" />
                No, I need Expert Guidance
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DiagnosisCtaSection;
