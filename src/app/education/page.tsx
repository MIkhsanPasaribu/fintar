import EducationModule from "@/components/education/education-module";

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Edukasi Finansial
          </h1>
          <p className="text-lg text-neutral-600">
            Tingkatkan literasi keuangan Anda dengan konten berkualitas tinggi
          </p>
        </div>

        <EducationModule />
      </div>
    </div>
  );
}
