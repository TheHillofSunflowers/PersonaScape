// Node.js global type definitions
declare namespace NodeJS {
  interface Process {
    env: {
      [key: string]: string | undefined;
      NODE_ENV?: 'development' | 'production';
      PORT?: string;
      DATABASE_URL?: string;
      JWT_SECRET?: string;
    };
    exit(code?: number): never;
  }
  
  interface Global {
    console: Console;
  }
}

// Global variables
declare const process: NodeJS.Process;
declare const console: Console;
declare const __dirname: string;
declare const __filename: string;
declare function require(id: string): any;

// Console type for global use
interface Console {
  log(...data: any[]): void;
  error(...data: any[]): void;
  warn(...data: any[]): void;
  info(...data: any[]): void;
  debug(...data: any[]): void;
}

// Basic module declarations for common Node.js imports
declare module 'fs' {
  export function readFileSync(path: string, options?: { encoding?: string; flag?: string } | string): string | Buffer;
  export function existsSync(path: string): boolean;
  export function writeFileSync(path: string, data: string | Buffer, options?: { encoding?: string; flag?: string } | string): void;
}

declare module 'path' {
  export function join(...paths: string[]): string;
  export function resolve(...paths: string[]): string;
  export function dirname(path: string): string;
  export function basename(path: string, ext?: string): string;
  export function extname(path: string): string;
}

declare module 'dotenv' {
  export function config(options?: { path?: string }): void;
}

// Express module with complete types
declare module 'express' {
  export default function express(): any;
  
  export type Request = {
    userId?: string;
    path?: string;
    method?: string;
    headers?: any;
    params?: any;
    body?: any;
    query?: any;
  };
  
  export type Response = {
    status(code: number): Response;
    json(data: any): Response;
    send(data: any): Response;
    cookie(name: string, value: string, options?: any): Response;
  };
  
  export type NextFunction = (err?: any) => void;
  
  export type Express = {
    use: (...args: any[]) => any;
    listen: (port: number, callback?: () => void) => any;
    get: (path: string, ...handlers: any[]) => any;
    post: (path: string, ...handlers: any[]) => any;
    put: (path: string, ...handlers: any[]) => any;
    delete: (path: string, ...handlers: any[]) => any;
  };
  
  export interface Router {
    use: (...args: any[]) => Router;
    get: (path: string, ...handlers: any[]) => Router;
    post: (path: string, ...handlers: any[]) => Router;
    put: (path: string, ...handlers: any[]) => Router;
    delete: (path: string, ...handlers: any[]) => Router;
  }
  
  export function Router(): Router;
  export function json(options?: any): any;
  export function urlencoded(options?: any): any;
  export function static(root: string, options?: any): any;
}

declare module 'cors' {
  function cors(options?: any): any;
  export = cors;
}

declare module 'bcryptjs' {
  export function hash(data: string, salt: string | number): Promise<string>;
  export function compare(data: string, encrypted: string): Promise<boolean>;
}

declare module 'jsonwebtoken' {
  export function sign(payload: any, secret: string, options?: any): string;
  export function verify(token: string, secret: string, options?: any): any;
} 