"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-black/10 dark:border-white/10">
      <Link href="/" className="font-semibold text-lg">
        Furniture Buyer
      </Link>
      <div className="flex items-center gap-4 text-sm">
        {status === "loading" ? null : session ? (
          <>
            <Link href="/orders" className="hover:underline">
              My Orders
            </Link>
            <span>{session.user.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="rounded bg-black/5 dark:bg-white/10 px-3 py-1.5 hover:bg-black/10 dark:hover:bg-white/20"
            >
              Log out
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="rounded bg-black text-white dark:bg-white dark:text-black px-3 py-1.5"
          >
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
}
