"use client";

import Link from "next/link";
import Image from "next/image";
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
          ? "border-b border-zinc-200/80 bg-white/80 shadow-[0_8px_40px_rgba(0,0,0,0.05)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur"
        >
          <Image
            src="/logo.png"
            alt="Spendora"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
            priority
          />
          <span className="text-sm font-semibold tracking-tight text-zinc-950">
            Spendora
          </span>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-zinc-200 bg-white/75 px-2 py-2 shadow-sm backdrop-blur md:flex">
          {NAV_LINKS.map(
            (link) => (
              <a
                key={
                  link.label
                }
                href={
                  link.href
                }
                className="rounded-full px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
              >
                {
                  link.label
                }
              </a>
            )
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="https://github.com/Krushnaapatil/spendora"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-100"
          >
            GitHub
          </a>

          <Link
            href="/audit/new"
            className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-zinc-800"
          >
            Run Free Audit
          </Link>

          {user ? (
            <>
              <Link
                href="/audits"
                className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
              >
                Dashboard
              </Link>

              <button
                onClick={handleSignOut}
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login?mode=login&next=/audits"
                className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
              >
                Login
              </Link>

              <Link
                href="/login?mode=signup&next=/audits"
                className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
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
          className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white/80 shadow-sm backdrop-blur md:hidden"
        >
          <div className="space-y-1">
            <div className="h-[2px] w-5 bg-zinc-900" />
            <div className="h-[2px] w-5 bg-zinc-900" />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}

      {mobileMenuOpen ? (
        <div className="border-t border-zinc-200 bg-white/95 shadow-2xl backdrop-blur md:hidden">
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
                  className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-700"
                >
                  {
                    link.label
                  }
                </a>
              )
            )}

            <Link
              href="/audit/new"
              className="mt-2 rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white"
            >
              Run Free Audit
            </Link>

            {user ? (
              <div className="mt-2 flex gap-2">
                <Link
                  href="/audits"
                  className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleSignOut}
                  className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="mt-2 flex gap-2">
                <Link
                  href="/login?mode=login&next=/audits"
                  className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700"
                >
                  Login
                </Link>

                <Link
                  href="/login?mode=signup&next=/audits"
                  className="rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white"
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
