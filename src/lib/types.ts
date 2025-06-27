export type PolicySection = {
  title: string;
  originalText: string;
  explanation: string;
};

export type ProcessingResult = {
  documentTitle: string;
  sections: PolicySection[];
};

export type AnalysisResult =
  | {
      success: true;
      documentTitle: string;
      sections: {
        title: string;
        originalText: string;
        explanation: string;
      }[];
    }
  | {
      success: false;
      error: string;
    };
