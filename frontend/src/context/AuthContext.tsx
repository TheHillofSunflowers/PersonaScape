"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import api from "@/lib/api";

type User = {
  id: string;
  email: string;
  username: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load token from localStorage on first render
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    console.log("AuthProvider init - checking localStorage token:", storedToken ? "Token found" : "No token");
    
    if (storedToken) {
      console.log("Token found in localStorage, setting token state and fetching user");
      setToken(storedToken);
      fetchUser(storedToken);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      console.log("Fetching user with token:", token.substring(0, 10) + "...");
      
      // Use direct fetch with the correct API endpoint
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("User data fetched successfully:", data);
        setUser(data.user);
      } else {
        console.error("Failed to fetch user, status:", response.status);
        logout();
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
      logout();
    }
  };

  const login = (newToken: string) => {
    console.log("Login called with new token:", newToken.substring(0, 10) + "...");
    localStorage.setItem("token", newToken);
    setToken(newToken);
    fetchUser(newToken);
  };

  const logout = () => {
    console.log("Logout called, clearing token and user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
