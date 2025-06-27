import { InferenceClient } from "@huggingface/inference";

const HF_API_TOKEN = process.env.HF_API_TOKEN!;
const client = new InferenceClient(HF_API_TOKEN);

export async function aiTextAnalysis(text: string) {
  if (!HF_API_TOKEN || !client) {
    console.log("HF token or client not specified");
  }
  const prompt = `
You are an AI assistant helping someone understand their insurance policy.

Your tasks:
1. Read through the entire policy document.
2. Identify the major sections (e.g., Coverage, Premiums, Exclusions, Claims Process, Cancellation, Benefits, Eligibility, etc.).
3. For each section:
   - Provide a plain English explanation in 200-250 words. Do not include "this explains that" 
   - Write in a friendly, helpful tone that makes legal or technical terms easier to understand for someone in India who may not be familiar with insurance jargon.
   - No important part should be skipped or no meaning should change
   - Any misleading text or part should be mentioned as a note
4. If not a complete section but important can be added in a new section called "note"
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
  ]
}

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

  const out = await client.chatCompletion({
    model: "meta-llama/Llama-3.1-8B-Instruct",
    messages: [{ role: "user", content: prompt }],
  });
  return out.choices[0].message.content;
}

export async function AiQuestionAnswer(question: string, context: string) {
  if (!HF_API_TOKEN) {
    console.log("HF token not specified");
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
