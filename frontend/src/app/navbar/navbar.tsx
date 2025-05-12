"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-accent-800 shadow-soft backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border-b border-accent-200 dark:border-accent-700">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center"
            >
              <span className="text-2xl font-heading font-bold bg-gradient-to-r from-primary-600 to-secondary-600 text-transparent bg-clip-text">
                PersonaScape
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              href="/leaderboard" 
              className="px-4 py-2 text-accent-600 dark:text-accent-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-md"
            >
              Leaderboard
            </Link>
            
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="px-4 py-2 text-accent-600 dark:text-accent-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-md"
                >
                  Dashboard
                </Link>
                <Link 
                  href={`/p/${user.username}`}
                  className="px-4 py-2 text-accent-600 dark:text-accent-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-md"
                >
                  My Profile
                </Link>
                <button
                  onClick={logout}
                  className="ml-2 px-4 py-2 bg-accent-100 dark:bg-accent-700 text-accent-700 dark:text-accent-200 hover:bg-accent-200 dark:hover:bg-accent-600 rounded-md transition-colors"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-accent-600 dark:text-accent-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-md"
                >
                  Log In
                </Link>
                <Link 
                  href="/signup" 
                  className="ml-2 px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-md transition-colors shadow-button"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-accent-500 hover:text-accent-700 dark:text-accent-300 dark:hover:text-accent-100 focus:outline-none"
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
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden animate-slide-up">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-accent-800 border-t border-accent-200 dark:border-accent-700">
            <Link 
              href="/leaderboard" 
              className="block px-3 py-2 text-accent-600 dark:text-accent-300 hover:bg-accent-100 dark:hover:bg-accent-700 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Leaderboard
            </Link>
            
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="block px-3 py-2 text-accent-600 dark:text-accent-300 hover:bg-accent-100 dark:hover:bg-accent-700 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href={`/p/${user.username}`}
                  className="block px-3 py-2 text-accent-600 dark:text-accent-300 hover:bg-accent-100 dark:hover:bg-accent-700 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-accent-600 dark:text-accent-300 hover:bg-accent-100 dark:hover:bg-accent-700 rounded-md"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="block px-3 py-2 text-accent-600 dark:text-accent-300 hover:bg-accent-100 dark:hover:bg-accent-700 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link 
                  href="/signup" 
                  className="block px-3 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
