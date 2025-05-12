"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const loginData = { email, password };
    
    try {
      console.log("Attempting login...");
      const res = await api.post("/auth/login", loginData);
      console.log("Login successful:", res.data);
      login(res.data.token);
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Login error:", err);
      if (err && 
          typeof err === 'object' && 
          'name' in err && 
          err.name === 'AxiosError' && 
          'message' in err && 
          err.message === 'Network Error') {
        setError("Network error: Cannot connect to the server. Please check if the backend is running.");
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
        setError(`Something went wrong: ${err.message}`);
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
          <h1 className="text-2xl font-bold text-white">Log In</h1>
        </div>
        
        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-900/20 border border-red-800 text-red-400">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-[#2a2b33] border border-[#32333c] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md transition-colors font-medium"
          >
            Sign In
          </button>

          <p className="text-sm mt-6 text-center text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-400 hover:text-blue-300 transition">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
