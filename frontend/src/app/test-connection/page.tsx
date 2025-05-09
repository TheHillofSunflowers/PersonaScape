"use client";

import { useState } from "react";
import api from "@/lib/api";

interface TestResult {
  message?: string;
  data?: unknown;
  success?: boolean;
  status?: number;
  statusText?: string;
}

interface ErrorWithMessage {
  message: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

export default function TestConnectionPage() {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setTestResult(null);
    
    try {
      const result = await api.testConnection();
      if (result.success) {
        setTestResult(result as TestResult);
      } else {
        setError(result.message || 'Connection failed with no specific error message');
      }
    } catch (err: unknown) {
      setError(isErrorWithMessage(err) ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const testDirectFetch = async () => {
    setLoading(true);
    setError(null);
    setTestResult(null);
    
    const testUrl = 'http://localhost:5000/api/test-cors';
    
    try {
      console.log(`Testing direct fetch to ${testUrl}`);
      const response = await fetch(testUrl, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log("Direct fetch successful:", data);
      
      setTestResult({
        message: 'Direct fetch connection successful',
        data: data
      });
    } catch (err: unknown) {
      console.error("Direct fetch failed:", err);
      setError(`Direct fetch failed: ${isErrorWithMessage(err) ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testNetworkInfo = async () => {
    setLoading(true);
    setError(null);
    setTestResult(null);
    
    const networkInfoUrl = 'http://localhost:5000/api/network-info';
    
    try {
      console.log(`Testing network info at ${networkInfoUrl}`);
      const response = await fetch(networkInfoUrl, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log("Network info:", data);
      
      setTestResult({
        message: 'Network information retrieved successfully',
        data: data
      });
    } catch (err: unknown) {
      console.error("Network info request failed:", err);
      setError(`Network info request failed: ${isErrorWithMessage(err) ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testSignupConnection = async () => {
    setLoading(true);
    setError(null);
    setTestResult(null);
    
    try {
      // First try a normal GET to see if the route exists
      const signupUrl = 'http://localhost:5000/api/auth/signup';
      console.log('Testing signup endpoint at:', signupUrl);
      
      const response = await fetch(signupUrl, {
        method: 'OPTIONS',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setTestResult({
          message: 'Signup route is accessible',
          status: response.status,
          statusText: response.statusText
        });
      } else {
        // Even a 404 or other error code is good - it means we reached the server
        setTestResult({
          message: 'Signup route is reachable but returned an error',
          status: response.status,
          statusText: response.statusText
        });
      }
    } catch (err: unknown) {
      console.error("Signup endpoint test error:", err);
      setError(`Signup endpoint test failed: ${isErrorWithMessage(err) ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testCustomUrl = async () => {
    if (!customUrl) {
      setError('Please enter a URL to test');
      return;
    }

    setLoading(true);
    setError(null);
    setTestResult(null);
    
    try {
      const response = await fetch(customUrl);
      const data = await response.json();
      setTestResult(data);
    } catch (err: unknown) {
      setError(`Error connecting to custom URL: ${isErrorWithMessage(err) ? err.message : 'Unknown error'}`);
      console.error('Custom URL test error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testRawConnection = async () => {
    setLoading(true);
    setError(null);
    setTestResult(null);
    
    try {
      // Use a direct hardcoded URL to avoid any potential issues with URL formatting
      const testUrl = 'http://localhost:5000/api/test-cors';
      console.log(`Testing direct hardcoded URL: ${testUrl}`);
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setTestResult({
        message: 'Raw connection successful',
        data: data
      });
    } catch (err: unknown) {
      console.error("Raw connection test failed:", err);
      setError(`Raw connection test failed: ${isErrorWithMessage(err) ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6">API Connection Test</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Default API Connection</h2>
        <p className="mb-4">
          This will test the connection to: <code className="bg-gray-100 px-2 py-1 rounded">{process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}</code>
        </p>
        
        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50 mr-2"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
        
        <button
          onClick={testDirectFetch}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded disabled:opacity-50 mr-2"
        >
          {loading ? 'Testing...' : 'Direct Fetch Test'}
        </button>
        
        <button
          onClick={testNetworkInfo}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded disabled:opacity-50 mr-2"
        >
          {loading ? 'Testing...' : 'Network Info Test'}
        </button>
        
        <button
          onClick={testRawConnection}
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded disabled:opacity-50 mr-2"
        >
          {loading ? 'Testing...' : 'Raw Connection Test'}
        </button>
        
        <button
          onClick={testSignupConnection}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Signup Endpoint'}
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Custom URL</h2>
        <p className="mb-2">Try connecting to a specific IP address shown when starting the backend</p>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="e.g., http://192.168.1.100:5000/api/test-cors"
            className="flex-1 border border-gray-300 rounded px-3 py-2"
          />
          <button
            onClick={testCustomUrl}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded disabled:opacity-50"
          >
            Test
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-red-700 font-medium">Connection Error</p>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {testResult && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-green-800 mb-2">Connection Successful!</h3>
          <div className="bg-white p-3 rounded-md overflow-auto">
            <pre className="whitespace-pre-wrap">{JSON.stringify(testResult, null, 2)}</pre>
          </div>
        </div>
      )}

      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Troubleshooting Tips</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Make sure the backend server is running on port 5000</li>
          <li>Try accessing <a href="http://localhost:5000/test.html" target="_blank" className="text-blue-600 underline">http://localhost:5000/test.html</a> directly in your browser</li>
          <li>Check if any firewall or antivirus is blocking the connection</li>
          <li>Try using a specific IP address instead of localhost</li>
          <li>Check the console for more detailed error information</li>
        </ul>
      </div>
    </div>
  );
} 