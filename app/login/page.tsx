import { Suspense } from "react";

import LoginContent from "./login-content";

interface LoginPageProps {
  searchParams?: Promise<{
    mode?: string;
    auditId?: string;
    next?: string;
  }>;
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const params = searchParams
    ? await searchParams
    : {};

  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#FAFAF8] px-6 py-20">
          <div className="mx-auto max-w-md">
            <div className="rounded-[32px] border border-zinc-200 bg-white p-10 shadow-sm">
              <p className="text-zinc-600">
                Loading authentication...
              </p>
            </div>
          </div>
        </main>
      }
      >
      <LoginContent
        initialMode={
          params.mode === "signup"
            ? "signup"
            : "login"
        }
        auditId={params.auditId ?? ""}
        redirectTo={params.next ?? "/audits"}
      />
    </Suspense>
  );
}
