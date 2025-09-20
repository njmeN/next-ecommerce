"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { SessionContextType, SessionUser } from "../types/session";

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email,
        username: session.user.username,
        role: session.user.role,
        address: session.user.address,
        isOAuth: session.user.isOAuth,
      });
    } else if (status === "unauthenticated") {
      
      setUser(null);
    }
  }, [session?.user, status]);

  return (
    <SessionContext.Provider value={{ user, setUser, status }}>
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
