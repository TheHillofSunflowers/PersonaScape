// Global type declarations for the app

// Define types for image URL arguments
declare namespace React {
  interface CSSProperties {
    [key: string]: string | number | undefined;
  }
}

// Simplified environment variables declaration
declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
  }
}

// Helper for API responses
interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: Record<string, unknown>;
}

// API utility types
type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
}; 