// Global type declarations for all backend modules

declare namespace Express {
  interface Request {
    userId?: string;
    path?: string;
    method?: string;
    headers?: any;
    params?: any;
    body?: any;
    query?: any;
    originalUrl?: string;
    baseUrl?: string;
    protocol?: string;
    hostname?: string;
    ip?: string;
    get?: (header: string) => string | undefined;
    socket?: any;
  }
}

// Express module declaration
declare module 'express' {
  // Export the express function
  function express(): express.Application;
  namespace express {
    // Basic interface definitions
    export interface Request extends Express.Request {
      [key: string]: any;
    }
    
    export interface Response {
      status(code: number): Response;
      json(body: any): Response;
      send(body: any): Response;
      cookie(name: string, value: string, options?: any): Response;
      end(): Response;
      redirect(url: string): Response;
      [key: string]: any;
    }
    
    export interface NextFunction {
      (err?: any): void;
    }
    
    // Application and Router
    export interface Application {
      use: (...args: any[]) => Application;
      listen: (port: number, callback?: () => void) => any;
      get: (path: string, ...handlers: any[]) => Application;
      post: (path: string, ...handlers: any[]) => Application;
      put: (path: string, ...handlers: any[]) => Application;
      delete: (path: string, ...handlers: any[]) => Application;
      all: (path: string, ...handlers: any[]) => Application;
      [key: string]: any;
    }
    
    export interface Router {
      use: (...args: any[]) => Router;
      get: (path: string, ...handlers: any[]) => Router;
      post: (path: string, ...handlers: any[]) => Router;
      put: (path: string, ...handlers: any[]) => Router;
      delete: (path: string, ...handlers: any[]) => Router;
      all: (path: string, ...handlers: any[]) => Router;
      [key: string]: any;
    }
    
    // Express methods
    export function Router(): Router;
    export function json(options?: any): any;
    export function urlencoded(options?: any): any;
    export function static(root: string, options?: any): any;
    
    // Request handler
    export interface RequestHandler {
      (req: Request, res: Response, next: NextFunction): any;
    }
  }
  
  // Export main function and namespace
  export = express;
}

// Other module declarations
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
  export function verify(token: string, secret: string): any;
}

declare module '@prisma/client' {
  export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    profile?: Profile;
    likes?: ProfileLike[];
  }

  export interface Profile {
    id: number;
    userId: number;
    bio?: string | null;
    hobbies?: string | null;
    socialLinks?: any;
    customHtml?: string | null;
    theme?: string | null;
    likesCount: number;
    User?: User;
    receivedLikes?: ProfileLike[];
  }

  export interface ProfileLike {
    id: number;
    profileId: number;
    userId: number;
    createdAt: Date;
    profile?: Profile;
    user?: User;
  }

  export class PrismaClient {
    user: any;
    profile: any;
    profileLike: any;
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
  }
} 