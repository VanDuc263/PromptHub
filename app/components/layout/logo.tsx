import { cn } from "@/lib/utils";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={cn(
          "h-8 shrink-0 rounded-lg bg-no-repeat",
          compact ? "w-8" : "w-[138px]",
        )}
        style={{
          backgroundImage: "url('/promptLogo.png')",
          backgroundPosition: compact ? "-14.5px -19px" : "-10.3px -19px",
          backgroundSize: "155.7px 71.3px",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
