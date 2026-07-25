import {
  BadgeDollarSign,
  Braces,
  Eye,
  Gauge,
  Globe2,
  Languages,
  Scale,
} from "lucide-react";
import { motion } from "framer-motion";
import { PromptCover } from "@/components/explore/prompt-cover";
import { Badge } from "@/components/ui/badge";
import { communityPrompts } from "@/data/explore-data";
import { publicPrompt } from "@/data/public-prompt-data";

const explorePrompt = communityPrompts.find((prompt) => prompt.title === publicPrompt.title)!;

export function PromptHeroCard() {
  const metadata = [
    { label: "Difficulty", value: publicPrompt.difficulty, icon: Gauge },
    { label: "Estimated tokens", value: publicPrompt.estimatedTokens, icon: Braces },
    { label: "Execution cost", value: publicPrompt.estimatedCost, icon: BadgeDollarSign },
    { label: "Language", value: publicPrompt.language, icon: Languages },
    { label: "Version", value: publicPrompt.version, icon: Globe2 },
    { label: "Visibility", value: publicPrompt.visibility, icon: Eye },
    { label: "License", value: publicPrompt.license, icon: Scale },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-white/[.07] bg-[#161b22]"
    >
      <PromptCover prompt={explorePrompt} large />
      <div className="grid grid-cols-2 gap-px bg-white/[.06] sm:grid-cols-4 xl:grid-cols-7">
        {metadata.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-[#161b22] p-4">
              <Icon className="size-3.5 text-emerald-400" />
              <p className="mt-2 text-[9px] text-slate-700">{item.label}</p>
              <p className="mt-1 text-[11px] font-medium text-slate-300">{item.value}</p>
            </div>
          );
        })}
        <div className="flex items-center bg-[#161b22] p-4 sm:hidden">
          <Badge className="border-emerald-500/15 bg-emerald-500/[.05] text-emerald-300">Community</Badge>
        </div>
      </div>
    </motion.section>
  );
}
