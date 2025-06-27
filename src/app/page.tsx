"use client";

import type React from "react";

import { useState } from "react";
import {
  Upload,
  FileText,
  Loader2,
  Download,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PolicySection {
  title: string;
  originalText: string;
  explanation: string;
}

interface ProcessingResult {
  sections: PolicySection[];
}

export default function InsurancePolicyExplainer() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showOriginalText, setShowOriginalText] = useState<
    Record<string, boolean>
  >({});

  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [qaPairs, setQaPairs] = useState<
    Array<{ question: string; answer: string }>
  >([]);

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf") {
      setError("Please select a PDF file");
      return;
    }
    setFile(selectedFile);
    setError(null);
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const processDocument = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/explain", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process document");
      }

      const data = await response.json();
      console.log(JSON.parse(data));
      setResult(JSON.parse(data));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while processing the document"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleOriginalText = (sectionTitle: string) => {
    setShowOriginalText((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  };

  const downloadJSON = () => {
    if (!result) return;

    const dataStr = JSON.stringify(result, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `explanations.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

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
            .map((s) => `${s.title}: ${s.explanation}`)
            .join("\n\n"),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get answer");
      }

      const data = await response.json();
      setQaPairs((prev) => [
        ...prev,
        { question: question.trim(), answer: data.answer },
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-800 to-indigo-600/50 bg-clip-text text-transparent mb-4">
            INSUREASE
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Your AI-Powered Insurance Policy Assistant
          </p>
          <p className="text-lg text-gray-500 mb-4">
            Upload your policy PDF for plain-language explanations and ask
            questions about your insurance
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-sm text-amber-800">
              <strong>Important:</strong> INSUREASE provides educational
              explanations only and does not constitute legal or professional
              insurance advice. Always consult with your insurance agent or
              legal professional for official policy interpretations.
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Insurance Policy
            </CardTitle>
            <CardDescription>
              Drag and drop your PDF file or click to browse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              {file ? (
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Drop your PDF file here, or click to browse
                  </p>
                  <p className="text-xs text-gray-400">
                    Supports PDF files up to 10MB
                  </p>
                </div>
              )}
            </div>
            <input
              id="file-input"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) handleFileSelect(selectedFile);
              }}
            />

            {file && (
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={processDocument}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing Document...
                    </>
                  ) : (
                    "Explain Policy Sections"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFile(null);
                    setResult(null);
                    setError(null);
                  }}
                >
                  Clear
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            {/* Legal Disclaimer */}
            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription className="text-blue-800">
                <strong>Disclaimer:</strong> These explanations are AI-generated
                interpretations for educational purposes only. They do not
                constitute legal advice or official policy interpretations. For
                binding coverage details, please refer to your original policy
                document or contact your insurance provider.
              </AlertDescription>
            </Alert>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Policy Explanations
                </h2>
              </div>
              <Button onClick={downloadJSON} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download JSON
              </Button>
            </div>

            <Accordion type="multiple" className="space-y-4">
              {/* result accordion items */}
              {result.sections.map((section, index) => (
                <AccordionItem
                  key={index}
                  value={`section-${index}`}
                  className="border rounded-lg bg-white shadow-sm"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{section.title}</Badge>
                      {/* <span className="text-left font-medium">
                        {section.title} Explanation
                      </span> */}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-4">
                      {/* Plain Language Explanation */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Explanation:
                        </h4>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-gray-800 leading-relaxed">
                            {section.explanation}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      {/* Original Text Toggle */}
                      <div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleOriginalText(section.title)}
                          className="mb-2"
                        >
                          {showOriginalText[section.title] ? "Hide" : "Show"}{" "}
                          Original Text
                        </Button>

                        {showOriginalText[section.title] && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2">
                              Original Policy Text:
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                              {section.originalText}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        {/* Q&A Section */}
        {result && (
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
                  <strong>Legal Notice:</strong> Answers provided are
                  AI-generated educational content and should not be considered
                  as official policy interpretations or legal advice. Always
                  verify with your insurance provider.
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
                  onKeyPress={(e) => e.key === "Enter" && askQuestion()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isAsking}
                />
                <Button
                  onClick={askQuestion}
                  disabled={isAsking || !question.trim()}
                >
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

              {qaPairs.length > 0 && (
                <div className="space-y-4 mt-6">
                  <h4 className="font-semibold text-gray-900">
                    Your Questions & Answers:
                  </h4>
                  {qaPairs.map((qa, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 bg-gray-50"
                    >
                      <div className="mb-3">
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className="mt-1">
                            Q
                          </Badge>
                          <p className="font-medium text-gray-900">
                            {qa.question}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Badge variant="default" className="mt-1">
                          A
                        </Badge>
                        <p className="text-gray-700 leading-relaxed">
                          {qa.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
        <footer className="mt-16 border-t border-gray-200 pt-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              Legal Disclaimer & Terms of Use
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Not Legal or Professional Advice:</strong> INSUREASE is
                an educational tool that uses artificial intelligence to provide
                simplified explanations of insurance policy language. The
                information provided is for educational purposes only and does
                not constitute legal, financial, or professional insurance
                advice.
              </p>
              <p>
                <strong>No Warranty:</strong> While we strive for accuracy,
                AI-generated explanations may contain errors or omissions. We
                make no warranties about the completeness, accuracy, or
                reliability of the information provided.
              </p>
              <p>
                <strong>Consult Professionals:</strong> For official policy
                interpretations, coverage questions, or legal matters, always
                consult with your licensed insurance agent, broker, or legal
                professional.
              </p>
              <p>
                <strong>Original Policy Governs:</strong> Your actual insurance
                policy document is the authoritative source for coverage terms,
                conditions, and exclusions. In case of any discrepancy, the
                original policy language prevails.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
