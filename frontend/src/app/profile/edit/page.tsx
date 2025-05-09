'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';

interface ProfileData {
  id?: number;
  userId?: number;
  bio: string;
  hobbies: string;
  socialLinks: {
    platform: string;
    url: string;
  }[];
  theme: string;
  customHtml?: string;
}

export default function EditProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData>({
    bio: '',
    hobbies: '',
    socialLinks: [{ platform: '', url: '' }],
    theme: 'default',
    customHtml: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isNewProfile, setIsNewProfile] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.username) return;

      try {
        setIsLoading(true);
        setError(null); // Clear any previous errors
        
        try {
          // Try to fetch existing profile
          const response = await api.get(`/api/profile/${user.username}`);
          
          if (response.data) {
            setIsNewProfile(false); // This is an existing profile
            
            // Process hobbies from string to string
            let hobbiesStr = '';
            if (response.data.hobbies) {
              if (typeof response.data.hobbies === 'string') {
                hobbiesStr = response.data.hobbies;
              } else if (Array.isArray(response.data.hobbies)) {
                hobbiesStr = response.data.hobbies.join(', ');
              }
            }
            
            // Process socialLinks
            let socialLinksArray = [] as {platform: string, url: string}[];
            if (response.data.socialLinks) {
              if (Array.isArray(response.data.socialLinks)) {
                socialLinksArray = response.data.socialLinks;
              } else if (typeof response.data.socialLinks === 'object' && response.data.socialLinks !== null) {
                socialLinksArray = Object.entries(response.data.socialLinks).map(([platform, url]) => ({
                  platform,
                  url: url as string
                }));
              }
            }
            
            if (socialLinksArray.length === 0) {
              socialLinksArray = [{ platform: '', url: '' }];
            }
            
            setProfile({
              ...response.data,
              bio: response.data.bio || '',
              hobbies: hobbiesStr,
              socialLinks: socialLinksArray,
              theme: response.data.theme || 'default',
              customHtml: response.data.customHtml || ''
            });
          }
        } catch (err) {
          // If profile doesn't exist yet, we'll just use the default empty profile
          setIsNewProfile(true); // This is a new profile
          console.log('Creating new profile as none exists yet');
          
          // Default profile is already set in the initial state, so we don't need to do anything
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      setSaveMessage(null);
      setError(null);
      
      // Format data for API
      const hobbiesArray = profile.hobbies
        .split(',')
        .map(hobby => hobby.trim())
        .filter(hobby => hobby);
      
      // Filter out empty social links
      const socialLinks = profile.socialLinks.filter(
        link => link.platform.trim() && link.url.trim()
      );
      
      const profileData = {
        ...profile,
        hobbies: hobbiesArray,
        socialLinks: socialLinks.length > 0 ? socialLinks : null
      };
      
      console.log('Sending profile update with data:', profileData);
      
      try {
        // Create or update profile
        const response = await api.put('/api/profile', profileData);
        console.log('Profile update successful:', response.data);
        setSaveMessage('Profile saved successfully!');
        
        // Refresh page after 1.5 seconds
        setTimeout(() => {
          if (user?.username) {
            router.push(`/p/${user.username}`);
          }
        }, 1500);
      } catch (apiError: any) {
        console.error('API Error details:', apiError);
        if (apiError.message === 'Network Error') {
          setError('Network error. This could be caused by CORS or server connectivity issues. Please try again.');
        } else if (apiError.response) {
          setError(`Error: ${apiError.response.status} - ${apiError.response.data?.error || 'Unknown error'}`);
        } else {
          setError(`Failed to save profile: ${apiError.message}`);
        }
      }
      
    } catch (err) {
      console.error('Error in form submission:', err);
      setError('Failed to process form data. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSocialLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
    const newLinks = [...profile.socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setProfile({ ...profile, socialLinks: newLinks });
  };

  const addSocialLink = () => {
    setProfile({
      ...profile,
      socialLinks: [...profile.socialLinks, { platform: '', url: '' }]
    });
  };

  const removeSocialLink = (index: number) => {
    const newLinks = [...profile.socialLinks];
    newLinks.splice(index, 1);
    setProfile({ ...profile, socialLinks: newLinks.length ? newLinks : [{ platform: '', url: '' }] });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">
          {isNewProfile ? 'Create Your Profile' : 'Edit Your Profile'}
        </h1>
        
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-6 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            {isNewProfile && (
              <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-md">
                Welcome! Create your profile to get started.
              </div>
            )}
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            {saveMessage && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md">
                {saveMessage}
              </div>
            )}
            
            {/* Bio */}
            <div className="mb-6">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Tell others about yourself..."
              />
            </div>
            
            {/* Hobbies */}
            <div className="mb-6">
              <label htmlFor="hobbies" className="block text-sm font-medium text-gray-700 mb-1">
                Hobbies & Interests (comma-separated)
              </label>
              <input
                type="text"
                id="hobbies"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={profile.hobbies}
                onChange={(e) => setProfile({ ...profile, hobbies: e.target.value })}
                placeholder="coding, reading, hiking, etc."
              />
            </div>
            
            {/* Theme */}
            <div className="mb-6">
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                Profile Theme
              </label>
              <select
                id="theme"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={profile.theme}
                onChange={(e) => setProfile({ ...profile, theme: e.target.value })}
              >
                <option value="default">Default</option>
                <option value="dark">Dark</option>
                <option value="colorful">Colorful</option>
                <option value="minimalist">Minimalist</option>
                <option value="professional">Professional</option>
              </select>
            </div>
            
            {/* Social Links */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Social Links
              </label>
              
              {profile.socialLinks.map((link, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={link.platform}
                    onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                    placeholder="Platform (e.g. Twitter, GitHub)"
                  />
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={link.url}
                    onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                    placeholder="URL"
                  />
                  <button
                    type="button"
                    onClick={() => removeSocialLink(index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                  >
                    ✕
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addSocialLink}
                className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                + Add Link
              </button>
            </div>
            
            {/* Custom HTML */}
            <div className="mb-6">
              <label htmlFor="customHtml" className="block text-sm font-medium text-gray-700 mb-1">
                Custom HTML (Advanced)
              </label>
              <textarea
                id="customHtml"
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={profile.customHtml}
                onChange={(e) => setProfile({ ...profile, customHtml: e.target.value })}
                placeholder="<div>Your custom HTML here</div>"
              />
              <p className="text-xs text-gray-500 mt-1">
                Be careful with this field - invalid HTML may break your profile page.
              </p>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isSaving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSaving ? 'Saving...' : isNewProfile ? 'Create Profile' : 'Save Profile'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 