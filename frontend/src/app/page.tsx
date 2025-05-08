"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [apiStatus, setApiStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [apiMessage, setApiMessage] = useState<string>('');
  
  useEffect(() => {
    const testConnection = async () => {
      try {
        const testUrl = 'http://localhost:5000/api/test-cors';
        console.log("Testing API connection to:", testUrl);
        
        const response = await fetch(testUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("API connection successful:", data);
          setApiStatus('connected');
          setApiMessage(`Connected to API at ${testUrl}`);
        } else {
          console.error("API responded with error:", response.status);
          setApiStatus('error');
          setApiMessage(`API error: ${response.status} ${response.statusText}`);
        }
      } catch (err) {
        console.error("API connection failed:", err);
        setApiStatus('error');
        setApiMessage(`Failed to connect to API: ${err instanceof Error ? err.message : String(err)}`);
      }
    };
    
    testConnection();
  }, []);
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">PersonaScape</h1>
        
        <div className="mb-8 p-4 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">API Connection Status</h2>
          <div className={`p-3 rounded ${
            apiStatus === 'connected' ? 'bg-green-100 text-green-800' : 
            apiStatus === 'error' ? 'bg-red-100 text-red-800' : 
            'bg-yellow-100 text-yellow-800'
          }`}>
            <p className="font-medium">
              {apiStatus === 'connected' ? '✅ Connected' : 
               apiStatus === 'error' ? '❌ Error' : 
               '⏳ Loading...'}
            </p>
            {apiMessage && <p className="mt-1">{apiMessage}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/signup" className="p-4 border rounded-lg hover:bg-gray-100 transition">
            <h2 className="text-xl font-semibold mb-2">Sign Up</h2>
            <p>Create a new account to get started</p>
          </Link>
          
          <Link href="/login" className="p-4 border rounded-lg hover:bg-gray-100 transition">
            <h2 className="text-xl font-semibold mb-2">Login</h2>
            <p>Sign in to your existing account</p>
          </Link>
          
          <Link href="/test-connection" className="p-4 border rounded-lg hover:bg-gray-100 transition">
            <h2 className="text-xl font-semibold mb-2">Test Connection</h2>
            <p>Diagnose API connectivity issues</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
