"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import LikeButton from "@/components/LikeButton";
import ViewCount from "@/components/ViewCount";
import CommentSection from "@/components/CommentSection";
import { recordProfileView } from "@/lib/views-api";
import { getBackgroundImageStyle, getImageUrl } from "@/lib/imageUtils";
import Image from "next/image";
import Link from "next/link";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import {
  getProfileContainerClass,
  getProfileCardClass,
  getHeadingClass,
  getInterestBadgeClass,
  getSocialLinkClass,
  getComponentBgClass
} from "@/lib/themeUtils";

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
  backgroundImage?: string | null;
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
        // Make sure the username is properly decoded from the URL
        // The username might already be decoded by Next.js, but we'll ensure it's handled correctly
        let decodedUsername = username;
        
        // If the username contains %20 (encoded space), decode it
        if (username.includes('%20')) {
          decodedUsername = decodeURIComponent(username);
        }
        
        console.log('Fetching profile for username:', decodedUsername, 'Original param:', username);
        
        try {
          const response = await api.get<Profile>(`/profile/${decodedUsername}`);
          console.log('Profile data received:', response.data);
          setProfile(response.data);
          
          // Record the profile view
          if (response.data.id) {
            const updatedViewCount = await recordProfileView(decodedUsername);
            // Update the view count if different from initial fetch
            if (updatedViewCount !== response.data.viewsCount) {
              setProfile(prev => prev ? {...prev, viewsCount: updatedViewCount} : null);
            }
          }
        } catch (error) {
          // First attempt failed, try with a trailing space if there isn't one
          // or without a trailing space if there is one
          console.log('First attempt failed, trying alternative username formats...');
          
          let alternativeUsername;
          if (decodedUsername.endsWith(' ')) {
            alternativeUsername = decodedUsername.trimEnd(); // Try without trailing spaces
            console.log('Trying without trailing spaces:', alternativeUsername);
          } else {
            alternativeUsername = decodedUsername + ' '; // Try with trailing space
            console.log('Trying with trailing space:', alternativeUsername);
          }
          
          try {
            const response = await api.get<Profile>(`/profile/${alternativeUsername}`);
            console.log('Profile found with alternative format:', response.data);
            setProfile(response.data);
            
            // Record the profile view
            if (response.data.id) {
              const updatedViewCount = await recordProfileView(alternativeUsername);
              if (updatedViewCount !== response.data.viewsCount) {
                setProfile(prev => prev ? {...prev, viewsCount: updatedViewCount} : null);
              }
            }
          } catch (secondError) {
            // Both attempts failed
            console.error("Error fetching profile with both formats:", secondError);
            setError("Failed to load profile");
          }
        }
      } catch (err) {
        console.error("Error in profile fetch logic:", err);
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
                href="/profile/edit"
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
                href="/profile/edit"
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
    <div className={getProfileContainerClass(profile.theme, !!profile.backgroundImage)}>
      {/* Background Image */}
      {profile.backgroundImage && (
        <div className="fixed inset-0 z-0">
          <img 
            src={getImageUrl(profile.backgroundImage)}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover opacity-75"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50"></div>
        </div>
      )}
      
      <div className="relative z-10 py-8">
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
                href="/profile/edit"
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

          <div className={getProfileCardClass(profile.theme, !!profile.backgroundImage)}>
            <div className="flex flex-col md:flex-row items-start justify-between mb-8 gap-6">
              <div className="flex items-center">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-[#2a2b33] mr-6 flex-shrink-0 border border-[#32333c]">
                  {profile.profilePicture ? (
                    <Image
                      src={profile.profilePicture}
                      alt={`${profile.username}'s profile picture`}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#3a3b44] text-blue-300 font-bold text-3xl">
                      {profile.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">
                    {profile.username}
                  </h1>
                  <div className="flex items-center text-gray-400 text-sm">
                    <ViewCount count={profile.viewsCount} />
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
            
            {/* Bio */}
            {profile.bio && (
              <div className="mb-8">
                <h2 className={getHeadingClass(profile.theme)}>About</h2>
                <div className={`p-4 ${getComponentBgClass(profile.theme)}`}>
                  <MarkdownRenderer content={profile.bio} />
                </div>
              </div>
            )}
            
            {/* Hobbies */}
            {hobbiesArray.length > 0 && (
              <div className="mb-8">
                <h2 className={getHeadingClass(profile.theme)}>Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {hobbiesArray.map((hobby, index) => (
                    <span 
                      key={index}
                      className={getInterestBadgeClass(profile.theme)}
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Social Links */}
            {hasSocialLinks && (
              <div className="mb-8">
                <h2 className={getHeadingClass(profile.theme)}>Connect</h2>
                <div className="flex flex-wrap gap-3">
                  {profile.socialLinks?.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={getSocialLinkClass(profile.theme)}
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {/* Custom HTML */}
            {profile.customHtml && (
              <div className="mb-8">
                <h2 className={getHeadingClass(profile.theme)}>Custom Content</h2>
                <div className={`p-4 ${getComponentBgClass(profile.theme)}`}>
                  <div dangerouslySetInnerHTML={{ __html: profile.customHtml }} />
                </div>
              </div>
            )}
            
            {/* Comments */}
            <div className="mt-12">
                <h2 className={getHeadingClass(profile.theme)}>Comments</h2>
                <CommentSection profileId={profile.id} theme={profile.theme} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 