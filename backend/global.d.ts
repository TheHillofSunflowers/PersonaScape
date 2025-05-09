// Node.js global type definitions
declare namespace NodeJS {
  interface Process {
    env: {
      [key: string]: string | undefined;
      NODE_ENV?: 'development' | 'production';
      PORT?: string;
      DATABASE_URL?: string;
      JWT_SECRET?: string;
    }
  }
  interface Global {
    console: Console;
  }
}

// Console type for global use
interface Console {
  log(...data: any[]): void;
  error(...data: any[]): void;
  warn(...data: any[]): void;
  info(...data: any[]): void;
}

// Basic module declarations for common Node.js imports
declare module 'fs' {
  export function readFileSync(path: string, options?: { encoding?: string; flag?: string } | string): string | Buffer;
  export function existsSync(path: string): boolean;
}

declare module 'path' {
  export function join(...paths: string[]): string;
  export function resolve(...paths: string[]): string;
}

declare module 'dotenv' {
  export function config(options?: { path?: string }): void;
} 