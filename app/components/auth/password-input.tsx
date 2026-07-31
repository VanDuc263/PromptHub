import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
}

export function PasswordInput({ label, error, id, className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const inputId = id ?? props.name;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div>
      <label htmlFor={inputId} className="mb-2 block text-xs font-medium text-slate-300">{label}</label>
      <div className="relative">
        <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-600" />
        <input
          {...props}
          id={inputId}
          type={visible ? "text" : "password"}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={cn("auth-input px-10", error && "auth-input-error", className)}
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-600 outline-none transition hover:bg-white/[.05] hover:text-slate-300 focus-visible:ring-2 focus-visible:ring-violet-500/70"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {error && <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
