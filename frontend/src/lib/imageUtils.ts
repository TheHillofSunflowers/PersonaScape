/**
 * Utility functions for handling image URLs in the application
 */

/**
 * Ensures an image URL is properly formatted for use in the frontend
 */
export function getImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  // Convert HTTP to HTTPS for our backend URLs, ensuring secure connections
  if (url.startsWith('http://personascape.onrender.com')) {
    return url.replace('http://', 'https://');
  }
  
  // If the URL is already an absolute URL with https, return it as is
  if (url.startsWith('https://')) {
    return url;
  }
  
  // If it's a relative URL from backend (starts with /uploads), make it absolute with HTTPS
  if (url.startsWith('/uploads')) {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://personascape.onrender.com';
    return `${baseURL}${url}`;
  }
  
  // Default case, return the URL as is
  return url;
}

/**
 * Creates a CSS background-image value from a URL
 */
export function getBackgroundImageStyle(url: string | null | undefined): { backgroundImage?: string } {
  const safeUrl = getImageUrl(url);
  return safeUrl ? { backgroundImage: `url('${safeUrl}')` } : {};
} 