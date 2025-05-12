/**
 * Utility functions for handling profile themes
 */

type ThemeColors = {
  bgPrimary: string;
  bgSecondary: string;
  bgAccent: string;
  textPrimary: string;
  textSecondary: string;
  accentColor: string;
  borderColor: string;
  highlightColor: string;
  cardBg: string;
  cardBorder: string;
};

type ThemeConfig = {
  colors: ThemeColors;
  cardStyle: string;
  containerStyle: string;
  headingStyle: string;
  interestsStyle: string;
  socialLinksStyle: string;
};

// Define theme configurations
const themes: Record<string, ThemeConfig> = {
  default: {
    colors: {
      bgPrimary: 'bg-[#16171d]',
      bgSecondary: 'bg-[#23242b]',
      bgAccent: 'bg-[#2a2b33]',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-300',
      accentColor: 'text-blue-400',
      borderColor: 'border-[#32333c]',
      highlightColor: 'text-blue-300',
      cardBg: 'bg-[#2a2b33]',
      cardBorder: 'border-[#32333c]',
    },
    cardStyle: 'rounded-lg shadow-lg backdrop-blur-sm',
    containerStyle: 'py-8',
    headingStyle: 'text-xl font-semibold mb-4 text-white',
    interestsStyle: 'px-3 py-1 bg-[#2a2b33] rounded-full text-sm text-blue-300 border border-blue-800/30',
    socialLinksStyle: 'px-4 py-2 bg-[#2a2b33] rounded-lg text-sm text-blue-300 border border-[#32333c] hover:bg-[#32333d] transition-colors',
  },
  dark: {
    colors: {
      bgPrimary: 'bg-black',
      bgSecondary: 'bg-[#111]',
      bgAccent: 'bg-[#222]',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-400',
      accentColor: 'text-purple-500',
      borderColor: 'border-gray-800',
      highlightColor: 'text-purple-400',
      cardBg: 'bg-[#1a1a1a]',
      cardBorder: 'border-gray-800',
    },
    cardStyle: 'rounded-xl shadow-xl',
    containerStyle: 'py-10',
    headingStyle: 'text-xl font-bold mb-4 text-white',
    interestsStyle: 'px-3 py-1 bg-[#222] rounded-full text-sm text-purple-400 border border-purple-900/30',
    socialLinksStyle: 'px-4 py-2 bg-[#222] rounded-lg text-sm text-purple-400 border border-gray-800 hover:bg-[#2a2a2a] transition-colors',
  },
  minimal: {
    colors: {
      bgPrimary: 'bg-white',
      bgSecondary: 'bg-white',
      bgAccent: 'bg-gray-50',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-600',
      accentColor: 'text-gray-900',
      borderColor: 'border-gray-200',
      highlightColor: 'text-black',
      cardBg: 'bg-gray-50',
      cardBorder: 'border-gray-200',
    },
    cardStyle: 'rounded-none shadow-sm',
    containerStyle: 'py-10',
    headingStyle: 'text-lg font-medium mb-4 text-gray-900 uppercase tracking-wider',
    interestsStyle: 'px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 border border-gray-200',
    socialLinksStyle: 'px-4 py-2 bg-gray-100 rounded-none text-sm text-gray-700 border-b-2 border-gray-300 hover:bg-gray-200 transition-colors',
  },
  colorful: {
    colors: {
      bgPrimary: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900',
      bgSecondary: 'bg-[#2d1b69]/90',
      bgAccent: 'bg-[#3a1f8f]/80',
      textPrimary: 'text-white',
      textSecondary: 'text-pink-100',
      accentColor: 'text-pink-400',
      borderColor: 'border-indigo-700',
      highlightColor: 'text-yellow-300',
      cardBg: 'bg-[#3a1f8f]/60',
      cardBorder: 'border-indigo-600/50',
    },
    cardStyle: 'rounded-2xl shadow-2xl backdrop-blur-md',
    containerStyle: 'py-10',
    headingStyle: 'text-xl font-bold mb-4 text-pink-300',
    interestsStyle: 'px-3 py-1 bg-indigo-800/60 rounded-full text-sm text-pink-300 border border-pink-600/30',
    socialLinksStyle: 'px-4 py-2 bg-indigo-800/60 rounded-xl text-sm text-pink-300 border border-indigo-600/50 hover:bg-indigo-700/60 transition-colors',
  },
};

