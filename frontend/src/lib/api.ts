import axios, { AxiosInstance } from 'axios';

// Get properly formatted API base URL
const baseURL = 'http://localhost:5000';
console.log('API client initialized with base URL:', baseURL);

// Add debugging for network issues
const debugNetworkIssues = async () => {
  try {
    console.log('Attempting to verify connectivity with a simple fetch request...');
    const testUrl = baseURL + '/api/test-cors';
    console.log('Testing connection to:', testUrl);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache'
    });
    const data = await response.json();
    console.log('Fetch API direct connection succeeded:', data);
    return true;
  } catch (error) {
    console.error('Fetch API direct connection failed:', error);
    return false;
  }
};

// Debug connectivity on startup
debugNetworkIssues();

// Create API client with standard configuration
const api = axios.create({
  baseURL,
  // Enable credentials for auth requests
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add longer timeout for debugging
  timeout: 15000
}) as AxiosInstance & {
  testConnection: () => Promise<{ success: boolean, data?: any, error?: any, message?: string }>
};

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Log all requests for debugging
  console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses
    console.log(`✅ API Response: ${response.status} ${response.statusText}`);
    return response;
  },
  (error) => {
    // Log errors for debugging
    console.error('❌ API Error:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      console.error('No response received', error.request);
      console.error('Maybe the backend is not running or not accessible.');
      console.error('Try accessing http://localhost:5000/test.html in your browser to diagnose the issue.');
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

// Add a test method to quickly check connectivity
api.testConnection = async () => {
  try {
    // Test with direct fetch for reliability
    const testUrl = baseURL + '/api/test-cors';
    console.log('Testing direct connection to:', testUrl);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Connection test successful!', data);
    
    return { success: true, data: data };
  } catch (error) {
    console.error('Connection test failed', error);
    return { 
      success: false, 
      error: error,
      message: 'Connection test failed. Please check if the backend is running and accessible.'
    };
  }
};

export default api;