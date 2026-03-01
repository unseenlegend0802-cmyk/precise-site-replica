import React, { useState, useCallback } from "react";
import { Upload, FileText, AlertTriangle, CheckCircle, XCircle, Loader2, ArrowLeft, Trash2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Link as RouterLink } from "react-router-dom";

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface BiomarkerResult {
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: "normal" | "high" | "low" | "critical";
}

interface ScanResult {
  patientName: string;
  testDate: string;
  labName: string;
  detectedConditions: string[];
  biomarkers: BiomarkerResult[];
  summary: string;
}

const statusConfig = {
  normal: { label: "Normal", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: CheckCircle },
  high: { label: "High", color: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: AlertTriangle },
  low: { label: "Low", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: AlertTriangle },
  critical: { label: "Critical", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: XCircle },
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix to get raw base64
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const ScanReport = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const validateFile = (f: File): string | null => {
    if (!ACCEPTED_TYPES.includes(f.type)) return "Unsupported format. Please upload PDF, JPG, or PNG.";
    if (f.size > MAX_FILE_SIZE) return "File exceeds 10MB limit.";
    return null;
  };

  const handleFile = useCallback((f: File) => {
    setError("");
    setResult(null);
    const err = validateFile(f);
    if (err) {
      setError(err);
      return;
    }
    setFile(f);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleScan = async () => {
    if (!file) return;
    setScanning(true);
    setProgress(0);
    setResult(null);
    setError("");

    try {
      // Step 1: Convert file to base64
      setProgress(15);
      setProgressLabel("Preparing document...");
      const imageBase64 = await fileToBase64(file);

      // Step 2: Send to edge function
      setProgress(35);
      setProgressLabel("Uploading to AI for analysis...");

      const { data, error: fnError } = await supabase.functions.invoke("scan-report", {
        body: { imageBase64, mimeType: file.type },
      });

      if (fnError) {
        throw new Error(fnError.message || "Analysis failed");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setProgress(90);
      setProgressLabel("Rendering results...");
      await new Promise((r) => setTimeout(r, 300));

      setProgress(100);
      setProgressLabel("Complete!");
      await new Promise((r) => setTimeout(r, 200));

      const scanResult = data as ScanResult;
      setResult(scanResult);

      // Save to database if user is logged in
      if (user) {
        try {
          await supabase.from("scan_reports").insert({
            user_id: user.id,
            file_name: file.name,
            file_mime_type: file.type,
            file_size_bytes: file.size,
            analysis_result: scanResult as any,
            summary: scanResult.summary,
            detected_conditions: scanResult.detectedConditions,
          });
        } catch (saveErr) {
          console.error("Failed to save report:", saveErr);
        }
      }
    } catch (e: any) {
      console.error("Scan error:", e);
      const msg = e?.message || "An error occurred during analysis.";
      setError(msg);
      toast({ title: "Scan Failed", description: msg, variant: "destructive" });
    } finally {
      setScanning(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setError("");
    setResult(null);
    setProgress(0);
    setProgressLabel("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/contact" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Contact
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Upload & Scan <span className="text-gradient">Medical Report</span>
            </h1>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              Upload your medical report in PDF, JPG, or PNG format. Our AI will extract biomarker values, flag abnormalities, and suggest relevant treatments.
            </p>
          </motion.div>

          {/* Upload Area */}
          {!result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-8">
                  <div
                    className={`flex flex-col items-center justify-center gap-4 py-8 rounded-lg transition-colors ${dragOver ? "bg-primary/10" : ""}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Upload className="w-7 h-7 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-foreground font-medium mb-1">
                        {file ? file.name : "Drag & drop your report here"}
                      </p>
                      <p className="text-muted-foreground text-sm">PDF, JPG, or PNG — Max 10MB</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                        />
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">
                          <FileText className="w-4 h-4" /> Browse Files
                        </span>
                      </label>

                      {file && (
                        <Button variant="ghost" size="sm" onClick={resetAll}>
                          <Trash2 className="w-4 h-4 mr-1" /> Remove
                        </Button>
                      )}
                    </div>

                    {error && (
                      <p className="text-destructive text-sm flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> {error}
                      </p>
                    )}
                  </div>

                  {file && !scanning && !result && (
                    <div className="mt-6 flex justify-center">
                      <Button size="lg" onClick={handleScan} className="px-8">
                        Scan Report
                      </Button>
                    </div>
                  )}

                  {scanning && (
                    <div className="mt-6 space-y-3 max-w-md mx-auto">
                      <Progress value={progress} className="h-2" />
                      <p className="text-sm text-muted-foreground text-center flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> {progressLabel}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Results */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" /> AI Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{result.summary}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {result.detectedConditions.map((c) => (
                        <Badge key={c} variant="outline" className="border-primary/40 text-primary">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Report Date", value: result.testDate },
                    { label: "Lab", value: result.labName },
                    { label: "Biomarkers Analyzed", value: `${result.biomarkers.length}` },
                  ].map((m) => (
                    <Card key={m.label}>
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground">{m.label}</p>
                        <p className="text-foreground font-semibold mt-1">{m.value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Biomarker Results</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left p-4 text-muted-foreground font-medium">Test</th>
                            <th className="text-left p-4 text-muted-foreground font-medium">Value</th>
                            <th className="text-left p-4 text-muted-foreground font-medium">Reference</th>
                            <th className="text-left p-4 text-muted-foreground font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.biomarkers.map((b, i) => {
                            const cfg = statusConfig[b.status];
                            const Icon = cfg.icon;
                            return (
                              <motion.tr
                                key={b.testName}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors"
                              >
                                <td className="p-4 font-medium text-foreground">{b.testName}</td>
                                <td className="p-4 text-foreground">
                                  {b.value} <span className="text-muted-foreground">{b.unit}</span>
                                </td>
                                <td className="p-4 text-muted-foreground">{b.referenceRange} {b.unit}</td>
                                <td className="p-4">
                                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>
                                    <Icon className="w-3 h-3" /> {cfg.label}
                                  </span>
                                </td>
                              </motion.tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {!user && (
                  <Card className="border-primary/30 bg-primary/5">
                    <CardContent className="p-4 flex items-center gap-3">
                      <LogIn className="w-5 h-5 text-primary shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Sign in to save this report</p>
                        <p className="text-xs text-muted-foreground">Create an account to keep your scan history and medical profile.</p>
                      </div>
                      <Button asChild size="sm">
                        <RouterLink to="/auth">Sign In</RouterLink>
                      </Button>
                    </CardContent>
                  </Card>
                )}

                <div className="flex flex-wrap gap-3">
                  <Button onClick={resetAll} variant="outline">
                    Scan Another Report
                  </Button>
                  <Button asChild>
                    <Link to="/find-hospital">Find a Hospital</Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ScanReport;
