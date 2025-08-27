// lib/types/session.ts

export type SessionUser = {
    id: string;
    email: string;
    username: string;
    role: string;
    address?: string;
    isOAuth?: boolean;
  };
  