// Global type declarations for the app

// Define types for image URL arguments
declare namespace React {
  interface CSSProperties {
    [key: string]: string | number | undefined;
  }
}

// Add types for environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_API_BASE_URL: string;
    NEXT_PUBLIC_IMGBB_API_KEY: string;
    NEXT_PUBLIC_JWT_COOKIE_NAME: string;
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