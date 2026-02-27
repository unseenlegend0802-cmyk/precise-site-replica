import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SYSTEM_PROMPT = `You are a medical report analysis AI. You will receive an image of a medical report (blood test, lab report, scan report, etc.).

Your task:
1. Extract all biomarker/test results from the report image using OCR.
2. For each test, extract: test name, value, unit, reference range.
3. Determine the status of each value: "normal" (within range), "high" (above range), "low" (below range), or "critical" (significantly outside range, e.g. >2x deviation).
4. Extract patient name (or "Patient Report" if not found), test date, lab name.
5. Detect any conditions mentioned or implied, especially: Varicocele, Varicose Veins, Thyroid Nodule, Prostate Enlargement, Fallopian Tubal Block, Uterine Fibroids, Breast Nodule.
6. Generate a brief medical summary of key findings with simplified explanations.

You MUST respond using the suggest_scan_results tool.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64 || !mimeType) {
      return new Response(JSON.stringify({ error: "Missing imageBase64 or mimeType" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${imageBase64}`,
                },
              },
              {
                type: "text",
                text: "Please analyze this medical report image. Extract all biomarkers, flag abnormalities, detect conditions, and provide a summary.",
              },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "suggest_scan_results",
              description: "Return structured scan results from the medical report.",
              parameters: {
                type: "object",
                properties: {
                  patientName: { type: "string", description: "Patient name or 'Patient Report'" },
                  testDate: { type: "string", description: "Test date in YYYY-MM-DD format" },
                  labName: { type: "string", description: "Lab or diagnostic center name" },
                  detectedConditions: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of detected or suspected medical conditions",
                  },
                  biomarkers: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        testName: { type: "string" },
                        value: { type: "string" },
                        unit: { type: "string" },
                        referenceRange: { type: "string" },
                        status: { type: "string", enum: ["normal", "high", "low", "critical"] },
                      },
                      required: ["testName", "value", "unit", "referenceRange", "status"],
                      additionalProperties: false,
                    },
                  },
                  summary: { type: "string", description: "Brief medical summary of key findings" },
                },
                required: ["patientName", "testDate", "labName", "detectedConditions", "biomarkers", "summary"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "suggest_scan_results" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI analysis failed. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall || toolCall.function.name !== "suggest_scan_results") {
      console.error("Unexpected AI response:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "Could not extract data from the report. Please try a clearer image." }), {
        status: 422,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const scanResult = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(scanResult), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("scan-report error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
