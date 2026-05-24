"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase-browser";
import {
  NAV_LINKS,
} from "@/data/landing";

interface NavbarProps {
  hasScrolled: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (
    value: boolean
  ) => void;
}

export default function Navbar({
  hasScrolled,
  mobileMenuOpen,
  setMobileMenuOpen,
}: NavbarProps) {
  const router = useRouter();

  const supabase = useMemo(() => createClient(), []);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;
        setUser(data.user ?? null);
      } catch {
        if (!mounted) return;
        setUser(null);
      }
    }

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        setUser(session?.user ?? null);
      }
    );

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        hasScrolled
          ? "border-b border-zinc-200 bg-white/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}

        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-zinc-950"
        >
          Spendora
        </Link>

        {/* Desktop Nav */}

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(
            (link) => (
              <a
                key={
                  link.label
                }
                href={
                  link.href
                }
                className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950"
              >
                {
                  link.label
                }
              </a>
            )
          )}
        </nav>

        {/* Desktop CTA */}

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="https://github.com/Krushnaapatil/spendora"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            GitHub
          </a>

          <Link
            href="/audit/new"
            className="rounded-xl bg-zinc-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Run Free Audit
          </Link>

          {user ? (
            <>
              <Link
                href="/audits"
                className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
              >
                Dashboard
              </Link>

              <button
                onClick={handleSignOut}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login?mode=login&next=/audits"
                className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
              >
                Login
              </Link>

              <Link
                href="/login?mode=signup&next=/audits"
                className="rounded-xl bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}

        <button
          onClick={() =>
            setMobileMenuOpen(
              !mobileMenuOpen
            )
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 md:hidden"
        >
          <div className="space-y-1">
            <div className="h-[2px] w-5 bg-zinc-900" />
            <div className="h-[2px] w-5 bg-zinc-900" />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}

      {mobileMenuOpen ? (
        <div className="border-t border-zinc-200 bg-white md:hidden">
          <div className="flex flex-col gap-5 px-6 py-6">
            {NAV_LINKS.map(
              (link) => (
                <a
                  key={
                    link.label
                  }
                  href={
                    link.href
                  }
                  className="text-sm font-medium text-zinc-700"
                >
                  {
                    link.label
                  }
                </a>
              )
            )}

            <Link
              href="/audit/new"
              className="mt-2 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white"
            >
              Run Free Audit
            </Link>

            {user ? (
              <div className="mt-2 flex gap-2">
                <Link
                  href="/audits"
                  className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleSignOut}
                  className="rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="mt-2 flex gap-2">
                <Link
                  href="/login?mode=login&next=/audits"
                  className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700"
                >
                  Login
                </Link>

                <Link
                  href="/login?mode=signup&next=/audits"
                  className="rounded-xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
