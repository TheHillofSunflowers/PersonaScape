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
    
    const loginUrl = 'http://localhost:5000/api/auth/login';
    const loginData = { email, password };
    
    try {
      console.log("Attempting direct fetch login...");
      
      try {
        // First try with direct fetch
        const response = await fetch(loginUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData)
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Login successful:", data);
          login(data.token); // Store token + fetch user info
          router.push("/dashboard"); // Or your protected page
          return;
        } else {
          console.warn("Login failed with status:", response.status);
          throw new Error(response.status === 401 ? "Invalid email or password" : `Login failed with status: ${response.status}`);
        }
      } catch (fetchErr) {
        console.warn("Direct fetch login failed:", fetchErr);
        // Fall back to axios as a backup
        console.log("Falling back to axios...");
        const res = await api.post("/api/auth/login", loginData);
        login(res.data.token);
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || err.message || "Login failed");
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
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
                Sign up
            </a>
        </p>


      </form>
    </div>
  );
}
