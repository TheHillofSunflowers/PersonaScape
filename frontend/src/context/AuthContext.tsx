"use client";

import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import api from "@/lib/api";

type User = {
  id: string;
  email: string;
  username: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

// Helper functions for cookie management
const setCookie = (name: string, value: string, days: number = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + value + expires + "; path=/; SameSite=Lax";
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const removeCookie = (name: string) => {
  document.cookie = name + '=; Max-Age=-99999999; path=/';
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUser = async (token: string) => {
    try {
      setLoading(true);
      console.log("Fetching user with token:", token.substring(0, 10) + "...");
      
      const response = await api.get("/auth/me");
      
      if (response.data) {
        console.log("User data fetched successfully:", response.data);
        setUser(response.data.user);
      } else {
        console.error("Failed to fetch user data");
        logout();
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Load token from localStorage and cookies on first render
  useEffect(() => {
    // Try to get token from cookie first (more secure)
    let authToken = getCookie("auth_token");
    
    // Fall back to localStorage if no cookie
    if (!authToken) {
      authToken = localStorage.getItem("token");
    }
    
    console.log("AuthProvider init - checking for token:", authToken ? "Token found" : "No token");
    
    if (authToken) {
      console.log("Token found, setting token state and fetching user");
      // Ensure token is stored in both places
      localStorage.setItem("token", authToken);
      setCookie("auth_token", authToken);
      
      setToken(authToken);
      fetchUser(authToken);
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [/* fetchUser is intentionally omitted to avoid infinite render loops */]);

  const login = (newToken: string) => {
    console.log("Login called with new token:", newToken.substring(0, 10) + "...");
    // Store token in both localStorage and cookies
    localStorage.setItem("token", newToken);
    setCookie("auth_token", newToken);
    
    setToken(newToken);
    fetchUser(newToken);
  };

  const logout = () => {
    console.log("Logout called, clearing token and user");
    // Clear token from both localStorage and cookies
    localStorage.removeItem("token");
    removeCookie("auth_token");
    
    setUser(null);
    setToken(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Add the useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
