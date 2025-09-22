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
  const segments = pathname.split("/").filter(Boolean);


  return (
    <section className="accounts ">
       <section className="breadcrumb">
      <ul className="breadcrumb__list flex container">
        <li>
          <Link href="/" className="breadcrumb__link">
            Home
          </Link>
        </li>

        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;

          return (
            <li key={href} className="breadcrumb__link">
              <span>{" > "} </span>
              {isLast ? (
                <span>{segment}</span>
              ) : (
                <Link href={href}>{segment}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
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
                href="/account/all-orders"
                className={clsx("account__tab", {
                  "active-tab": pathname === "/account/all-orders",
                })}
              >
                <PackageSearch /> All Orders
              </Link>

              <Link
                href="/account/products"
                className={clsx("account__tab", {
                  "active-tab": pathname === "/account/products",
                })}
              >
                <Wrench /> Edit Products
              </Link>

              <Link
                href="/account/users-list"
                className={clsx("account__tab", {
                  "active-tab": pathname === "/account/users-list",
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

        <div className="tabs__content container">{children}</div>
      </div>
    </section>
  );
}
