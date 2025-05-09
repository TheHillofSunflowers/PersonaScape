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
    user: {
      findUnique: (args: any) => Promise<User | null>;
      findFirst: (args: any) => Promise<User | null>;
      findMany: (args?: any) => Promise<User[]>;
      create: (args: any) => Promise<User>;
      update: (args: any) => Promise<User>;
      delete: (args: any) => Promise<User>;
      upsert: (args: any) => Promise<User>;
      count: (args?: any) => Promise<number>;
    };
    profile: {
      findUnique: (args: any) => Promise<Profile | null>;
      findFirst: (args: any) => Promise<Profile | null>;
      findMany: (args?: any) => Promise<Profile[]>;
      create: (args: any) => Promise<Profile>;
      update: (args: any) => Promise<Profile>;
      delete: (args: any) => Promise<Profile>;
      upsert: (args: any) => Promise<Profile>;
      count: (args?: any) => Promise<number>;
    };
    profileLike: {
      findUnique: (args: any) => Promise<ProfileLike | null>;
      findFirst: (args: any) => Promise<ProfileLike | null>;
      findMany: (args?: any) => Promise<ProfileLike[]>;
      create: (args: any) => Promise<ProfileLike>;
      update: (args: any) => Promise<ProfileLike>;
      delete: (args: any) => Promise<ProfileLike>;
      upsert: (args: any) => Promise<ProfileLike>;
      count: (args?: any) => Promise<number>;
    };
  }
} 