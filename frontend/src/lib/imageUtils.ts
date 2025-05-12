/**
 * Utility functions for handling image URLs in the application
 */

/**
 * Ensures an image URL is properly formatted for use in the frontend
 */
export function getImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  // If the URL is already an absolute URL (http:// or https://), return it as is
  // Don't convert HTTP to HTTPS as it can cause issues with local development or different environments
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a relative URL from backend (starts with /uploads), make it absolute
  if (url.startsWith('/uploads')) {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://personascape.onrender.com';
    return `${baseURL}${url}`;
  }
  
  // Default case, return the URL as is
  return url;
}

/**
 * Get a style object for a background image with fallback and proper URL handling
 */
export function getBackgroundImageStyle(url: string | null | undefined): React.CSSProperties {
  const imageUrl = getImageUrl(url);
  
  if (!imageUrl) {
    return {};
  }
  
  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    height: '100%',
    width: '100%',
  };
}

/**
 * Gets image props for Next.js Image component
 */
export function getImageProps(url: string | null | undefined): {
  src: string;
  crossOrigin: "anonymous";
} | Record<string, never> {
  const safeUrl = getImageUrl(url);
  return safeUrl 
    ? { 
        src: safeUrl,
        crossOrigin: "anonymous"
      } 
    : {};
}

/**
 * Safely encodes a username for use in URLs
 * Preserves spaces and special characters by properly encoding them
 * Avoids double-encoding already encoded strings
 */
export function encodeUsername(username: string): string {
  // If the string already contains encoded characters (like %20),
  // assume it's already encoded and return it as is
  if (username.includes('%')) {
    return username;
  }
  
  // Preserve trailing spaces by explicitly encoding them
  if (username.endsWith(' ')) {
    return username.slice(0, -1) + '%20';
  }
  
  // Use encodeURIComponent for all other cases
  return encodeURIComponent(username);
} 