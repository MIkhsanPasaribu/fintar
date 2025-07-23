export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Tailwind CSS Test
        </h1>
        <p className="text-gray-600 text-center mb-6">
          If you can see this styled properly, Tailwind CSS is working!
        </p>
        <div className="space-y-4">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg text-center">
            Primary Button
          </div>
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg text-center">
            Success Button
          </div>
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-center">
            Danger Button
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2">
          <div className="h-8 bg-purple-500 rounded"></div>
          <div className="h-8 bg-yellow-500 rounded"></div>
          <div className="h-8 bg-pink-500 rounded"></div>
        </div>
      </div>
    </div>
  );
}
