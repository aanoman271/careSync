import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import { UserRole } from "@/Models/User";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: UserRole;
      fullName?: string | null; // Standardize to fullName
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    fullName?: string | null; // Standardize to fullName
    email?: string | null;
    role?: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: UserRole;
    fullName?: string | null; // Standardize to fullName
  }
}
