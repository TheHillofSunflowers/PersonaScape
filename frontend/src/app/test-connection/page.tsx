"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';

// Define types for API responses
interface ApiResponse {
  message?: string;
  timestamp?: string;
  headers?: Record<string, string>;
  [key: string]: unknown;
}

interface ConnectionError {
  message: string;
  code?: string;
  name?: string;
}

export default function TestConnectionPage() {
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [fetchResponse, setFetchResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [env, setEnv] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Collect environment variables
    const envVars: Record<string, string> = {};
    Object.keys(process.env).forEach(key => {
      if (key.startsWith('NEXT_PUBLIC_')) {
        envVars[key] = process.env[key] as string;
      }
    });
    setEnv(envVars);

    const testConnection = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Test using API client
        const apiResult = await api.get<ApiResponse>('/test-cors');
        setApiResponse(apiResult.data);
        
        // Also test with direct fetch
        const fetchResult = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'https://personascape.onrender.com'}/api/test-cors`, 
          { mode: 'cors' }
        );
        const fetchData = await fetchResult.json() as ApiResponse;
        setFetchResponse(fetchData);
      } catch (err: unknown) {
        console.error('Connection test failed:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to connect to API';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">API Connection Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(env, null, 2)}
          </pre>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
          <h2 className="font-bold">Connection Error</h2>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">API Client Response</h2>
            <div className="bg-green-100 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Fetch API Response</h2>
            <div className="bg-green-100 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(fetchResponse, null, 2)}
              </pre>
            </div>
          </div>
        </>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Connection Details</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'https://personascape.onrender.com'}
          </li>
          <li>
            <strong>Test Endpoint:</strong> {`${process.env.NEXT_PUBLIC_API_URL || 'https://personascape.onrender.com'}/api/test-cors`}
          </li>
          <li>
            <strong>Browser Origin:</strong> {typeof window !== 'undefined' ? window.location.origin : 'N/A'}
          </li>
        </ul>
      </div>
    </div>
  );
} 