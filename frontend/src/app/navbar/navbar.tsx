"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Function to determine if a link is active
  const isActive = (path: string) => {
    return pathname === path;
  };

  // Function to check if the current path matches the user profile path
  const isUserProfileActive = () => {
    return user && pathname === `/p/${user.username}`;
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#1e1f27] border-b border-[#32333c] shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and brand */}
        <Link href="/" className="text-xl font-semibold text-white hover:text-blue-300 transition">
          PersonaScape
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          <Link 
            href="/leaderboard" 
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              isActive('/leaderboard') 
                ? 'bg-[#32333c] text-white' 
                : 'text-gray-300 hover:bg-[#32333c] hover:text-white'
            } transition-colors`}
          >
            Leaderboard
          </Link>
          
          {user ? (
            <>
              <Link 
                href="/dashboard" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/dashboard') 
                    ? 'bg-[#32333c] text-white' 
                    : 'text-gray-300 hover:bg-[#32333c] hover:text-white'
                } transition-colors`}
              >
                Dashboard
              </Link>
              
              <Link 
                href={`/p/${user.username}`} 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isUserProfileActive() 
                    ? 'bg-[#32333c] text-white' 
                    : 'text-gray-300 hover:bg-[#32333c] hover:text-white'
                } transition-colors`}
              >
                My Profile
              </Link>
              
              <button
                onClick={logout}
                className="px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-[#32333c] hover:text-red-300 transition-colors"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/login') 
                    ? 'bg-[#32333c] text-white' 
                    : 'text-gray-300 hover:bg-[#32333c] hover:text-white'
                } transition-colors`}
              >
                Log In
              </Link>
              
              <Link 
                href="/signup" 
                className={`ml-2 px-3 py-2 rounded-md text-sm font-medium text-white ${
                  isActive('/signup') 
                    ? 'bg-blue-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors`}
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
            className="p-2 rounded-md text-gray-300 hover:bg-[#32333c] hover:text-white focus:outline-none"
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
          <div className="px-2 pt-2 pb-3 space-y-1 bg-[#23242b] border-t border-[#32333c] shadow-md">
            <Link 
              href="/leaderboard" 
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/leaderboard') 
                  ? 'bg-[#32333c] text-white' 
                  : 'text-gray-300 hover:bg-[#32333c] hover:text-white'
              } transition-colors`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Leaderboard
            </Link>
            
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/dashboard') 
                      ? 'bg-[#32333c] text-white' 
                      : 'text-gray-300 hover:bg-[#32333c] hover:text-white'
                  } transition-colors`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                
                <Link 
                  href={`/p/${user.username}`} 
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${
                    isUserProfileActive() 
                      ? 'bg-[#32333c] text-white' 
                      : 'text-gray-300 hover:bg-[#32333c] hover:text-white'
                  } transition-colors`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
                
                <button
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-[#32333c] hover:text-red-300 transition-colors"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/login') 
                      ? 'bg-[#32333c] text-white' 
                      : 'text-gray-300 hover:bg-[#32333c] hover:text-white'
                  } transition-colors`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                
                <Link 
                  href="/signup" 
                  className={`block px-3 py-2 rounded-md text-sm font-medium text-white ${
                    isActive('/signup') 
                      ? 'bg-blue-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } transition-colors`}
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
