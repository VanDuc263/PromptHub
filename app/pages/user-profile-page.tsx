import {
  AlertTriangle,
  LockKeyhole,
  RefreshCw,
  Share2,
  UserPlus,
  UserRoundX,
  Code2,
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
import { creatorProfile, profileStats, type CreatorProfileData } from "@/data/profile-data";
import { fetchProfileRequest, type UserProfileApi } from "@/lib/profile-api";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchExplorePrompts } from "@/store/explore-slice";
import type { ProfilePrompt } from "@/types";

type ProfileStatus = "active" | "error" | "not-found" | "suspended" | "private";

export function UserProfilePage({
  isOwner,
  username = "ducngo",
  status = "active",
  onAction,
}: {
  isOwner: boolean;
  username?: string;
  status?: ProfileStatus;
  onAction: (label: string) => void;
}) {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const dispatch = useAppDispatch();
  const exploreState = useAppSelector((state) => state.explore);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [apiProfile, setApiProfile] = useState<UserProfileApi | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);
  const [following, setFollowing] = useState(false);
  const [notificationMode, setNotificationMode] = useState("All");
  const [followerDelta, setFollowerDelta] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetchProfileRequest(isOwner ? undefined : username, accessToken).then((response) => {
      if (cancelled) return;
      setApiProfile(response);
      setLoading(false);
    }).catch((error: unknown) => {
      if (cancelled) return;
      setProfileError(error instanceof Error ? error.message : "Could not load profile.");
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [accessToken, isOwner, requestVersion, username]);

  useEffect(() => {
    if (exploreState.status === "idle") void dispatch(fetchExplorePrompts());
  }, [dispatch, exploreState.status]);

  const profile = apiProfile ? mapProfile(apiProfile) : creatorProfile;
  const statistics = profileStats.map((stat) => {
    if (!apiProfile) return stat;
    if (stat.label === "Public Prompts") return { ...stat, value: String(apiProfile.publicPromptCount), change: "From published prompts" };
    if (stat.label === "Collections") return { ...stat, value: String(apiProfile.publicCollectionCount), change: "Public collections" };
    if (stat.label === "Prompt Copies") return { ...stat, value: apiProfile.totalCopies.toLocaleString(), change: "Across public prompts" };
    if (stat.label === "Average Rating") return { ...stat, value: apiProfile.averageRating ? apiProfile.averageRating.toFixed(1) : "—", change: `${apiProfile.reviewCount} reviews` };
    return stat;
  });
  const prompts = apiProfile ? exploreState.prompts
    .filter((prompt) => prompt.author === apiProfile.displayName)
    .map<ProfilePrompt>((prompt) => ({
      id: prompt.id,
      title: prompt.title,
      description: prompt.description,
      category: prompt.category,
      tags: prompt.tags,
      models: prompt.models,
      version: prompt.models[0] ?? "Any model",
      rating: prompt.rating,
      copies: prompt.copies,
      forks: 0,
      saves: prompt.saves,
      likes: prompt.likes,
      updatedAt: prompt.publishedAt ? relativeTime(prompt.publishedAt) : "recently",
      featured: prompt.featured,
      icon: Code2,
      accent: "bg-emerald-500/10 text-emerald-300",
    })) : undefined;

  const toggleFollow = () => {
    setFollowing((value) => !value);
    setFollowerDelta((value) => value + (following ? -1 : 1));
    onAction(following ? "Unfollowed Đức Nguyễn" : "Following Đức Nguyễn");
  };

  if (loading) return <ProfileSkeleton />;
  if (profileError) return <ProfileUnavailable status={profileError === "Profile not found." ? "not-found" : "error"} onRetry={() => { setLoading(true); setProfileError(null); setRequestVersion((version) => version + 1); }} />;
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
          profile={profile}
        />
        <div className="mt-4"><ProfileStatistics followerDelta={followerDelta} statistics={statistics} /></div>
        <div className="mt-4"><ProfileTabs isOwner={isOwner} profile={profile} prompts={prompts} onEdit={() => setEditOpen(true)} onAction={onAction} /></div>
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

function mapProfile(profile: UserProfileApi): CreatorProfileData {
  const parts = profile.displayName.trim().split(/\s+/).filter(Boolean);
  const initials = parts.length ? `${parts[0][0]}${parts.length > 1 ? parts.at(-1)?.[0] : ""}`.toUpperCase() : "PH";
  const joinedAt = new Date(profile.joinedAt).toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const lastActive = profile.lastActiveAt ? relativeTime(profile.lastActiveAt) : creatorProfile.lastActive;
  return {
    ...creatorProfile,
    name: profile.displayName,
    username: `@${profile.username}`,
    initials,
    verified: profile.verified,
    bio: profile.bio,
    location: profile.location ?? creatorProfile.location,
    website: profile.websiteUrl ?? creatorProfile.website,
    joinedAt: `Joined ${joinedAt}`,
    lastActive: `Active ${lastActive}`,
    avatarUrl: profile.avatarUrl,
  };
}

function relativeTime(value: string) {
  const elapsed = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(elapsed) || elapsed < 60_000) return "just now";
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
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
