import { Express } from 'express';
import * as express from 'express';

// Global type augmentation for Express
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

declare module 'express' {
  // Add Router type
  export interface Router extends express.IRouter {}
  export function Router(options?: RouterOptions): Router;
  
  // Add custom Express interface to help with app typing
  export interface Express extends express.Application {}
}

// Export an empty object to make this a valid module
export {}; 