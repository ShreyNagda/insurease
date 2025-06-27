import pdfParse from "pdf-parse";

export async function extractTextFromPDF(file: File): Promise<string> {
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const result = await pdfParse(fileBuffer);
  return result.text;
}
