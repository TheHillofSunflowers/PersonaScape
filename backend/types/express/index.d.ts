// Type definitions for Express
import * as core from 'express-serve-static-core';

declare global {
  namespace Express {
    export interface Request {
      userId?: string;
    }
  }
}

declare module 'express' {
  export interface Request extends core.Request {}
  export interface Response extends core.Response {}
  export interface NextFunction extends core.NextFunction {}
  export interface RequestHandler extends core.RequestHandler {}
  export interface Router extends core.Router {}
  
  export function Router(options?: core.RouterOptions): core.Router;
  export function json(options?: any): core.RequestHandler;
  export function static(root: string, options?: core.ServeStaticOptions): core.RequestHandler;
}

export = express;
export as namespace express;

declare const express: express.Express;