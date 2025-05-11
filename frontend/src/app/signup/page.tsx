"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

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
