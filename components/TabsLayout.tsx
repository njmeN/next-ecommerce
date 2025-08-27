'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
import { clsx } from "clsx"; 
import { ReactNode } from "react";
import {
  Users,
  Wrench,
  PackageSearch,
  KeyRound,
  LogOut,
  CircleUser,
  MapPinHouse,
  Logs,
  LayoutDashboard,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useSessionContext } from "@/lib/contexts/session-context";

export default function TabsLayout({
  children,
  isAdmin,
}: {
  children: ReactNode;
  isAdmin: boolean;
}) {
  const pathname = usePathname();
  const { user } = useSessionContext();

  return (
    <section className="accounts section__lg">
      <div className="accounts__container container grid">
        <aside className="account__tabs">
          <Link
            href="/account"
            className={clsx("account__tab", {
              "active-tab": pathname === "/account",
            })}
          >
            <LayoutDashboard /> Dashboard
          </Link>

          <Link
            href="/account/orders"
            className={clsx("account__tab", {
              "active-tab": pathname === "/account/orders",
            })}
          >
            <Logs /> Orders
          </Link>

          <Link
            href="/account/address"
            className={clsx("account__tab", {
              "active-tab": pathname === "/account/address",
            })}
          >
            <MapPinHouse /> Shipping Address
          </Link>

          <Link
            href="/account/update-profile"
            className={clsx("account__tab", {
              "active-tab": pathname === "/account/update-profile",
            })}
          >
            <CircleUser /> Update Profile
          </Link>

          {!user?.isOAuth && (
            <Link
              href="/account/change-password"
              className={clsx("account__tab", {
                "active-tab": pathname === "/account/change-password",
              })}
            >
              <KeyRound /> Change Password
            </Link>
          )}

          {isAdmin && (
            <>
              <Link
                href="/account/admin/all-orders"
                className={clsx("account__tab", {
                  "active-tab": pathname === "/account/admin/all-orders",
                })}
              >
                <PackageSearch /> All Orders
              </Link>

              <Link
                href="/account/admin/products"
                className={clsx("account__tab", {
                  "active-tab": pathname === "/account/admin/products",
                })}
              >
                <Wrench /> Edit Products
              </Link>

              <Link
                href="/account/admin/users-list"
                className={clsx("account__tab", {
                  "active-tab": pathname === "/account/admin/users-list",
                })}
              >
                <Users /> Users & Admins
              </Link>
            </>
          )}

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className={clsx("account__tab", {
              "active-tab": pathname === "/account/signOut",
            })}
          >
            <LogOut /> Sign Out
          </button>
        </aside>

        <div className="tabs__content">{children}</div>
      </div>
    </section>
  );
}
