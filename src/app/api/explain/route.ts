import { AiTextAnalysis } from "@/lib/AI";
import { extractTextFromPDF } from "@/lib/pdfParser";
import { NextRequest, NextResponse } from "next/server";
import { RateLimiterMemory } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterMemory({
  points: 1, // 1 request
  duration: 10, // per 10 seconds
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  try {
    // Apply rate limit
    await rateLimiter.consume(ip);
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        error:
          "Too many requests. Please wait 10 seconds before uploading again.",
      },
      { status: 429 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const data = await extractTextFromPDF(file);
  const explanation = await AiTextAnalysis(data);
  const { success, ...response } = explanation;
  if (!success) {
    return NextResponse.json(
      { error: response.error || "Document is not a valid insurance document" },
      { status: 400 }
    );
  }

  return NextResponse.json(response);
}