/**
 * Get theme configuration based on theme name
 */
export function getThemeConfig(themeName: string = 'default'): ThemeConfig {
  return themes[themeName] || themes.default;
}

/**
 * Get profile container class based on the theme
 */
export function getProfileContainerClass(theme: string = 'default', hasBackgroundImage: boolean = false): string {
  const themeConfig = getThemeConfig(theme);
  
  // Base container class
  let containerClass = `min-h-screen ${themeConfig.colors.textPrimary} ${themeConfig.containerStyle}`;
  
  // Apply background color only if there's no background image
  if (!hasBackgroundImage) {
    containerClass += ` ${themeConfig.colors.bgPrimary}`;
  } else {
    // For background images, we want to ensure good text contrast
    containerClass += ' bg-gradient-to-b from-transparent to-black/20';
  }
  
  // Add backdrop blur only if there's a background image
  if (hasBackgroundImage && theme !== 'minimal') {
    containerClass += ' backdrop-blur-sm';
  }
  
  return containerClass;
}

/**
 * Get profile card class based on the theme
 */
export function getProfileCardClass(theme: string = 'default', hasBackgroundImage: boolean = false): string {
  const themeConfig = getThemeConfig(theme);
  
  // Base card class
  let cardClass = `${themeConfig.cardStyle} p-8 ${themeConfig.colors.borderColor}`;
  
  // Add conditional styling based on background image
  if (hasBackgroundImage) {
    if (theme === 'colorful') {
      cardClass += ` ${themeConfig.colors.bgSecondary} border`;
    } else if (theme === 'minimal') {
      cardClass += ` ${themeConfig.colors.bgSecondary}/95 border`;
    } else {
      cardClass += ` ${themeConfig.colors.bgSecondary}/80 border`;
    }
  } else {
    cardClass += ` ${themeConfig.colors.bgSecondary} border`;
  }
  
  return cardClass;
}

/**
 * Get heading style based on theme
 */
export function getHeadingClass(theme: string = 'default'): string {
  const themeConfig = getThemeConfig(theme);
  return themeConfig.headingStyle;
}

/**
 * Get interest badge style based on theme
 */
export function getInterestBadgeClass(theme: string = 'default'): string {
  const themeConfig = getThemeConfig(theme);
  return themeConfig.interestsStyle;
}

/**
 * Get social link style based on theme
 */
export function getSocialLinkClass(theme: string = 'default'): string {
  const themeConfig = getThemeConfig(theme);
  return themeConfig.socialLinksStyle;
}

/**
 * Get component background based on theme
 */
export function getComponentBgClass(theme: string = 'default'): string {
  const themeConfig = getThemeConfig(theme);
  return `${themeConfig.colors.cardBg} ${themeConfig.colors.borderColor} border rounded-lg`;
}

/**
 * Get text color for primary text
 */
export function getPrimaryTextClass(theme: string = 'default'): string {
  const themeConfig = getThemeConfig(theme);
  return themeConfig.colors.textPrimary;
}

/**
 * Get text color for secondary text
 */
export function getSecondaryTextClass(theme: string = 'default'): string {
  const themeConfig = getThemeConfig(theme);
  return themeConfig.colors.textSecondary;
}

/**
 * Get accent color for highlights
 */
export function getAccentColorClass(theme: string = 'default'): string {
  const themeConfig = getThemeConfig(theme);
  return themeConfig.colors.accentColor;
}

/**
 * Get highlight color class
 */
export function getHighlightColorClass(theme: string = 'default'): string {
  const themeConfig = getThemeConfig(theme);
  return themeConfig.colors.highlightColor;
} 