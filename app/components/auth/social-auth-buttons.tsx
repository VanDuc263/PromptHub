import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
      <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.6h3.3c1.9-1.8 3-4.4 3-7.5Z" />
      <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.3l-3.3-2.6c-.9.6-2.1 1-3.4 1a5.9 5.9 0 0 1-5.5-4.1H3.1v2.6A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.5 14a6 6 0 0 1 0-3.9V7.4H3.1a10 10 0 0 0 0 9.2L6.5 14Z" />
      <path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.8A9.7 9.7 0 0 0 3.1 7.4l3.4 2.7A5.9 5.9 0 0 1 12 5.9Z" />
    </svg>
  );
}

export function SocialAuthButtons({ onProvider }: { onProvider: (provider: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button type="button" variant="secondary" onClick={() => onProvider("Google")} className="w-full">
        <GoogleIcon /> Google
      </Button>
      <Button type="button" variant="secondary" onClick={() => onProvider("GitHub")} className="w-full">
        <Github className="size-4" /> GitHub
      </Button>
    </div>
  );
}

export function AuthDivider({ children }: { children: string }) {
  return (
    <div className="my-6 flex items-center gap-3" aria-hidden="true">
      <div className="h-px flex-1 bg-white/[.08]" />
      <span className="text-[11px] uppercase tracking-wider text-slate-600">{children}</span>
      <div className="h-px flex-1 bg-white/[.08]" />
    </div>
  );
}
