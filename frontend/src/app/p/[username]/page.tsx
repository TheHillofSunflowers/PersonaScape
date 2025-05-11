"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";

interface Profile {
  username: string;
  bio: string;
  hobbies: string | null;
  socialLinks: {
    github?: string | null;
    twitter?: string | null;
    linkedin?: string | null;
  } | null;
  theme: string;
  customHtml?: string | null;
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

  // Check if there are any non-null social links
  const hasSocialLinks = profile.socialLinks && Object.values(profile.socialLinks).some(link => link !== null);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{profile.username}</h1>
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
              {profile.socialLinks?.github && (
                <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  GitHub
                </a>
              )}
              {profile.socialLinks?.twitter && (
                <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  Twitter
                </a>
              )}
              {profile.socialLinks?.linkedin && (
                <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  LinkedIn
                </a>
              )}
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