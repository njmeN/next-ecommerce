// app/account/layout.tsx (server component)
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import TabsLayout from "@/components/TabsLayout"; 

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <TabsLayout isAdmin={session.user.role === "admin"}>
      {children}
    </TabsLayout>
  );
}
