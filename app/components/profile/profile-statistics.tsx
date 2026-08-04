import { motion } from "framer-motion";
import { profileStats } from "@/data/profile-data";

export function ProfileStatistics({ followerDelta = 0, statistics = profileStats }: { followerDelta?: number; statistics?: typeof profileStats }) {
  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-3 2xl:grid-cols-6">
      {statistics.map((stat, index) => {
        const Icon = stat.icon;
        const value = stat.label === "Followers" && followerDelta ? "3.2K+" : stat.value;
        return (
          <motion.article
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.035 }}
            className="rounded-2xl border border-white/[.07] bg-[#161b22] p-4 transition hover:-translate-y-0.5 hover:border-white/[.12]"
          >
            <div className="flex items-center justify-between">
              <Icon className="size-4 text-violet-400" />
              {stat.change && <span className="text-[8px] text-emerald-400">{stat.change}</span>}
            </div>
            <p className="mt-4 text-2xl font-semibold tracking-[-.04em] text-slate-100">{value}</p>
            <p className="mt-1.5 text-[10px] text-slate-600">{stat.label}</p>
          </motion.article>
        );
      })}
    </section>
  );
}
