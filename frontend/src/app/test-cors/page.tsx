"use client";

import { useState, ReactNode } from "react";

// Define types for test results
interface TestResult {
  url: string;
  method: string;
  withCredentials: boolean;
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
  data?: unknown;
  timeMs?: number;
  timestamp: string;
  error?: string;
}

// Helper function to check if data exists and is safe to render
const isRenderableData = (data: unknown): boolean => {
  return data !== null && data !== undefined;
};

export default function TestCorsPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Function to make a test request
  const makeTestRequest = async (url: string, method: string = 'GET', withCredentials: boolean = false) => {
    try {
      setLoading(true);
      
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin
        },
        credentials: withCredentials ? 'include' : 'omit',
        mode: 'cors'
      };
      
      // Add body for non-GET requests
      if (method !== 'GET' && method !== 'HEAD') {
        options.body = JSON.stringify({ test: 'data' });
      }
      
      const startTime = Date.now();
      const response = await fetch(url, options);
      const endTime = Date.now();
      
      const responseData = await response.text();
      let data;
      try {
        data = JSON.parse(responseData);
      } catch {
        data = responseData;
      }
      
      return {
        url,
        method,
        withCredentials,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers.entries()]),
        data,
        timeMs: endTime - startTime,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      return {
        url,
        method,
        withCredentials,
        error: (err instanceof Error) ? err.message : String(err),
        timestamp: new Date().toISOString()
      };
    }
  };
  
  // Run all tests
  const runAllTests = async () => {
    setLoading(true);
    setError(null);
    setTestResults([]);
    
    const results: TestResult[] = [];
    const baseUrls = [
      process.env.NEXT_PUBLIC_API_BASE_URL,
      'http://127.0.0.1:5000'
    ].filter(Boolean); // Filter out undefined/empty values
    
    const endpoints = [
      '/api/test-cors',
      '/api/network-info',
      '/profile/testuser'
    ];
    
    try {
      // Test GET requests
      for (const baseUrl of baseUrls) {
        for (const endpoint of endpoints) {
          const url = `${baseUrl}${endpoint}`;
          results.push(await makeTestRequest(url, 'GET', false));
          results.push(await makeTestRequest(url, 'GET', true));
        }
      }
      
      // Test OPTIONS requests
      for (const baseUrl of baseUrls) {
        results.push(await makeTestRequest(`${baseUrl}/profile/`, 'OPTIONS'));
      }
      
      // Test PUT request to profile endpoint
      for (const baseUrl of baseUrls) {
        results.push(await makeTestRequest(`${baseUrl}/profile/`, 'PUT', true));
      }
      
      setTestResults(results);
    } catch (err) {
      setError(`Test failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">CORS Test Page</h1>
      
      <div className="mb-6">
        <button
          onClick={runAllTests}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Running Tests...' : 'Run All Tests'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {testResults.length > 0 && (
        <div className="overflow-x-auto">
          <h2 className="text-xl font-semibold mb-3">Test Results ({testResults.length})</h2>
          
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border text-left">URL</th>
                <th className="px-4 py-2 border text-left">Method</th>
                <th className="px-4 py-2 border text-left">Credentials</th>
                <th className="px-4 py-2 border text-left">Status</th>
                <th className="px-4 py-2 border text-left">Result</th>
              </tr>
            </thead>
            <tbody>
              {testResults.map((result, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-2 border">{result.url}</td>
                  <td className="px-4 py-2 border">{result.method}</td>
                  <td className="px-4 py-2 border">{result.withCredentials ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 border">
                    {result.error ? (
                      <span className="text-red-600">Error</span>
                    ) : (
                      <span className={result.status && result.status >= 200 && result.status < 300 ? 'text-green-600' : 'text-red-600'}>
                        {result.status} {result.statusText}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    {result.error ? (
                      <span className="text-red-600">{result.error}</span>
                    ) : (
                      <details>
                        <summary className="cursor-pointer">View Details</summary>
                        <div className="mt-2 text-xs">
                          {result.headers && (
                            <>
                              <h4 className="font-bold">Headers:</h4>
                              <pre className="bg-gray-100 p-2 mt-1 rounded overflow-x-auto">
                                {JSON.stringify(result.headers, null, 2)}
                              </pre>
                            </>
                          )}
                          
                          {isRenderableData(result.data) && (
                            <>
                              <h4 className="font-bold mt-2">Data:</h4>
                              <pre className="bg-gray-100 p-2 mt-1 rounded overflow-x-auto">
                                {typeof result.data === 'object' ? 
                                  JSON.stringify(result.data, null, 2) : 
                                  String(result.data)
                              }
                              </pre>
                            </>
                          )}
                          
                          {result.timeMs !== undefined && (
                            <p className="mt-2">
                              <span className="font-semibold">Time:</span> {result.timeMs}ms
                            </p>
                          )}
                        </div>
                      </details>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 