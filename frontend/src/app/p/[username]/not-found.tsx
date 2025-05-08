import Link from 'next/link';

export default function ProfileNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile Not Found</h1>
        <p className="text-gray-600 mb-6">
          The profile you're looking for doesn't exist or hasn't been created yet.
        </p>
        <div className="flex justify-center space-x-4">
          <Link 
            href="/"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Go Home
          </Link>
          <Link 
            href="/signup"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
          >
            Create Your Own
          </Link>
        </div>
      </div>
    </div>
  );
} 