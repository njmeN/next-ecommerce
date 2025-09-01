// lib/contexts/session-context.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { SessionUser } from "../types/session";

type SessionContextType = {
  user: SessionUser | null;
  setUser: (user: SessionUser) => void;
  status: "loading" | "authenticated" | "unauthenticated";
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    console.log("useSession().user in provider:", session?.user); 
    if (status === "authenticated" && session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email,
        username: session.user.username,
        role: session.user.role,
        address: session.user.address,
        isOAuth: session.user.isOAuth,
      });
    }
  }, [session?.user, status]); 

  return (
    <SessionContext.Provider value={{ user, setUser , status}}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessionContext must be used within SessionProvider");
  }
  return context;
}
