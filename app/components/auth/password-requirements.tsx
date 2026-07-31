import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { passwordChecks } from "@/lib/password-validation";

export function PasswordRequirements({ password }: { password: string }) {
  const requirements = [
    ["At least 8 characters", passwordChecks.length(password)],
    ["One uppercase letter", passwordChecks.uppercase(password)],
    ["One lowercase letter", passwordChecks.lowercase(password)],
    ["One number", passwordChecks.number(password)],
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-1.5 rounded-lg border border-white/[.07] bg-[#0d1117]/70 p-3 min-[420px]:grid-cols-2">
      {requirements.map(([label, met]) => (
        <div key={label} className={cn("flex items-center gap-1.5 text-[11px]", met ? "text-emerald-400" : "text-slate-600")}>
          {met ? <Check className="size-3.5" /> : <Circle className="size-3" />}
          {label}
        </div>
      ))}
    </div>
  );
}
