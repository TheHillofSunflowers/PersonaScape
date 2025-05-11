"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import LikeButton from "@/components/LikeButton";
import ViewCount from "@/components/ViewCount";
import { recordProfileView } from "@/lib/views-api";
import Image from "next/image";

interface SocialLink {
  platform: string;
  url: string;
}

interface Profile {
  id: number;
  userId: number;
  username: string;
  bio: string;
  hobbies: string | null;
  socialLinks: SocialLink[] | null;
  theme: string;
  customHtml?: string | null;
  likesCount: number;
  viewsCount: number;
  profilePicture?: string | null;
}

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get<Profile>(`/profile/${username}`);
        console.log('Profile data received:', response.data);
        setProfile(response.data);
        
        // Record the profile view
        if (response.data.id) {
          const updatedViewCount = await recordProfileView(username);
          // Update the view count if different from initial fetch
          if (updatedViewCount !== response.data.viewsCount) {
            setProfile(prev => prev ? {...prev, viewsCount: updatedViewCount} : null);
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  // Split hobbies string into array for display
  const hobbiesArray = profile.hobbies ? profile.hobbies.split(',').map(h => h.trim()) : [];

  // Check if there are any social links
  const hasSocialLinks = profile.socialLinks && profile.socialLinks.length > 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 mr-4 flex-shrink-0">
              {profile.profilePicture ? (
                <Image 
                  src={profile.profilePicture} 
                  alt={`${profile.username}'s profile picture`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500 font-bold text-xl">
                  {profile.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{profile.username}</h1>
              <div className="flex items-center mt-1 space-x-4">
                <ViewCount count={profile.viewsCount || 0} size="md" />
              </div>
            </div>
          </div>
          <LikeButton 
            profileId={profile.id} 
            initialLikesCount={profile.likesCount || 0}
            size="lg"
            username={profile.username}
          />
        </div>
        
        <p className="text-gray-600 mb-4">{profile.bio}</p>
        
        {hobbiesArray.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Hobbies</h2>
            <div className="flex flex-wrap gap-2">
              {hobbiesArray.map((hobby, index) => (
                <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {hasSocialLinks && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Social Links</h2>
            <div className="flex gap-4">
              {profile.socialLinks?.map((link, index) => (
                <a 
                  key={index}
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-500 hover:underline"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          </div>
        )}

        {profile.customHtml && (
          <div 
            className="mt-4"
            dangerouslySetInnerHTML={{ __html: profile.customHtml }}
          />
        )}
      </div>
    </div>
  );
} 