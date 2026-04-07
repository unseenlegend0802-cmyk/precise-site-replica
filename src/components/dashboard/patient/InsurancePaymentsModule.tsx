import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CreditCard, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface InsurancePaymentsModuleProps {
  stage: string;
}

const InsurancePaymentsModule: React.FC<InsurancePaymentsModuleProps> = ({ stage }) => {
  const stagesWithInsurance = ["procedure_recommended", "ip_booked", "ip_completed", "followup_due", "completed"];
  const showInsurance = stagesWithInsurance.includes(stage);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" /> Insurance & Payments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">Insurance Status</span>
          </div>
          {showInsurance ? (
            <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-400">Pending Verification</Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] text-muted-foreground">Not Required Yet</Badge>
          )}
        </div>

        {showInsurance && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Estimated Treatment Cost</span>
                <span className="text-foreground font-medium">₹ 50,000 - ₹ 1,50,000</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Payment Progress</span>
                  <span className="text-foreground">0%</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300">
                Upload your insurance card to verify coverage. Most IR procedures are covered under standard health insurance plans.
              </p>
            </div>
          </>
        )}

        {!showInsurance && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CreditCard className="w-4 h-4" />
            <span>Insurance details will appear once a procedure is recommended.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InsurancePaymentsModule;
