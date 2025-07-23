export default function Page() {
  return (
    <div className="p-8 bg-blue-50 min-h-screen">
      <h1 className="text-3xl font-bold underline text-blue-900 mb-4">
        Hello, Next.js with Tailwind v4!
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-lg mb-4">
        <p className="text-gray-700 mb-4">
          Testing Tailwind CSS v4 dengan Next.js
        </p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">
          Tailwind Button
        </button>
        <div className="test-style inline-block">Custom CSS Test</div>
      </div>

      {/* Additional test elements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-100 p-4 rounded border-l-4 border-green-500">
          <h3 className="text-green-800 font-semibold">Success Color</h3>
          <p className="text-green-700 text-sm">Warna hijau untuk sukses</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded border-l-4 border-yellow-500">
          <h3 className="text-yellow-800 font-semibold">Warning Color</h3>
          <p className="text-yellow-700 text-sm">
            Warna kuning untuk peringatan
          </p>
        </div>
        <div className="bg-red-100 p-4 rounded border-l-4 border-red-500">
          <h3 className="text-red-800 font-semibold">Error Color</h3>
          <p className="text-red-700 text-sm">Warna merah untuk error</p>
        </div>
      </div>
    </div>
  );
}
