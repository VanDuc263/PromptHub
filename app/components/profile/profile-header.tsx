import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Ban,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Ellipsis,
  ExternalLink,
  Github,
  Globe2,
  Link2,
  MapPin,
  MessageCircle,
  Pencil,
  Share2,
  ShieldAlert,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { creatorProfile } from "@/data/profile-data";

export function ProfileHeader({
  isOwner,
  following,
  notificationMode,
  onFollow,
  onNotificationMode,
  onMessage,
  onEdit,
  onShare,
  onAction,
}: {
  isOwner: boolean;
  following: boolean;
  notificationMode: string;
  onFollow: () => void;
  onNotificationMode: (mode: string) => void;
  onMessage: () => void;
  onEdit: () => void;
  onShare: () => void;
  onAction: (label: string) => void;
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-white/[.07] bg-[#161b22]"
    >


      <div className="px-5 pb-6 sm:px-7 pt-20">
        <div className="-mt-12 flex flex-col gap-5 lg:flex-row lg:items-start">
          <Avatar initials={creatorProfile.initials} className="size-24 border-4 border-[#161b22] bg-violet-500/20 text-xl text-violet-200 shadow-xl" />
          <div className="min-w-0 flex-1 pt-1 lg:pt-14">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-[-.03em] text-slate-50">{creatorProfile.name}</h1>
              <CheckCircle2 className="size-[17px] fill-emerald-400/10 text-emerald-400" aria-label="Verified creator" />
              <Badge className="border-emerald-500/15 bg-emerald-500/[.05] text-emerald-300">Verified Creator</Badge>
            </div>
            <p className="mt-1 text-xs text-slate-600">{creatorProfile.username}</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">{creatorProfile.bio}</p>
          </div>

          <div className="flex flex-wrap gap-2 lg:pt-14">
            {isOwner ? (
              <>
                <Button onClick={onEdit}><Pencil className="size-4" /> Edit profile</Button>
                <Button variant="secondary" onClick={onShare}><Share2 className="size-4" /> Share profile</Button>
              </>
            ) : (
              <>
                {following ? (
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <Button className="bg-emerald-500 text-[#07120b] hover:bg-emerald-400"><UserCheck className="size-4" /> Following <ChevronDown className="size-3.5" /></Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content align="end" sideOffset={7} className="dropdown-content w-56 p-1.5">
                        <DropdownMenu.Label className="px-2.5 py-2 text-[9px] uppercase tracking-[.1em] text-slate-700">Notifications</DropdownMenu.Label>
                        {["All", "Important only"].map((mode) => (
                          <DropdownMenu.Item key={mode} className="dropdown-item" onSelect={() => onNotificationMode(mode)}>
                            {notificationMode === mode ? <Check /> : <span className="size-3.5" />} {mode}
                          </DropdownMenu.Item>
                        ))}
                        <DropdownMenu.Separator className="my-1 h-px bg-white/[.07]" />
                        <DropdownMenu.Item className="dropdown-item text-red-300" onSelect={onFollow}><UserPlus /> Unfollow</DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                ) : (
                  <Button onClick={onFollow}><UserPlus className="size-4" /> Follow</Button>
                )}
                <Button variant="secondary" onClick={onMessage}><MessageCircle className="size-4" /> Message</Button>
              </>
            )}
            <ProfileMoreMenu onShare={onShare} onAction={onAction} />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/[.06] pt-5 text-[10px] text-slate-600">
          <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" /> {creatorProfile.location}</span>
          <a href={`https://${creatorProfile.website}`} className="inline-flex items-center gap-1.5 transition hover:text-violet-300"><Globe2 className="size-3.5" /> {creatorProfile.website}</a>
          <span>{creatorProfile.joinedAt}</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-400"><span className="size-1.5 rounded-full bg-emerald-400" /> {creatorProfile.lastActive}</span>
          <div className="flex gap-1 lg:ml-auto">
            <SocialButton icon={Github} label="GitHub" onClick={() => onAction("GitHub profile opened")} />
            <SocialButton icon={Link2} label="Website" onClick={() => onAction("Personal website opened")} />
            <SocialButton icon={ExternalLink} label="LinkedIn" onClick={() => onAction("LinkedIn profile opened")} />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {creatorProfile.skills.map((skill) => <Badge key={skill}>{skill}</Badge>)}
        </div>
      </div>
    </motion.header>
  );
}

function ProfileMoreMenu({ onShare, onAction }: { onShare: () => void; onAction: (label: string) => void }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild><Button variant="icon" size="icon" aria-label="More profile actions"><Ellipsis className="size-4" /></Button></DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={7} className="dropdown-content w-48 p-1.5">
          <DropdownMenu.Item className="dropdown-item" onSelect={onShare}><Share2 /> Share profile</DropdownMenu.Item>
          <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction("Profile link copied")}><Copy /> Copy profile link</DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-white/[.07]" />
          <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction("Report user opened")}><ShieldAlert /> Report user</DropdownMenu.Item>
          <DropdownMenu.Item className="dropdown-item text-red-300" onSelect={() => onAction("User blocked")}><Ban /> Block user</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function SocialButton({ icon: Icon, label, onClick }: { icon: typeof Github; label: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} aria-label={label} title={label} className="grid size-8 place-items-center rounded-lg border border-white/[.06] bg-white/[.02] text-slate-600 transition hover:border-violet-500/20 hover:text-violet-300"><Icon className="size-3.5" /></button>;
}
