"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function TestCors() {
  const [testResult, setTestResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    try {
      // Direct fetch test with OPTIONS
      console.log("Testing OPTIONS request...");
      const optionsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/test-cors`, {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type, Authorization',
        },
      });
      console.log("OPTIONS response:", optionsRes.status, optionsRes.statusText);
      
      // Test GET with Axios
      console.log("Testing GET with Axios...");
      const res = await api.get("/api/test-cors");
      setTestResult(res.data);
      console.log("GET response:", res.status, res.statusText, res.data);
    } catch (err: any) {
      console.error("Error testing CORS:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">CORS Test Page</h1>
      
      <button
        onClick={testApi}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition mb-4"
      >
        {loading ? "Testing..." : "Test API Connection"}
      </button>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {testResult && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
          <p className="font-bold">Success!</p>
          <pre className="mt-2 text-sm whitespace-pre-wrap">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-600">
        <p>This page tests CORS configuration between your frontend and backend.</p>
        <p>Open the browser console to see detailed request and response information.</p>
      </div>
    </div>
  );
} 