"use client";

// import { useState } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FileUploadProps {
  file: File | null;
  isProcessing: boolean;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  onProcess: () => void;
}

export default function FileUpload({
  file,
  isProcessing,
  onFileSelect,
  onClear,
  onProcess,
}: FileUploadProps) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
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
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
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
            if (selectedFile) onFileSelect(selectedFile);
          }}
        />

        {file && (
          <div className="mt-4 flex gap-2">
            <Button
              onClick={onProcess}
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
            <Button variant="outline" onClick={onClear}>
              Clear
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
