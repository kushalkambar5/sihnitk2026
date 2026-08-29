import { DefaultSession, DefaultUser } from 'next-auth';
import { UserRole } from '@/types';

declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    isActive?: boolean;
    isEmailVerified?: boolean;
    accessToken?: string;
    refreshToken?: string;
  }

  interface Session {
    user: User & DefaultSession['user'];
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: UserRole;
    accessToken?: string;
    refreshToken?: string;
    user?: any;
  }
}
