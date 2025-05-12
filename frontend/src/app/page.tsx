"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";
import api from "@/lib/api";

export default function Home() {
  const { user } = useContext(AuthContext);
  const [apiStatus, setApiStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  
  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await api.get("/test-cors");
        
        if (response.status === 200) {
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
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-accent-50 dark:bg-accent-800 rounded-xl shadow-soft mb-10">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 text-transparent bg-clip-text">
            Express Your Digital Identity
          </h1>
          <p className="text-lg md:text-xl text-accent-800 dark:text-accent-200 mb-10 max-w-3xl mx-auto">
            Create your customizable, shareable profile page and express yourself online.
            Build a beautiful digital presence that&apos;s uniquely you!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-button cursor-pointer"
                >
                  Go to Dashboard
                </Link>
                <Link 
                  href={`/p/${user.username}`}
                  className="px-8 py-3 bg-secondary-600 text-white rounded-lg font-medium hover:bg-secondary-700 transition-colors shadow-button cursor-pointer"
                >
                  View Your Profile
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/signup" 
                  className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-button cursor-pointer"
                >
                  Create Your Profile
                </Link>
                <Link 
                  href="/login" 
                  className="px-8 py-3 bg-accent-600 text-white rounded-lg font-medium hover:bg-accent-700 transition-colors shadow-button cursor-pointer"
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-accent-50 dark:bg-accent-800 shadow-soft rounded-xl">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-heading font-bold text-center mb-12 text-accent-800 dark:text-white">
            Craft Your Online Presence
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-accent-200 dark:bg-accent-700 p-8 rounded-xl shadow-card hover:shadow-lg transition-shadow">
              <div className="text-primary-600 dark:text-primary-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-bold text-accent-800 dark:text-white mb-4">
                Customizable Profiles
              </h3>
              <p className="text-accent-800 dark:text-accent-200">
                Personalize your page with themes, bios, hobbies, and social links to express your unique personality.
              </p>
            </div>
            
            <div className="bg-accent-200 dark:bg-accent-700 p-8 rounded-xl shadow-card hover:shadow-lg transition-shadow">
              <div className="text-primary-600 dark:text-primary-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-bold text-accent-800 dark:text-white mb-4">
                Easy Sharing
              </h3>
              <p className="text-accent-800 dark:text-accent-200">
                Share your profile with a simple URL. Perfect for social media, job applications, or networking.
              </p>
            </div>
            
            <div className="bg-accent-200 dark:bg-accent-700 p-8 rounded-xl shadow-card hover:shadow-lg transition-shadow">
              <div className="text-primary-600 dark:text-primary-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905A3.61 3.61 0 018.5 7.5" />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-bold text-accent-800 dark:text-white mb-4">
                Profile Likes
              </h3>
              <p className="text-accent-800 dark:text-accent-200">
                Like profiles you enjoy and see your profile climb the ranks on our leaderboard as others appreciate your content.
              </p>
              <Link href="/leaderboard" className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center mt-3 font-medium text-sm cursor-pointer">
                See the leaderboard
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Status Section */}
      <section className="py-12 mt-16">
        <div className="max-w-lg mx-auto bg-accent-50 dark:bg-accent-800 rounded-xl shadow-soft p-8">
          <h2 className="text-2xl font-heading font-bold text-accent-800 dark:text-white mb-6">API Status</h2>
          <div className={`p-6 rounded-lg ${
            apiStatus === 'connected' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 
            apiStatus === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' : 
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
          }`}>
            <div className="flex items-center">
              <span className="text-3xl mr-4">
                {apiStatus === 'connected' ? '✅' : 
                apiStatus === 'error' ? '❌' : 
                '⏳'}
              </span>
              <div>
                <p className="font-semibold text-lg">
                  {apiStatus === 'connected' ? 'Connected' : 
                  apiStatus === 'error' ? 'Error' : 
                  'Loading...'}
                </p>
                {apiMessage && <p className="mt-1 text-sm opacity-90">{apiMessage}</p>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
