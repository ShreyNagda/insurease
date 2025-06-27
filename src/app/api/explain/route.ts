import { AiTextAnalysis } from "@/lib/AI";
import { extractTextFromPDF } from "@/lib/pdfParser";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const data = await extractTextFromPDF(file);
  const explanation = await AiTextAnalysis(data);
  const { success, ...response } = explanation;
  if (!success) {
    return NextResponse.json({ error: response.error }, { status: 400 });
  }

  return NextResponse.json(response);
}
