import { AiQuestionAnswer } from "@/lib/AI";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { question, policyContext } = body;
  const res = await AiQuestionAnswer(question, policyContext);
  return NextResponse.json(res);
}
