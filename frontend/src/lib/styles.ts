/**
 * Common styling utility functions and constants for consistent component styling
 */

// Card container styles
export const cardStyles = {
  default: "bg-white dark:bg-accent-800 rounded-xl shadow-card hover:shadow-lg transition-all p-6",
  flat: "bg-white dark:bg-accent-800 rounded-xl p-6",
  hover: "bg-white dark:bg-accent-800 rounded-xl shadow-card hover:shadow-lg transition-all p-6 hover:bg-accent-50 dark:hover:bg-accent-700/50",
  bordered: "bg-white dark:bg-accent-800 rounded-xl shadow-card border border-accent-200 dark:border-accent-700 p-6",
};

// Button styles
export const buttonStyles = {
  primary: "px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors shadow-button",
  secondary: "px-4 py-2 bg-secondary-600 text-white rounded-md hover:bg-secondary-700 transition-colors shadow-button",
  outline: "px-4 py-2 bg-transparent border border-primary-600 text-primary-600 dark:text-primary-400 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors shadow-button",
  accent: "px-4 py-2 bg-accent-600 text-white rounded-md hover:bg-accent-700 transition-colors shadow-button",
  ghost: "px-4 py-2 bg-transparent text-accent-600 dark:text-accent-400 hover:bg-accent-100 dark:hover:bg-accent-800 rounded-md transition-colors",
  danger: "px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors shadow-button",
  link: "text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors hover:underline",
};

// Text styles
export const textStyles = {
  heading: {
    h1: "text-4xl md:text-5xl font-heading font-bold text-accent-800 dark:text-white",
    h2: "text-3xl md:text-4xl font-heading font-bold text-accent-800 dark:text-white",
    h3: "text-2xl font-heading font-bold text-accent-800 dark:text-white",
    h4: "text-xl font-heading font-semibold text-accent-800 dark:text-white",
  },
  gradient: "bg-gradient-to-r from-primary-600 to-secondary-600 text-transparent bg-clip-text",
  body: "text-accent-700 dark:text-accent-200",
  muted: "text-accent-500 dark:text-accent-400",
};

// Input styles
export const inputStyles = {
  default: "w-full px-4 py-2 text-accent-700 dark:text-white bg-white dark:bg-accent-800 border border-accent-200 dark:border-accent-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors",
  search: "w-full px-4 py-2 pl-10 text-accent-700 dark:text-white bg-white dark:bg-accent-800 border border-accent-200 dark:border-accent-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors",
};

// Avatar/image styles
export const avatarStyles = {
  default: "rounded-full object-cover shadow-soft",
  placeholder: "rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shadow-soft text-primary-600 dark:text-primary-400 font-semibold",
};

// Badge/tag styles
export const badgeStyles = {
  primary: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300",
  secondary: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-300",
  success: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  warning: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  error: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

// Animation classes
export const animationStyles = {
  fadeIn: "animate-fade-in",
  slideUp: "animate-slide-up",
  pulse: "animate-pulse-slow",
};

// Layout styles
export const layoutStyles = {
  container: "container mx-auto px-4 max-w-7xl",
  section: "py-12 md:py-16",
  grid: {
    cols2: "grid grid-cols-1 md:grid-cols-2 gap-6",
    cols3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    cols4: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
  },
}; 