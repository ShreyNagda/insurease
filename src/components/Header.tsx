import Image from "next/image";

export default function Header() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-5xl font-bold text-[#016639] mb-4 flex items-center justify-center gap-3">
        <Image src="/logo-transparent.png" alt="Logo" height={50} width={50} />
        INSUREASE
      </h1>
      <p className="text-xl text-gray-600 mb-2">
        Your AI-Powered Insurance Policy Assistant
      </p>
      <p className="text-lg text-gray-500 mb-4">
        Upload your policy PDF for plain-language explanations and ask questions
        about your insurance
      </p>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-2xl mx-auto">
        <p className="text-sm text-amber-800">
          <strong>Important:</strong> INSUREASE provides educational
          explanations only and does not constitute legal or professional
          insurance advice. Always consult with your insurance agent or legal
          professional for official policy interpretations.
        </p>
      </div>
    </div>
  );
}
