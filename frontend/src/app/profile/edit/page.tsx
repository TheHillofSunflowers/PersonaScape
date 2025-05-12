'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

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
  profilePicture?: string | null;
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
    profilePicture: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
              customHtml: response.data.customHtml || '',
              profilePicture: response.data.profilePicture || null,
            });
            
            // Set the preview URL if there's a profile picture
            if (response.data.profilePicture) {
              setPreviewUrl(response.data.profilePicture);
            }
          }
        } catch {
          // If profile doesn't exist yet, we'll just use the default empty profile
          console.log('Creating new profile as none exists yet');
          
          // Default profile is already set in the initial state, so we don't need to do anything
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setImageFile(null);
      setPreviewUrl(profile.profilePicture || null);
      return;
    }
    
    const file = e.target.files[0];
    setImageFile(file);
    
    // Create a preview URL for the image
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
  };

  const uploadImage = async (file: File): Promise<string> => {
    // This uses a public image hosting service for demo purposes
    // In production, you would use a more secure storage solution
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      // Using ImgBB as a demo image hosting service
      // Get API key from environment variable or use a fallback
      const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '8b694df8ad4f44e950e115166611eb7e';
      formData.append('key', imgbbApiKey);
      
      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        console.error('ImgBB API error:', response.status, response.statusText);
        throw new Error(`Failed to upload image: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        return data.data.url;
      } else {
        console.error('ImgBB upload failed:', data);
        throw new Error(data.error?.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

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
      
      // Upload image if there's a new image file
      let profilePictureUrl = profile.profilePicture;
      
      if (imageFile) {
        try {
          profilePictureUrl = await uploadImage(imageFile);
        } catch (err) {
          console.error('Failed to upload profile picture:', err);
          setError('Failed to upload profile picture. Profile not saved.');
          setIsSaving(false);
          return;
        }
      }
      
      const profileData = {
        ...profile,
        hobbies: hobbiesArray,
        socialLinks: socialLinks.length > 0 ? socialLinks : null,
        profilePicture: profilePictureUrl
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
      } catch (apiError: unknown) {
        console.error('API Error details:', apiError);
        if (apiError instanceof Error && apiError.message === 'Network Error') {
          setError('Network error. This could be caused by CORS or server connectivity issues. Please try again.');
        } else if (apiError && typeof apiError === 'object' && 'response' in apiError && apiError.response) {
          const errorResponse = apiError.response as {status: number, data?: {error?: string}};
          setError(`Error: ${errorResponse.status} - ${errorResponse.data?.error || 'Unknown error'}`);
        } else if (apiError instanceof Error) {
          setError(`Failed to save profile: ${apiError.message}`);
        } else {
          setError('An unknown error occurred');
        }
      }
      
    } catch {
      console.error('Error in form submission:');
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

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-[#16171d] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#16171d] text-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="flex justify-between items-center mb-10">
          <Link 
            href="/"
            className="text-2xl font-semibold text-blue-400 hover:text-blue-300 transition"
          >
            PersonaScape
          </Link>
          <nav className="flex space-x-6 text-sm">
            <Link 
              href="/leaderboard"
              className="text-gray-400 hover:text-white transition"
            >
              Leaderboard
            </Link>
            <Link 
              href="/dashboard"
              className="text-gray-400 hover:text-white transition"
            >
              Dashboard
            </Link>
            <Link 
              href="/profile"
              className="text-blue-400 font-medium border-b-2 border-blue-400 pb-1"
            >
              My Profile
            </Link>
            <Link 
              href="/logout"
              className="text-gray-400 hover:text-white transition"
            >
              Log Out
            </Link>
          </nav>
        </header>
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Edit Your Profile</h1>
          <p className="text-gray-400">
            Customize your profile to show the world who you are.
          </p>
        </div>

        <div className="bg-[#23242b] rounded-xl p-6 border border-[#32333c] shadow-lg">
          {error && (
            <div className="mb-6 p-4 rounded-md bg-red-900/20 border border-red-800 text-red-400">
              {error}
            </div>
          )}
          
          {saveMessage && (
            <div className="mb-6 p-4 rounded-md bg-green-900/20 border border-green-800 text-green-400">
              {saveMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Profile Picture</h2>
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-32 h-32 bg-[#2a2b33] border border-[#32333c] rounded-lg overflow-hidden flex items-center justify-center">
                  {previewUrl ? (
                    <Image 
                      src={previewUrl} 
                      alt="Profile Preview" 
                      width={128} 
                      height={128} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-5xl">
                      {user?.username?.charAt(0).toUpperCase() || '?'}
                    </span>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <label className="block text-gray-300 text-sm font-medium">
                    Upload a new profile picture
                  </label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="block w-full text-gray-300 file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0 file:bg-blue-500 file:text-white
                      hover:file:bg-blue-600"
                  />
                  <p className="text-xs text-gray-400">
                    Recommended: Square image, at least 300x300 pixels.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Bio */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Bio</h2>
              <div>
                <label htmlFor="bio" className="block text-gray-300 text-sm font-medium mb-2">
                  Tell us about yourself
                </label>
                <textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={4}
                  className="w-full p-3 bg-[#2a2b33] border border-[#32333c] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Write something about yourself..."
                />
              </div>
            </div>
            
            {/* Hobbies */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Hobbies</h2>
              <div>
                <label htmlFor="hobbies" className="block text-gray-300 text-sm font-medium mb-2">
                  What do you enjoy? (comma separated)
                </label>
                <input
                  id="hobbies"
                  type="text"
                  value={profile.hobbies}
                  onChange={(e) => setProfile({ ...profile, hobbies: e.target.value })}
                  className="w-full p-3 bg-[#2a2b33] border border-[#32333c] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Gaming, Reading, Hiking"
                />
              </div>
            </div>
            
            {/* Social Links */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Social Links</h2>
              {profile.socialLinks.map((link, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    value={link.platform}
                    placeholder="Platform (e.g. Twitter)"
                    onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                    className="flex-1 p-3 bg-[#2a2b33] border border-[#32333c] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={link.url}
                    placeholder="URL"
                    onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                    className="flex-1 p-3 bg-[#2a2b33] border border-[#32333c] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeSocialLink(index)}
                    className="bg-red-500/20 text-red-400 hover:bg-red-500/30 p-3 rounded-md transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSocialLink}
                className="bg-[#2a2b33] hover:bg-[#32333c] text-gray-300 py-2 px-4 rounded-md transition-colors"
              >
                + Add Social Link
              </button>
            </div>
            
            {/* Theme Selection */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Profile Theme</h2>
              <div>
                <label htmlFor="theme" className="block text-gray-300 text-sm font-medium mb-2">
                  Choose a theme
                </label>
                <select
                  id="theme"
                  value={profile.theme}
                  onChange={(e) => setProfile({ ...profile, theme: e.target.value })}
                  className="w-full p-3 bg-[#2a2b33] border border-[#32333c] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="default">Default</option>
                  <option value="dark">Dark</option>
                  <option value="minimal">Minimal</option>
                  <option value="colorful">Colorful</option>
                </select>
              </div>
            </div>
            
            {/* Custom HTML */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Custom HTML</h2>
              <div>
                <label htmlFor="customHtml" className="block text-gray-300 text-sm font-medium mb-2">
                  Add custom HTML to your profile
                </label>
                <textarea
                  id="customHtml"
                  value={profile.customHtml}
                  onChange={(e) => setProfile({ ...profile, customHtml: e.target.value })}
                  rows={6}
                  className="w-full p-3 bg-[#2a2b33] border border-[#32333c] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="<div class='custom-section'>Your custom HTML here</div>"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Advanced: Add custom HTML to extend your profile&apos;s functionality.
                </p>
              </div>
            </div>
            
            {/* Save Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSaving || isUploading}
                className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors
                  ${isSaving || isUploading 
                    ? 'bg-blue-500/50 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600'}`}
              >
                {isSaving || isUploading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}