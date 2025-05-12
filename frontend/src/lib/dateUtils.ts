/**
 * Date and time utility functions for the application
 */

/**
 * Formats a date as a relative time string (e.g. "2 hours ago")
 * @param dateString ISO date string or Date object
 * @returns Formatted relative time string
 */
export function formatRelativeTime(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // Define time units in seconds
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;
  
  // Return appropriate relative time string
  if (diffInSeconds < 30) {
    return 'just now';
  } else if (diffInSeconds < minute) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 2 * minute) {
    return 'a minute ago';
  } else if (diffInSeconds < hour) {
    return `${Math.floor(diffInSeconds / minute)} minutes ago`;
  } else if (diffInSeconds < 2 * hour) {
    return 'an hour ago';
  } else if (diffInSeconds < day) {
    return `${Math.floor(diffInSeconds / hour)} hours ago`;
  } else if (diffInSeconds < 2 * day) {
    return 'yesterday';
  } else if (diffInSeconds < week) {
    return `${Math.floor(diffInSeconds / day)} days ago`;
  } else if (diffInSeconds < 2 * week) {
    return 'a week ago';
  } else if (diffInSeconds < month) {
    return `${Math.floor(diffInSeconds / week)} weeks ago`;
  } else if (diffInSeconds < 2 * month) {
    return 'a month ago';
  } else if (diffInSeconds < year) {
    return `${Math.floor(diffInSeconds / month)} months ago`;
  } else if (diffInSeconds < 2 * year) {
    return 'a year ago';
  } else {
    return `${Math.floor(diffInSeconds / year)} years ago`;
  }
}

/**
 * Format date to a standard readable format
 * @param dateString ISO date string or Date object
 * @returns Formatted date string (e.g. "Jan 1, 2023")
 */
export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format a date to show full date and time
 * @param dateString ISO date string or Date object 
 * @returns Formatted date and time string (e.g. "Jan 1, 2023, 12:00 PM")
 */
export function formatDateTime(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
} 