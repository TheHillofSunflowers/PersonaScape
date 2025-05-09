'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import LikeButton from '@/components/LikeButton';

// Profile type definition
type ProfileData = {
  id?: number;
  userId?: number;
  bio: string;
  hobbies: string[];
  socialLinks: {
    platform: string;
    url: string;
  }[];
  theme: string;
  customHtml?: string;
};

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  
  // State
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`http://localhost:5000/api/profile/${username}`);
        
        if (response.ok) {
          const data = await response.json();
          
          // Parse hobbies from string to array
          let hobbiesArray: string[] = [];
          if (data.hobbies) {
            if (typeof data.hobbies === 'string') {
              hobbiesArray = data.hobbies.split(',').map((h: string) => h.trim());
            } else if (Array.isArray(data.hobbies)) {
              hobbiesArray = data.hobbies;
            }
          }
          
          // Parse socialLinks from JSON to array
          let socialLinksArray: {platform: string, url: string}[] = [];
          if (data.socialLinks) {
            if (Array.isArray(data.socialLinks)) {
              socialLinksArray = data.socialLinks;
            } else if (typeof data.socialLinks === 'object' && data.socialLinks !== null) {
              socialLinksArray = Object.entries(data.socialLinks).map(([platform, url]) => ({
                platform,
                url: url as string
              }));
            }
          }
          
          setProfile({
            ...data,
            bio: data.bio || '',
            theme: data.theme || 'default',
            hobbies: hobbiesArray,
            socialLinks: socialLinksArray,
            customHtml: data.customHtml || ''
          });
        } else if (response.status === 404) {
          // Use Next.js built-in not found page
          console.error(`Profile for user "${username}" not found.`);
          setProfile(null);
          // We'll handle the not found state in the render section
        } else {
          // Try to get error message from response
          let errorMsg = `Failed to fetch profile: ${response.status}`;
          try {
            const errorData = await response.json();
            if (errorData && errorData.error) {
              errorMsg = errorData.error;
            }
          } catch {
            // If we can't parse the response, just use the default error message
          }
          setError(errorMsg);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        const errorMessage = (err as Error).message || '';
        
        // Check if this is a "data is null" error, which means the profile hasn't been created yet
        if (errorMessage.includes('data is null') || errorMessage.includes('null')) {
          // This is likely a case where the user exists but hasn't created a profile yet
          // We'll handle it like a not found case
          setProfile(null);
        } else {
          // For other errors, show the error message
          setError(`Failed to load profile. ${errorMessage}`);
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (username) {
      fetchProfile();
    }
  }, [username]);
  
  // Apply theme styles based on profile theme
  const getThemeStyles = () => {
    if (!profile) return {};
    
    switch (profile.theme) {
      case 'dark':
        return {
          background: '#121212',
          color: '#e0e0e0',
          cardBg: '#1e1e1e'
        };
      case 'colorful':
        return {
          background: 'linear-gradient(135deg, #6b73ff 0%, #000dff 100%)',
          color: '#ffffff',
          cardBg: 'rgba(255, 255, 255, 0.15)'
        };
      case 'minimalist':
        return {
          background: '#ffffff',
          color: '#333333',
          cardBg: '#f7f7f7'
        };
      case 'professional':
        return {
          background: '#f0f4f8',
          color: '#2c3e50',
          cardBg: '#ffffff'
        };
      default:
        return {
          background: '#f0f2f5',
          color: '#333333',
          cardBg: '#ffffff'
        };
    }
  };
  
  const themeStyles = getThemeStyles();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-700 mb-4">Error</h1>
          <p className="text-gray-800">{error}</p>
          <div className="mt-6">
            <Link href="/" className="text-blue-600 hover:underline">Go to Home</Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Show not found page if profile is null and we're not loading
  if (!profile && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-blue-50 p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-blue-700 mb-4">Profile Not Set Up Yet</h1>
          <p className="text-gray-800">The profile for <span className="font-semibold">{username}</span> exists but hasn&apos;t been customized yet.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="text-blue-600 hover:underline text-center">
              Go to Home
            </Link>
            <Link href="/profile/edit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-center">
              Set Up My Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="min-h-screen pb-10" 
      style={{ 
        background: themeStyles.background,
        color: themeStyles.color
      }}
    >
      {/* Custom HTML (if provided) */}
      {profile?.customHtml && (
        <div
          className="custom-html-container"
          dangerouslySetInnerHTML={{ __html: profile.customHtml }}
        />
      )}
      
      <div className="container mx-auto px-4 py-8">
        <div 
          className="rounded-lg shadow-lg p-6 mb-8"
          style={{ background: themeStyles.cardBg }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h1 className="text-3xl font-bold mb-4 sm:mb-0">{username}</h1>
            
            {/* Add the like button here */}
            {profile?.id && (
              <div className="flex items-center">
                <LikeButton 
                  profileId={profile.id} 
                  size="lg" 
                  showCount={true}
                  className="ml-auto"
                  username={username}
                />
              </div>
            )}
          </div>
          
          {/* Rest of profile header */}
          {profile?.bio && (
            <p className="text-lg mb-6">{profile.bio}</p>
          )}
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Bio Section */}
          <div 
            className="mb-8 p-6 rounded-lg shadow-md" 
            style={{ background: themeStyles.cardBg }}
          >
            <h2 className="text-2xl font-semibold mb-4">About Me</h2>
            <div className="prose">
              {profile?.bio ? (
                <p className="whitespace-pre-wrap">{profile?.bio}</p>
              ) : (
                <p className="text-gray-500 italic">No bio provided</p>
              )}
            </div>
          </div>
          
          {/* Hobbies Section */}
          <div 
            className="mb-8 p-6 rounded-lg shadow-md" 
            style={{ background: themeStyles.cardBg }}
          >
            <h2 className="text-2xl font-semibold mb-4">Interests & Hobbies</h2>
            {profile?.hobbies && profile.hobbies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile?.hobbies.map((hobby, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ 
                      background: 'rgba(0,0,0,0.1)', 
                    }}
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No hobbies shared</p>
            )}
          </div>
          
          {/* Social Links Section */}
          <div 
            className="mb-8 p-6 rounded-lg shadow-md" 
            style={{ background: themeStyles.cardBg }}
          >
            <h2 className="text-2xl font-semibold mb-4">Connect with Me</h2>
            {profile?.socialLinks && profile.socialLinks.length > 0 ? (
              <ul className="space-y-3">
                {profile.socialLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:underline"
                    >
                      <span className="font-medium mr-2">{link.platform}:</span>
                      <span>{link.url}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No social links shared</p>
            )}
          </div>
          
          <footer className="text-center mt-12 text-sm opacity-70">
            <p>Built with PersonaScape</p>
          </footer>
        </div>
      </div>
    </div>
  );
} 