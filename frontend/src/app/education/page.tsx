import EducationModule from "@/components/education/education-module";

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-dark via-bg-main to-bg-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-font-light mb-4">
            Edukasi Finansial
          </h1>
          <p className="text-xl text-font-secondary">
            Tingkatkan literasi keuangan Anda dengan konten berkualitas tinggi
          </p>
        </div>

        <EducationModule />
      </div>
    </div>
  );
}
