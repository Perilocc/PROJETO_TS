import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    token?: string;
    papel?: string;
  }

  interface Session {
    user: {
      id: string;
      token: string;
      papel: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    token?: string;
    papel?: string;
  }
}
