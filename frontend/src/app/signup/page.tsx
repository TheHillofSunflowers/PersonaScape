"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";

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
    const signupData = { username, email, password };

    try {
      console.log("Attempting signup...");
      const res = await api.post("/auth/signup", signupData);
      
      if (res.status === 201) {
        console.log("Signup successful:", res.data);
        setSuccess("Signup successful! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (err: unknown) {
      console.error("Full error object:", err);
      
      if (err && 
          typeof err === 'object' && 
          'name' in err && 
          err.name === 'AxiosError' && 
          'message' in err && 
          err.message === 'Network Error') {
        setError("Network error: Cannot connect to the server. Please check if the backend is running.");
        console.error("Network error details:", {
          message: (err as {message: string}).message,
          code: 'code' in err ? err.code : undefined,
          stack: 'stack' in err ? err.stack : undefined
        });
        
        // Try to run a quick diagnostic
        try {
          const testRes = await api.get("/test-cors");
          console.log("Diagnostic test successful:", testRes.data);
        } catch (diagErr) {
          console.error("Diagnostic test failed:", diagErr);
        }
      } else if (err && 
                typeof err === 'object' && 
                'response' in err && 
                err.response && 
                typeof err.response === 'object' && 
                'data' in err.response && 
                err.response.data && 
                typeof err.response.data === 'object' && 
                'message' in err.response.data) {
        setError(err.response.data.message as string);
      } else if (err instanceof Error) {
        setError(`Something went wrong: ${err.message}. Please check the console for details.`);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#16171d] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-[#23242b] rounded-xl p-8 border border-[#32333c] shadow-lg">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-2xl font-semibold text-blue-400 hover:text-blue-300 transition mb-4 inline-block"
          >
            PersonaScape
          </Link>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-900/20 border border-red-800 text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-md bg-green-900/20 border border-green-800 text-green-400">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-[#2a2b33] border border-[#32333c] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-[#2a2b33] border border-[#32333c] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-[#2a2b33] border border-[#32333c] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 px-4 rounded-md transition-colors font-medium"
          >
            Create Account
          </button>
          
          <p className="text-sm mt-6 text-center text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 transition">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
