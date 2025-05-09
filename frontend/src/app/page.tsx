"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";

export default function Home() {
  const { user } = useContext(AuthContext);
  const [apiStatus, setApiStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  
  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/test-cors');
        
        if (response.ok) {
          setApiStatus('connected');
          setApiMessage('Backend API is running and accessible');
        } else {
          setApiStatus('error');
          setApiMessage(`API returned status: ${response.status}`);
        }
      } catch (err) {
        setApiStatus('error');
        setApiMessage(`Failed to connect: ${(err as Error).message}`);
      }
    };
    
    checkApi();
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-blue-900 mb-6">PersonaScape</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Create your customizable, shareable profile page and express yourself online.
            Build a beautiful digital presence that&apos;s uniquely you!
          </p>
          
          {user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/dashboard" 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Go to Dashboard
              </Link>
              <Link 
                href={`/p/${user.username}`}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition"
              >
                View Your Profile
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/signup" 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Create Your Profile
              </Link>
              <Link 
                href="/login" 
                className="bg-gray-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition"
              >
                Log In
              </Link>
            </div>
          )}
        </div>
        
        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-blue-800 mb-4">Customizable Profiles</h2>
            <p className="text-gray-600">
              Personalize your page with themes, bios, hobbies, and social links to express your unique personality.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-blue-800 mb-4">Easy Sharing</h2>
            <p className="text-gray-600">
              Share your profile with a simple URL. Perfect for social media, job applications, or networking.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-blue-800 mb-4">Profile Likes</h2>
            <p className="text-gray-600">
              Like profiles you enjoy and see your profile climb the ranks on our leaderboard as others appreciate your content.
            </p>
            <Link href="/leaderboard" className="text-blue-600 hover:underline text-sm block mt-2">
              See the leaderboard →
            </Link>
          </div>
        </div>
        
        {/* Status Section */}
        <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto mb-16">
          <h2 className="text-xl font-bold text-gray-800 mb-4">API Status</h2>
          <div className={`p-4 rounded ${
            apiStatus === 'connected' ? 'bg-green-100 text-green-800' : 
            apiStatus === 'error' ? 'bg-red-100 text-red-800' : 
            'bg-yellow-100 text-yellow-800'
          }`}>
            <div className="flex items-center">
              <span className="text-2xl mr-2">
                {apiStatus === 'connected' ? '✅' : 
                 apiStatus === 'error' ? '❌' : 
                 '⏳'}
              </span>
              <div>
                <p className="font-medium">
                  {apiStatus === 'connected' ? 'Connected' : 
                   apiStatus === 'error' ? 'Error' : 
                   'Loading...'}
                </p>
                {apiMessage && <p className="text-sm mt-1">{apiMessage}</p>}
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <Link href="/test-connection" className="text-blue-600 hover:underline text-sm">
              Advanced Connection Diagnostic
            </Link>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} PersonaScape. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
