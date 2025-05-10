"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

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
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow bg-white">
      <h1 className="text-2xl font-bold mb-4">Log In</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Log In
        </button>

        <p className="text-sm mt-4 text-center">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
                Sign up
            </a>
        </p>


      </form>
    </div>
  );
}
