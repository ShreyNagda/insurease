"use client";

import type React from "react";

import { useRef, useState } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResultAccordion from "@/components/ResultAccordion";
import { ProcessingResult } from "@/lib/types";
import AskQuestion from "@/components/AskQuestion";

export default function InsurancePolicyExplainer() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("Explain Policy");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf") {
      setError("Please select a PDF file");
      return;
    }
    console.log(selectedFile);
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
    if (result) return;
    setIsProcessing(true);
    setStatus("Processing Document...");

    const timeout1 = setTimeout(() => {
      setStatus("Extracting Text...");
    }, 1000);
    const timeout2 = setTimeout(() => {
      setStatus("Fetching results...");

      setTimeout(() => {
        setStatus("Results Available!");
      }, 1000);
    }, 1000);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/explain", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const { error } = await response.json();
        console.log(error);
        throw new Error(error);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while processing the document"
      );
    } finally {
      setIsProcessing(false);
      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
      };
    }
  };

  const clearDocument = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setStatus("Explain Document");
    if (fileInputRef.current?.value) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e9f9f1] via-[#ffffffbe] to-[#b5e4cf] p-4">
      <div className="max-w-4xl mx-auto">
        {/* <div className="text-center mb-8">
          <h1 className="text-5xl font-bold  text-[#1c3d1e] mb-4">INSUREASE</h1>
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
        </div> */}
        <Header />
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
              ref={fileInputRef}
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
                  {isProcessing && (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    </>
                  )}
                  <div className="text-white">{status}</div>
                </Button>
                <Button variant="outline" onClick={clearDocument}>
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
        {result && <ResultAccordion result={result} />}

        {/* Q&A Section */}
        {result && <AskQuestion result={result} />}
        <Footer />
      </div>
    </div>
  );
}
