"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-brand-900/80 backdrop-blur-md shadow-card border-b border-brand-100 dark:border-brand-800">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold font-heading text-primary-600 dark:text-primary-400 tracking-tight">PersonaScape</span>
        </Link>
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/leaderboard" className="px-4 py-2 rounded-lg text-brand-700 dark:text-brand-100 hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors font-medium">Leaderboard</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="px-4 py-2 rounded-lg text-brand-700 dark:text-brand-100 hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors font-medium">Dashboard</Link>
              <Link href={`/p/${user.username}`} className="px-4 py-2 rounded-lg text-brand-700 dark:text-brand-100 hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors font-medium">My Profile</Link>
              <button
                onClick={logout}
                className="ml-2 px-4 py-2 rounded-lg bg-danger-500 text-white hover:bg-danger-600 transition-colors font-medium shadow-button"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 rounded-lg text-brand-700 dark:text-brand-100 hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors font-medium">Log In</Link>
              <Link href="/signup" className="ml-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors font-medium shadow-button">Sign Up</Link>
            </>
          )}
        </div>
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-brand-700 dark:text-brand-100 hover:bg-brand-100 dark:hover:bg-brand-800 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 dark:bg-brand-900/95 border-t border-brand-100 dark:border-brand-800 shadow-card">
            <Link href="/leaderboard" className="block px-3 py-2 rounded-lg text-brand-700 dark:text-brand-100 hover:bg-brand-100 dark:hover:bg-brand-800 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Leaderboard</Link>
            {user ? (
              <>
                <Link href="/dashboard" className="block px-3 py-2 rounded-lg text-brand-700 dark:text-brand-100 hover:bg-brand-100 dark:hover:bg-brand-800 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                <Link href={`/p/${user.username}`} className="block px-3 py-2 rounded-lg text-brand-700 dark:text-brand-100 hover:bg-brand-100 dark:hover:bg-brand-800 font-medium" onClick={() => setIsMobileMenuOpen(false)}>My Profile</Link>
                <button
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 rounded-lg bg-danger-500 text-white hover:bg-danger-600 font-medium mt-1"
                >Log Out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 rounded-lg text-brand-700 dark:text-brand-100 hover:bg-brand-100 dark:hover:bg-brand-800 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
                <Link href="/signup" className="block px-3 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-medium mt-1" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
