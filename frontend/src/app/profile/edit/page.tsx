'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import Image from 'next/image';

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
  const [isNewProfile, setIsNewProfile] = useState(true);
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
      // You should replace this with your own image storage solution in production
      const imgbbApiKey = 'YOUR_IMGBB_API_KEY'; // Replace with your API key
      formData.append('key', imgbbApiKey);
      
      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error('Failed to upload image');
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
            
            {/* Profile Picture Upload */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profilePicture">
                Profile Picture
              </label>
              
              <div className="flex items-center space-x-4">
                {/* Preview Image */}
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {previewUrl ? (
                    <Image 
                      src={previewUrl} 
                      alt="Profile picture preview" 
                      width={96} 
                      height={96} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>
                
                <div className="flex-1">
                  <input
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Upload a square image for best results. Maximum size: 5MB.
                  </p>
                  {isUploading && <p className="mt-1 text-xs text-blue-500">Uploading image...</p>}
                </div>
              </div>
            </div>
            
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