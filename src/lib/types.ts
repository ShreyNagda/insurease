export type PolicySection = {
  title: string;
  originalText: string;
  explanation: string;
};

export type ProcessingResult = {
  documentTitle: string;
  sections: PolicySection[];
};
