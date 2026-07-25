import { Bookmark, Clock3, Folder, Tag, Users } from "lucide-react";

const sections = [
  { title: "Recently Saved", icon: Bookmark, items: ["Spring Boot API Generator", "Senior Code Reviewer", "Product Strategy Copilot"] },
  { title: "Recently Used", icon: Clock3, items: ["Technical Documentation Writer", "Backend Interview Simulator"] },
  { title: "Saved Categories", icon: Tag, items: ["Programming · 18", "Writing · 11", "Business · 8"] },
  { title: "Top Authors", icon: Users, items: ["Đức Nguyễn", "Maya Chen", "Alex Morgan"] },
  { title: "Suggested Collections", icon: Folder, items: ["Backend Essentials", "Daily Writing Toolkit", "Product Leadership"] },
];

export function SavedSidebar() {
  return (
    <aside className="space-y-3">
      {sections.map(({ title, icon: Icon, items }) => (
        <section key={title} className="rounded-2xl border border-white/[.07] bg-[#161b22] p-4">
          <h2 className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.12em] text-slate-500"><Icon className="size-3.5 text-emerald-400" />{title}</h2>
          <div className="mt-3 space-y-1">
            {items.map((item) => <button key={item} type="button" className="block w-full truncate rounded-lg px-2 py-2 text-left text-[11px] text-slate-500 transition hover:bg-white/[.04] hover:text-slate-200">{item}</button>)}
          </div>
        </section>
      ))}
    </aside>
  );
}
