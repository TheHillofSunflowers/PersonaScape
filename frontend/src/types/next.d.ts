import { ReactNode } from 'react';

// Extend Next.js types to fix the params issue in layouts
declare module 'next' {
  export interface LayoutProps {
    children: ReactNode;
    params?: any; // This allows params to be optional and of any type
  }
} 