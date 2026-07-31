import type { ReactNode } from "react";
import { Logo } from "@/components/layout/logo";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
  wide?: boolean;
}

export function AuthLayout({ title, description, children, footer, wide = false }: AuthLayoutProps) {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#0d1117] px-4 py-8 text-slate-200 sm:px-6 sm:py-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-16rem] size-[34rem] -translate-x-1/2 rounded-full bg-violet-600/[.09] blur-3xl" />
        <div className="absolute bottom-[-18rem] right-[-12rem] size-[32rem] rounded-full bg-indigo-500/[.05] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,rgba(13,17,23,.52)_68%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100dvh-4rem)] w-full items-center justify-center sm:min-h-[calc(100dvh-6rem)]">
        <div className={wide ? "w-full max-w-[480px]" : "w-full max-w-[440px]"}>
          <a
            href="/"
            aria-label="PromptHub home"
            className="mx-auto mb-7 flex w-fit rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-violet-500/70"
          >
            <Logo />
          </a>

          <section className="rounded-2xl border border-white/[.09] bg-[#161b22]/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,.38)] backdrop-blur sm:p-8">
            <header className="mb-7 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-[28px]">{title}</h1>
              <p className="mt-2 text-sm text-slate-500">{description}</p>
            </header>
            {children}
          </section>

          <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>
          <p className="mt-8 text-center text-[11px] text-slate-700">Secure access to your PromptHub workspace</p>
        </div>
      </div>
    </main>
  );
}
