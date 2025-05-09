// Type definitions for Express
import * as core from 'express-serve-static-core';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      path?: string;
      method?: string;
      headers?: any;
      params?: any;
      body?: any;
      query?: any;
    }
  }
}

declare module 'express' {
  // Core exports
  export interface Request extends core.Request {}
  export interface Response extends core.Response {}
  export interface NextFunction extends core.NextFunction {}
  export interface RequestHandler extends core.RequestHandler {}
  export interface Router extends core.Router {}
  export interface Express extends core.Express {}
  export interface Application extends core.Application {}
  
  // Main export
  export default function express(): core.Express;
  
  // Functions
  export function Router(options?: core.RouterOptions): core.Router;
  export function json(options?: any): core.RequestHandler;
  export function urlencoded(options?: any): core.RequestHandler;
  export function static(root: string, options?: core.ServeStaticOptions): core.RequestHandler;
}