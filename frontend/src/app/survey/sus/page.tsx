import SUSQuestionnaire from "@/components/survey/SUSQuestionnaire";

export const metadata = {
  title: "SUS Questionnaire - Fintar",
  description:
    "System Usability Scale questionnaire untuk evaluasi pengalaman pengguna",
};

export default function SUSPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <SUSQuestionnaire />
    </div>
  );
}
