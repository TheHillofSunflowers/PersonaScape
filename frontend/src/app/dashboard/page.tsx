'use client';

import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

export default function DashboardPage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  
  // Profile state
  const [profile, setProfile] = useState<ProfileData>({
    bio: '',
    hobbies: [],
    socialLinks: [],
    theme: 'default'
  });
  
  // Form state
  const [newHobby, setNewHobby] = useState('');
  const [newSocialPlatform, setNewSocialPlatform] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');
  
  // Load profile data
  useEffect(() => {
    if (!user) return;
    
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use direct hardcoded URL for fetching profile
        const response = await fetch(`http://localhost:5000/api/profile/${user.username}`);
        
        if (response.ok) {
          const data = await response.json();
          
          // Check if data is null or undefined
          if (!data) {
            console.log('Profile data is null, using default empty profile');
            // Keep default profile state
          } else {
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
                // Convert object format to array format
                socialLinksArray = Object.entries(data.socialLinks).map(([platform, url]) => ({
                  platform,
                  url: url as string
                }));
              }
            }
            
            console.log('Setting profile with processed data:', {
              bio: data.bio || '',
              hobbies: hobbiesArray,
              socialLinks: socialLinksArray,
              theme: data.theme || 'default',
              customHtml: data.customHtml || ''
            });
            
            setProfile({
              ...data,
              bio: data.bio || '',
              theme: data.theme || 'default',
              hobbies: hobbiesArray,
              socialLinks: socialLinksArray,
              customHtml: data.customHtml || ''
            });
          }
          
          // Set share URL
          const baseUrl = window.location.origin;
          setShareUrl(`${baseUrl}/p/${user.username}`);
        } else if (response.status === 404) {
          // New user, no profile yet - this is expected for new users
          console.log('Profile not found (404), using default empty profile for new user');
          // The default empty profile is already set in the initial state
          
          // Still set the share URL for new users
          const baseUrl = window.location.origin;
          setShareUrl(`${baseUrl}/p/${user.username}`);
          
          // No need to set an error for this expected case
        } else {
          // Try to get error message from response
          let errorMsg = `Failed to fetch profile: ${response.status}`;
          try {
            const errorData = await response.json();
            if (errorData && errorData.error) {
              errorMsg = errorData.error;
            }
          } catch (e) {
            // If we can't parse the response, just use the default error message
          }
          throw new Error(errorMsg);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data. Please try again. Error: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);
  
  // Save profile data
  const saveProfile = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // Format data to match backend schema
      // hobbies should be a string in the format the backend expects
      // socialLinks should be a JSON object
      const profileToSave = {
        ...profile,
        bio: profile.bio || '',
        theme: profile.theme || 'default',
        // Convert hobbies array to comma-separated string
        hobbies: Array.isArray(profile.hobbies) ? profile.hobbies.join(', ') : '',
        // Leave socialLinks as an array - the backend will handle it as JSON
        socialLinks: profile.socialLinks,
        customHtml: profile.customHtml || ''
      };
      
      console.log('Saving profile with data:', profileToSave);
      
      const token = localStorage.getItem('token');
      console.log('Using token from localStorage:', token ? `${token.substring(0, 10)}...` : 'No token found');
      
      if (!token) {
        throw new Error('Authentication token is missing. Please log in again.');
      }
      
      // Use direct hardcoded URL instead of using any dynamic or configured value
      console.log('Making PUT request to: http://localhost:5000/api/profile/');
      const response = await fetch('http://localhost:5000/api/profile/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileToSave)
      });
      
      console.log('Profile save response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        
        console.log('Profile save successful, response data:', data);
        
        if (data) {
          // Parse hobbies from string back to array
          let hobbiesArray: string[] = [];
          if (data.hobbies) {
            if (typeof data.hobbies === 'string') {
              hobbiesArray = data.hobbies.split(',').map((h: string) => h.trim());
            } else if (Array.isArray(data.hobbies)) {
              hobbiesArray = data.hobbies;
            }
          }
          
          // Parse socialLinks which might be stored as JSON in the database
          let socialLinksArray: {platform: string, url: string}[] = [];
          if (data.socialLinks) {
            if (Array.isArray(data.socialLinks)) {
              socialLinksArray = data.socialLinks;
            } else if (typeof data.socialLinks === 'object' && data.socialLinks !== null) {
              // Convert object format to array format
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
        }
        
        setSuccess('Profile saved successfully!');
        
        // Set share URL if not already set
        if (!shareUrl) {
          const baseUrl = window.location.origin;
          setShareUrl(`${baseUrl}/p/${user.username}`);
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        // Try to get error message from response
        let errorMsg = `Failed to save profile: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorMsg = errorData.error;
          }
        } catch (e) {
          // If we can't parse the response, just use the default error message
        }
        throw new Error(errorMsg);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile. Please try again. Error: ' + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };
  
  // Handle hobby changes
  const addHobby = () => {
    if (!newHobby.trim()) return;
    setProfile(prev => ({
      ...prev,
      hobbies: [...prev.hobbies, newHobby.trim()]
    }));
    setNewHobby('');
  };
  
  const removeHobby = (index: number) => {
    setProfile(prev => ({
      ...prev,
      hobbies: prev.hobbies.filter((_, i) => i !== index)
    }));
  };
  
  // Handle social link changes
  const addSocialLink = () => {
    if (!newSocialPlatform.trim() || !newSocialUrl.trim()) return;
    
    setProfile(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, {
        platform: newSocialPlatform.trim(),
        url: newSocialUrl.trim()
      }]
    }));
    
    setNewSocialPlatform('');
    setNewSocialUrl('');
  };
  
  const removeSocialLink = (index: number) => {
    setProfile(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };
  
  // Copy share URL to clipboard
  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setSuccess('Share link copied to clipboard!');
        setTimeout(() => setSuccess(null), 3000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        setError('Failed to copy share link.');
      });
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto my-10 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My PersonaScape</h1>
          {shareUrl && (
            <div className="flex items-center space-x-2">
              <Link 
                href={`/p/${user?.username}`}
                target="_blank"
                className="text-blue-500 hover:text-blue-700 underline"
              >
                View Public Profile
              </Link>
              <button
                onClick={copyShareUrl}
                className="bg-gray-100 hover:bg-gray-200 px-3 py-1 text-sm rounded"
              >
                Copy Share Link
              </button>
            </div>
          )}
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <p className="text-green-700">{success}</p>
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading your profile...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Profile info */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    value={user?.username || ''}
                    className="w-full p-2 border rounded bg-gray-50"
                    disabled
                  />
                  <p className="text-sm text-gray-500 mt-1">Username cannot be changed</p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    className="w-full p-2 border rounded resize-y min-h-[100px]"
                    placeholder="Tell others about yourself..."
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Theme</label>
                  <select
                    value={profile.theme}
                    onChange={(e) => setProfile({...profile, theme: e.target.value})}
                    className="w-full p-2 border rounded"
                  >
                    <option value="default">Default</option>
                    <option value="dark">Dark</option>
                    <option value="colorful">Colorful</option>
                    <option value="minimalist">Minimalist</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Custom HTML (Advanced)</label>
                  <textarea
                    value={profile.customHtml || ''}
                    onChange={(e) => setProfile({...profile, customHtml: e.target.value})}
                    className="w-full p-2 border rounded font-mono text-sm resize-y min-h-[100px]"
                    placeholder="Add custom HTML here (optional)..."
                  />
                  <p className="text-sm text-gray-500 mt-1">Use this to add custom elements to your profile page</p>
                </div>
              </div>
            </div>
            
            {/* Right column - Hobbies and social links */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Hobbies & Interests</h2>
                
                <div className="mb-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newHobby}
                      onChange={(e) => setNewHobby(e.target.value)}
                      className="flex-1 p-2 border rounded"
                      placeholder="Add a hobby..."
                    />
                    <button
                      onClick={addHobby}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                <ul className="space-y-2">
                  {profile.hobbies.map((hobby, index) => (
                    <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      <span>{hobby}</span>
                      <button
                        onClick={() => removeHobby(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
                
                {profile.hobbies.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No hobbies added yet.</p>
                )}
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Social Links</h2>
                
                <div className="mb-4 space-y-2">
                  <input
                    type="text"
                    value={newSocialPlatform}
                    onChange={(e) => setNewSocialPlatform(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Platform (e.g. Twitter, Instagram)"
                  />
                  <input
                    type="text"
                    value={newSocialUrl}
                    onChange={(e) => setNewSocialUrl(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="URL (include https://)"
                  />
                  <button
                    onClick={addSocialLink}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add Social Link
                  </button>
                </div>
                
                <ul className="space-y-2">
                  {profile.socialLinks.map((link, index) => (
                    <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      <div>
                        <span className="font-medium">{link.platform}</span>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="block text-blue-500 text-sm truncate max-w-[200px]">
                          {link.url}
                        </a>
                      </div>
                      <button
                        onClick={() => removeSocialLink(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
                
                {profile.socialLinks.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No social links added yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 flex justify-end">
          <button
            onClick={saveProfile}
            disabled={saving || loading}
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
