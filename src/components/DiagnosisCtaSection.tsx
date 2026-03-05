import { FileSearch, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import iraImg from "@/assets/ira-bot.png";

const useTypingEffect = (text: string, speed = 35, startDelay = 600) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const delayTimer = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(delayTimer);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length < text.length) {
      const timer = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), speed);
      return () => clearTimeout(timer);
    } else {
      setDone(true);
    }
  }, [displayed, text, speed, started]);

  return { displayed, done, started };
};

const QUESTION = "Have you consulted a doctor previously and do you have a diagnosis report?";
const SUBTITLE = "Let me help you take the right next step — whether you already have a report or need expert guidance first.";

const DiagnosisCtaSection = () => {
  const navigate = useNavigate();
  const { displayed: typedQuestion, done: questionDone, started } = useTypingEffect(QUESTION, 30, 800);
  const { displayed: typedSubtitle, done: subtitleDone } = useTypingEffect(SUBTITLE, 20, 800 + QUESTION.length * 30 + 300);

  return (
    <section className="py-16 lg:py-24 bg-secondary relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          {/* IRa Bot with floating animation */}
          <motion.div
            className="lg:col-span-2 flex justify-center"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="relative"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl" />
              <img
                src={iraImg}
                alt="IRa Health Companion"
                className="relative max-h-[340px] object-contain drop-shadow-xl"
              />
            </motion.div>
          </motion.div>

          {/* Speech bubble + CTA */}
          <motion.div
            className="lg:col-span-3 space-y-6"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="relative bg-card-gradient border border-border rounded-2xl p-6 md:p-8 shadow-lg">
              <div className="hidden lg:block absolute left-0 top-10 -translate-x-full">
                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[16px] border-r-border" />
              </div>
              <div className="hidden lg:block absolute left-0 top-10 -translate-x-[calc(100%-1px)]">
                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[16px] border-r-background" />
              </div>

              <p className="text-sm font-semibold text-primary mb-2 tracking-wide uppercase">
                IRa asks you…
              </p>

              <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-snug min-h-[2.4em]">
                {started ? (
                  <>
                    {typedQuestion}
                    {!questionDone && (
                      <motion.span
                        className="inline-block w-[3px] h-[1em] bg-primary ml-1 align-middle rounded-full"
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                      />
                    )}
                  </>
                ) : (
                  /* Typing dots indicator before text starts */
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-2.5 h-2.5 bg-primary/60 rounded-full"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </span>
                )}
              </h2>

              <p className="text-muted-foreground mt-3 text-base min-h-[1.5em]">
                {questionDone && (
                  <>
                    {typedSubtitle}
                    {!subtitleDone && (
                      <motion.span
                        className="inline-block w-[2px] h-[0.9em] bg-muted-foreground ml-0.5 align-middle rounded-full"
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                      />
                    )}
                  </>
                )}
              </p>
            </div>

            {/* CTA Buttons — fade in after typing completes */}
            <AnimatePresence>
              {subtitleDone && (
                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DiagnosisCtaSection;
