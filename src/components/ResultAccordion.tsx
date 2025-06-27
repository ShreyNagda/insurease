"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { Download } from "lucide-react";
import { PolicySection } from "@/lib/types";

export default function ResultAccordion({
  result,
}: {
  result: {
    documentTitle: string;
    sections: PolicySection[];
  };
}) {
  const [showOriginalText, setShowOriginalText] = useState<
    Record<string, boolean>
  >({});

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

  if (
    !result ||
    !result.sections ||
    !Array.isArray(result.sections) ||
    result.sections.length === 0
  ) {
    return (
      <div className="p-6 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 text-center">
        <p>
          No valid explanation data found. Please upload a valid policy
          document.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Legal Disclaimer */}
      <Alert className="border-emerald-200 bg-emerald-50">
        <AlertDescription className="text-emerald-800">
          <strong>Disclaimer:</strong> These explanations are AI-generated
          interpretations for educational purposes only. They do not constitute
          legal advice or official policy interpretations. For binding coverage
          details, please refer to your original policy document or contact your
          insurance provider.
        </AlertDescription>
      </Alert>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Policy Explanations
          </h2>
          <p>{result.documentTitle}</p>
        </div>
        <Button onClick={downloadJSON} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download JSON
        </Button>
      </div>
      <Accordion type="multiple" className="space-y-4">
        {result.sections.map((section, index) => (
          <AccordionItem
            key={index}
            value={`section-${index}`}
            className="border rounded-lg bg-white shadow-sm"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-base px-2">
                  {section.title}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4">
                {/* Explanation */}
                <div>
                  {/* <h4 className="font-semibold text-gray-900 mb-2">
                  Explanation:
                </h4> */}
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <p className="text-gray-800 leading-relaxed">
                      {section.explanation}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Toggle Original Text */}
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleOriginalText(section.title)}
                    className="mb-2 min-w-[180px]"
                  >
                    {showOriginalText[section.title] ? "Hide" : "Show"} Original
                    Text
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
  );
}
