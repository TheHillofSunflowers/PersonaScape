export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-pulse">
          <div className="h-12 w-64 bg-gray-200 rounded mb-6 mx-auto"></div>
          <div className="h-64 w-full max-w-2xl bg-gray-200 rounded mb-6"></div>
          <div className="h-32 w-full max-w-2xl bg-gray-200 rounded"></div>
        </div>
        <p className="text-gray-500 mt-6">Loading profile...</p>
      </div>
    </div>
  );
} 