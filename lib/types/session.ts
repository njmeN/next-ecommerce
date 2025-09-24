

export type SessionUser = {
    id: string;
    email: string;
    username: string;
    role: string;
    address?: string;
    isOAuth?: boolean;
  };

  
 export type SessionContextType = {
    user: SessionUser | null;
    setUser: (user: SessionUser) => void;
    status: "loading" | "authenticated" | "unauthenticated";
  };
  
  export type AddressActionState = {
    ok: boolean;
    message?: string;
    errors?: Record<string, string[]>;
  };
  