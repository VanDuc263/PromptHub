import {
  AlertTriangle,
  LockKeyhole,
  RefreshCw,
  Share2,
  UserPlus,
  UserRoundX,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  EditProfileDialog,
  ShareProfileDialog,
} from "@/components/profile/profile-dialogs";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileStatistics } from "@/components/profile/profile-statistics";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { Button } from "@/components/ui/button";

type ProfileStatus = "active" | "error" | "not-found" | "suspended" | "private";

export function UserProfilePage({
  isOwner,
  status = "active",
  onAction,
}: {
  isOwner: boolean;
  status?: ProfileStatus;
  onAction: (label: string) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [notificationMode, setNotificationMode] = useState("All");
  const [followerDelta, setFollowerDelta] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(timeout);
  }, []);

  const toggleFollow = () => {
    setFollowing((value) => !value);
    setFollowerDelta((value) => value + (following ? -1 : 1));
    onAction(following ? "Unfollowed Đức Nguyễn" : "Following Đức Nguyễn");
  };

  if (loading) return <ProfileSkeleton />;
  if (status !== "active") return <ProfileUnavailable status={status} onRetry={() => window.location.reload()} />;

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-[1680px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
        <ProfileHeader
          isOwner={isOwner}
          following={following}
          notificationMode={notificationMode}
          onFollow={toggleFollow}
          onNotificationMode={(mode) => {
            setNotificationMode(mode);
            onAction(`Notifications: ${mode}`);
          }}
          onMessage={() => onAction("Message composer opened")}
          onEdit={() => setEditOpen(true)}
          onShare={() => setShareOpen(true)}
          onAction={onAction}
        />
        <div className="mt-4"><ProfileStatistics followerDelta={followerDelta} /></div>
        <div className="mt-4"><ProfileTabs isOwner={isOwner} onEdit={() => setEditOpen(true)} onAction={onAction} /></div>
        <footer className="mt-9 flex flex-col items-center justify-between gap-2 border-t border-white/[.06] py-5 text-[11px] text-slate-700 sm:flex-row"><p>© 2026 PromptHub Community.</p><p>Creator profile · {isOwner ? "Owner view" : "Public view"}</p></footer>
      </motion.div>

      {!isOwner && (
        <div className="fixed inset-x-3 bottom-3 z-30 flex gap-2 rounded-2xl border border-white/[.1] bg-[#161b22]/95 p-3 shadow-2xl backdrop-blur-xl md:hidden">
          <Button className="flex-1" onClick={toggleFollow}><UserPlus className="size-4" />{following ? "Following" : "Follow"}</Button>
          <Button variant="secondary" className="flex-1" onClick={() => setShareOpen(true)}><Share2 className="size-4" /> Share</Button>
        </div>
      )}

      <EditProfileDialog open={editOpen} onOpenChange={setEditOpen} onSaved={() => onAction("Profile updated successfully")} />
      <ShareProfileDialog open={shareOpen} onOpenChange={setShareOpen} onAction={onAction} />
    </>
  );
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-[1680px] animate-pulse px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
      <div className="h-[350px] rounded-2xl border border-white/[.05] bg-[#161b22]" />
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 2xl:grid-cols-6">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-28 rounded-2xl border border-white/[.05] bg-[#161b22]" />)}</div>
      <div className="mt-5 h-12 border-b border-white/[.06]" />
      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]"><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-72 rounded-2xl border border-white/[.05] bg-[#161b22]" />)}</div><div className="h-80 rounded-2xl border border-white/[.05] bg-[#161b22]" /></div>
    </div>
  );
}

function ProfileUnavailable({ status, onRetry }: { status: Exclude<ProfileStatus, "active">; onRetry: () => void }) {
  const states = {
    error: { icon: AlertTriangle, title: "Profile couldn’t be loaded", subtitle: "A temporary error prevented this profile from loading.", action: "Try again" },
    "not-found": { icon: UserRoundX, title: "User not found", subtitle: "This creator may have changed their username or removed their account.", action: "Return to Explore" },
    suspended: { icon: AlertTriangle, title: "Profile suspended", subtitle: "This profile is temporarily unavailable while it is being reviewed.", action: "Return to Explore" },
    private: { icon: LockKeyhole, title: "Private profile", subtitle: "This creator has limited their profile visibility.", action: "Return to Explore" },
  };
  const state = states[status];
  const Icon = state.icon;
  return <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-lg items-center justify-center px-4"><div className="w-full rounded-2xl border border-white/[.07] bg-[#161b22] px-6 py-14 text-center"><span className="mx-auto grid size-12 place-items-center rounded-xl bg-white/[.035] text-slate-600"><Icon className="size-5" /></span><h1 className="mt-5 text-lg font-semibold text-slate-200">{state.title}</h1><p className="mt-2 text-sm text-slate-600">{state.subtitle}</p><Button variant="secondary" className="mt-6" onClick={onRetry}>{status === "error" && <RefreshCw className="size-4" />}{state.action}</Button></div></div>;
}
