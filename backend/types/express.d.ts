import { Express } from 'express';

// Global type augmentation for Express
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// Export an empty object to make this a valid module
export {}; 