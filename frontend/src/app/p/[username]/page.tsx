"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import LikeButton from "@/components/LikeButton";
import ViewCount from "@/components/ViewCount";
import CommentSection from "@/components/CommentSection";
import { recordProfileView } from "@/lib/views-api";
import Image from "next/image";
import Link from "next/link";

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
    return (
      <div className="min-h-screen bg-[#16171d] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
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
                className="text-gray-400 hover:text-white transition"
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
          
          <div className="bg-[#23242b] rounded-xl p-8 border border-[#32333c] shadow-lg">
            <div className="p-4 rounded-md bg-red-900/20 border border-red-800 text-red-400">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
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
                className="text-gray-400 hover:text-white transition"
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
          
          <div className="bg-[#23242b] rounded-xl p-8 border border-[#32333c] shadow-lg">
            <div className="p-4 text-center">
              <p className="text-gray-400">Profile not found</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Split hobbies string into array for display
  const hobbiesArray = profile.hobbies ? profile.hobbies.split(',').map(h => h.trim()) : [];

  // Check if there are any social links
  const hasSocialLinks = profile.socialLinks && profile.socialLinks.length > 0;

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
              className="text-gray-400 hover:text-white transition"
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
        
        <div className="bg-[#23242b] rounded-xl p-8 border border-[#32333c] shadow-lg mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
            <div className="flex items-center">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-[#2a2b33] mr-6 flex-shrink-0 border border-[#32333c]">
                {profile.profilePicture ? (
                  <Image 
                    src={profile.profilePicture} 
                    alt={`${profile.username}'s profile picture`}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#3a3b44] text-blue-300 font-bold text-3xl">
                    {profile.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{profile.username}</h1>
                <div className="flex items-center mt-2">
                  <ViewCount count={profile.viewsCount || 0} size="md" className="text-blue-400" />
                </div>
              </div>
            </div>
            <LikeButton 
              profileId={profile.id} 
              initialLikesCount={profile.likesCount || 0}
              size="lg"
              username={profile.username}
              className="text-pink-400"
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
            </div>
            
            {hobbiesArray.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3 text-white">Hobbies</h2>
                <div className="flex flex-wrap gap-2">
                  {hobbiesArray.map((hobby, index) => (
                    <span key={index} className="bg-[#2a2b33] px-3 py-1 rounded-md text-sm text-blue-300 border border-[#32333c]">
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {hasSocialLinks && (
              <div>
                <h2 className="text-xl font-semibold mb-3 text-white">Social Links</h2>
                <div className="flex gap-4 flex-wrap">
                  {profile.socialLinks?.map((link, index) => (
                    <a 
                      key={index}
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-400 hover:text-blue-300 transition bg-[#2a2b33] px-4 py-2 rounded-md border border-[#32333c]"
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {profile.customHtml && (
              <div 
                className="mt-6 p-4 bg-[#2a2b33] rounded-lg border border-[#32333c]"
                dangerouslySetInnerHTML={{ __html: profile.customHtml }}
              />
            )}
          </div>
        </div>
        
        {/* Add the Comment Section */}
        <div className="bg-[#23242b] rounded-xl p-8 border border-[#32333c] shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-white">Comments</h2>
          <CommentSection profileId={profile.id} />
        </div>
      </div>
    </div>
  );
} 