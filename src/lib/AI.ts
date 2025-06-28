import { InferenceClient } from "@huggingface/inference";

const HF_API_TOKEN = process.env.HF_API_TOKEN!;
const client = new InferenceClient(HF_API_TOKEN);

export async function AiTextAnalysis(text: string) {
  if (!HF_API_TOKEN) {
    return {
      success: false,
      error: "HF token not provided! Contact Developer",
    };
  }
  const keywords = [
    "insurance",
    "policy",
    "premium",
    "coverage",
    "deductible",
    "underwriting",
    "insured",
    "insurer",
    "beneficiary",
    "plan",
    "claim",
    "file",
    "settlement",
    "reimbursement",
    "adjuster",
    "incident",
    "loss",
    "damage",
    "report",
    "submit",
    "included",
    "excluded",
    "limit",
    "benefits",
    "protection",
    "liability",
    "co-pay",
    "out-of-pocket",
    "expenses",
  ];
  let matchCount = 0;
  for (const keyword of keywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, "i");
    if (regex.test(text)) {
      matchCount++;
      if (matchCount >= 2) break; // short-circuit if 2 matches found
    }
  }

  if (matchCount < 2) {
    return {
      success: false,
      error:
        "This does not appear to be a valid insurance policy document. Please upload a valid policy document",
    };
  }

  const prompt = `
You are an AI assistant helping someone understand their insurance policy.
Check if the document provided is actually an insurance policy document. 
If it's NOT an insurance policy document, return exactly this JSON:

{
  "error": "This does not appear to be a valid insurance policy document. Please upload a valid policy document"
}
 
Your tasks:
1. Read through the entire policy document.
2. Verify if the document contains the valid insurance policy terms or words
3. Identify the major sections (e.g., Coverage, Premiums, Exclusions, Claims Process, Cancellation, Benefits, Eligibility, etc.).
4. For each section:
   - Provide a plain English explanation in 200-250 words. Do not include "this explains that" 
   - Write in a friendly, helpful tone that makes legal or technical terms easier to understand for someone in India who may not be familiar with insurance jargon.
   - No important part should be skipped or no meaning should change
Also, extract a short document title that summarizes the policy (e.g., "ICICI Life Shield Plan").

⚠️ Format:
Return your answer as pure JSON, exactly like this:

{
  "documentTitle": "string",
  "sections": [
    {
      "title": "string",
      "originalText": "string",
      "explanation": "string"
    }
    // repeat for each section
  ],
  flag: "string"
}

- mention any misleading text or hidden fees or charges that may not be right in the pretext of legal lagnuage as the "flag" in the json data

Rules:
- Do not include any explanations, markdown, or commentary outside the JSON.
- Do not wrap the JSON in code blocks.
- Return only valid JSON. No preamble, no "Here is the JSON".
- Make sure it's under 2048 tokens total.

Now, here is the raw insurance policy text:

"""
${text}
"""
`;
  try {
    const out = await client.chatCompletion({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [{ role: "user", content: prompt }],
    });

    const content = out.choices[0].message.content;
    const parsed = JSON.parse(content || "");

    // Ensure it strictly matches the shape
    if (parsed && typeof parsed === "object") {
      if (parsed.error) {
        return {
          success: false,
          error:
            "This does not appear to be a valid insurance policy document. Please upload a valid policy document",
        };
      }
      const { documentTitle, sections, flag } = parsed;
      return { success: true, documentTitle, sections, flag };
    } else {
      return { success: false, error: "Invalid JSON response from model." };
    }
  } catch (err) {
    console.error("AI error:", err);
    return {
      success: false,
      error: err || "AI model failed to process the document.",
    };
  }
}

export async function AiQuestionAnswer(question: string, context: string) {
  if (!HF_API_TOKEN) {
    return {
      success: false,
      error: "HF token not provided! Contact Developer",
    };
  }

  const prompt = `${context}
  With this data as context asnwer the following question in in a friendly, helpful tone that makes legal or technical terms easier to understand for someone in India who may not be familiar with insurance jargon.
  Also keep the answer precise and under 200 words
  ${question}`;

  const response = await client.chatCompletion({
    model: "meta-llama/Llama-3.1-8B-Instruct",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  return response.choices[0].message.content;
}
