'use client';

import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Add isAuthenticated property for easier checks
  return {
    ...context,
    isAuthenticated: !!context.user
  };
};

export default useAuth; 