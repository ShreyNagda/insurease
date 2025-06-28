"use client";

import { MessageCircle, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useState } from "react";
import { PolicySection } from "@/lib/types";
import { Badge } from "./ui/badge";

export default function AskQuestion({
  result,
}: {
  result: { sections: PolicySection[] };
}) {
  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [qaPairs, setQaPairs] = useState<
    Array<{ question: string; answer: string }>
  >([]);
  const [error, setError] = useState<string | null>(null);

  const askQuestion = async () => {
    if (!question.trim() || !result) return;

    setIsAsking(true);
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
          policyContext: result.sections
            .map((s) => `${s.title}: ${s.explanation} (${s.originalText})`)
            .join("\n\n"),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get answer");
      }

      const data = await response.json();
      setQaPairs((prev) => [
        { question: question.trim(), answer: data },
        ...prev,
      ]);
      setQuestion("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to get answer to your question"
      );
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Ask Questions About Your Policy
        </CardTitle>
        <CardDescription>
          Get instant answers to specific questions about your insurance
          coverage
        </CardDescription>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-2">
          <p className="text-xs text-yellow-800">
            <strong>Legal Notice:</strong> Answers provided are AI-generated
            educational content and should not be considered as official policy
            interpretations or legal advice. Always verify with your insurance
            provider.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g., What happens if I file a claim for water damage?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askQuestion()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isAsking}
          />
          <Button onClick={askQuestion} disabled={isAsking || !question.trim()}>
            {isAsking ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Asking...
              </>
            ) : (
              "Ask"
            )}
          </Button>
        </div>
        {error && <div className="text-red-400">{error}</div>}

        {qaPairs.length > 0 && (
          <div className="space-y-4 mt-6">
            <h4 className="font-semibold text-gray-900">
              Your Questions & Answers:
            </h4>
            {qaPairs.map((qa, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="mb-3">
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-1">
                      Q
                    </Badge>
                    <p className="font-medium text-gray-900">{qa.question}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="default" className="mt-1">
                    A
                  </Badge>
                  <p className="text-gray-700 leading-relaxed">{qa.answer}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
