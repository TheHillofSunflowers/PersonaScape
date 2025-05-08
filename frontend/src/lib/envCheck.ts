/**
 * Utility to standardize API URL handling across the application
 */

// Ensure the API base URL is properly formatted
export const getApiBaseUrl = (): string => {
  let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  
  // Trim trailing slashes to avoid path issues
  baseUrl = baseUrl.replace(/\/+$/, '');
  
  console.log('Using API base URL:', baseUrl);
  return baseUrl;
};

// Format endpoint URL with the API base
export const formatApiUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl();
  
  // Ensure endpoint starts with a slash
  let formattedEndpoint = endpoint;
  if (!formattedEndpoint.startsWith('/')) {
    formattedEndpoint = '/' + formattedEndpoint;
  }
  
  // IMPORTANT: Check if the endpoint already starts with /api/ 
  // and if the baseUrl already includes /api
  if (formattedEndpoint.startsWith('/api/') && baseUrl.endsWith('/api')) {
    // Remove the duplicate /api from the beginning of the endpoint
    formattedEndpoint = formattedEndpoint.substring(4); // Remove '/api'
    console.warn('Potential duplicate /api detected and fixed:', endpoint, '→', formattedEndpoint);
  }
  
  // Detect and fix duplicate /api/api paths
  if (formattedEndpoint.startsWith('/api/api/')) {
    console.warn('Duplicate /api/api/ in endpoint detected and fixed:', endpoint);
    formattedEndpoint = formattedEndpoint.replace('/api/api/', '/api/');
  }
  
  // Build the full URL
  const fullUrl = baseUrl + formattedEndpoint;
  
  // One final check for duplicate /api/api
  if (fullUrl.includes('/api/api/')) {
    const fixedUrl = fullUrl.replace('/api/api/', '/api/');
    console.warn('Final URL contained duplicate /api/api/ paths - fixed:', fullUrl, '→', fixedUrl);
    return fixedUrl;
  }
  
  return fullUrl;
};

// Initialize and check environment
export const initEnv = (): void => {
  console.log('Environment check:');
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  console.log('- API Base URL:', getApiBaseUrl());
  console.log('- Running in browser:', typeof window !== 'undefined');
  
  // Test URL formatting to ensure it works properly
  const testUrls = [
    '/api/test-cors',
    'api/test-cors',
    '/api/auth/signup',
    '/test-cors'
  ];
  
  console.log('\nURL formatting test:');
  testUrls.forEach(url => {
    console.log(`${url} → ${formatApiUrl(url)}`);
  });
};

// Run the check
initEnv(); 