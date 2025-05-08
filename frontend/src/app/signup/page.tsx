"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    console.log("Starting signup request");
    
    const signupUrl = 'http://localhost:5000/api/auth/signup';
    console.log('Using signup URL:', signupUrl);
    
    const signupData = { username, email, password };

    try {
      // Try with direct fetch first (bypassing any Next.js rewrites)
      console.log("Attempting direct fetch to signup endpoint...");
      
      try {
        const directResponse = await fetch(signupUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signupData)
        });
        
        if (directResponse.ok) {
          const data = await directResponse.json();
          console.log("Signup successful via direct fetch:", data);
          setSuccess("Signup successful! Redirecting to login...");
          setTimeout(() => router.push("/login"), 2000);
          return;
        } else {
          console.warn("Direct fetch request failed with status:", directResponse.status);
          // Continue to try with axios
        }
      } catch (fetchErr) {
        console.warn("Direct fetch attempt failed:", fetchErr);
        // Continue to try with axios
      }
      
      // Fall back to axios client - use direct URL instead of relative path
      console.log("Falling back to direct axios client...");
      const res = await axios.post(signupUrl, signupData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      if (res.status === 201) {
        setSuccess("Signup successful! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (err: any) {
      console.error("Full error object:", err);
      
      if (err.name === 'AxiosError' && err.message === 'Network Error') {
        setError(`Network error: Cannot connect to the server. Please check if the backend is running at ${signupUrl}. Try the /test-connection page for diagnostics.`);
        console.error("Network error details:", {
          message: err.message,
          code: err.code,
          stack: err.stack
        });
        
        // Try to run a quick diagnostic
        fetch('http://localhost:5000/api/test-cors')
          .then(res => res.json())
          .then(data => console.log("Diagnostic test successful:", data))
          .catch(diagErr => console.error("Diagnostic test failed:", diagErr));
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(`Something went wrong: ${err.message}. Please check the console for details.`);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
