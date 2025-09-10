import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface NextAuthConfig {
    trustedHosts?: string[];
  }
  
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      role: string;
      address?: string;
      isOAuth?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    username: string;
    role: string;
    address?: string;
    password?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    username: string;
    role: string;
    address?: string;
    isOAuth?: boolean;
  }
}
