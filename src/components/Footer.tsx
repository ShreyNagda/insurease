export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 pt-8">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-3">
          Legal Disclaimer & Terms of Use
        </h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p>
            <strong>Not Legal or Professional Advice:</strong> INSUREASE is an
            educational tool that uses artificial intelligence to provide
            simplified explanations of insurance policy language. The
            information provided is for educational purposes only and does not
            constitute legal, financial, or professional insurance advice.
          </p>
          <p>
            <strong>No Warranty:</strong> While we strive for accuracy,
            AI-generated explanations may contain errors or omissions. We make
            no warranties about the completeness, accuracy, or reliability of
            the information provided.
          </p>
        </div>
      </div>
    </footer>
  );
}
