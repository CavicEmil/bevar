import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../api/client";
import { signOut } from "../api/auth";
import { BUCKETS, getPublicUrl } from "../api/media";
import useSavedArticles from "../hooks/useSavedArticles";
import useSavedRecipes from "../hooks/useSavedRecipes";
import CollectionCard from "../components/CollectionCard";
import Card from "../components/ui/Card";
import Heading from "../components/ui/Heading";
import Button from "../components/ui/Button";
import Media from "../components/ui/Media";
import settingsIcon from "../assets/profile-settings.svg";
import feedbackIcon from "../assets/profile-feedback.svg";
import chevronIcon from "../assets/profile-chevron.svg";

export default function MyProfile() {
  const savedArticles = useSavedArticles();
  const { user } = useAuth();
  const navigate = useNavigate();
  const saved = useSavedRecipes();
  const [profileState, setProfileState] = useState({ userId: null, data: null });
  const [logoutError, setLogoutError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const userId = user?.id;

  useLayoutEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);
  useEffect(() => {
    if (!userId) return;
    let active = true;
    async function loadProfile() {
      try {
        const { data, error } = await supabase.from("profile")
          .select("name, email, profile_image_path, created_at")
          .eq("user_id", userId).maybeSingle();
        if (error) throw error;
        if (active) setProfileState({ userId, data, error: "" });
      } catch {
        if (active) setProfileState({ userId, data: null, error: "Some profile details could not be loaded." });
      }
    }
    loadProfile();
    return () => { active = false; };
  }, [userId]);

  const profile = profileState.userId === userId ? profileState.data : null;
  const profileError = profileState.userId === userId ? profileState.error : "";
  const metadata = user?.user_metadata ?? {};
  const fullName = profile?.name?.trim() || metadata.full_name?.trim() || metadata.name?.trim() || "";
  const firstName = metadata.first_name?.trim() || fullName.split(/\s+/)[0] || "";
  const email = user?.email || profile?.email || "";
  const joined = user?.created_at || profile?.created_at;
  const joinedDate = joined ? new Date(joined) : null;
  const since = joinedDate && !Number.isNaN(joinedDate.getTime())
    ? new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "Europe/Copenhagen" }).format(joinedDate)
    : "";
  const avatarPath = profile?.profile_image_path || metadata.avatar_url;
  const avatar = avatarPath && (/^https?:\/\//i.test(avatarPath) ? avatarPath : getPublicUrl(BUCKETS.profileImages, avatarPath));
  const initials = (fullName || firstName).split(/\s+/).filter(Boolean).slice(0, 2).map(name => name[0]).join("").toUpperCase();

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    setLogoutError("");
    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch {
      setLogoutError("Could not log out. Please try again.");
      setLoggingOut(false);
    }
  }

  return (
    <Card variant="fruit" className="mx-auto flex min-h-[calc(100dvh-80px-76px)] w-full max-w-lg flex-col gap-[14px] rounded-t-[28px] rounded-b-none px-[20px]! pt-[24px]! pb-[calc(24px+env(safe-area-inset-bottom,0px))]! font-the-one text-dark-humor">
      <div className="grid grid-cols-[minmax(72px,104px)_minmax(0,1fr)] items-start gap-section">
        <div className="aspect-square overflow-hidden rounded-[10px] bg-poplar-pink">
          {avatar ? <Media src={avatar} alt="Your profile photo" ratio="1 / 1" className="rounded-[10px]" /> : (
            <div aria-label="Profile photo placeholder" className="flex h-full items-center justify-center text-heading-1">{initials || "?"}</div>
          )}
        </div>
        <div className="flex min-w-0 flex-col items-start gap-[8px]">
          <div className="w-full min-w-0">
            <Heading content={firstName ? `Hi, ${firstName}!` : "Hi!"} level={1} variant={2} />
            <p className="break-words text-body">{email}</p>
          </div>
          {since && <p className="text-small">preserving since {since}</p>}
          <Button content="Edit profile" ariaLabel="Edit profile — coming soon" className="min-h-[30px]! px-[15px]! py-[6px]! text-small!" />
        </div>
      </div>
      {profileError && <p role="alert" className="text-small">{profileError}</p>}

      <div className="flex flex-col gap-[12px]">
        <CollectionCard variant="recipes" items={saved.recipes} loading={saved.isLoading} />
        <CollectionCard variant="articles" items={savedArticles.articles} loading={savedArticles.isLoading} />
        {savedArticles.error && <p role="alert" className="text-small text-spicy-berry">{savedArticles.error}</p>}
      </div>
      {saved.error && (
        <div className="flex flex-col items-start gap-related">
          <p role="alert" className="text-small">{saved.error}</p>
          <Button content="Try again" variant="secondary" onClick={saved.refresh} />
        </div>
      )}

      <div className="flex flex-col gap-[14px]">
        {[["Settings", settingsIcon], ["Give feedback", feedbackIcon]].map(([label, icon]) => (
          <Button key={label} variant="secondary" disabled ariaLabel={`${label} — coming soon`}
            content={<span className="flex w-full items-center gap-related"><img src={icon} alt="" /><span className="flex-1 text-left">{label}</span><img src={chevronIcon} alt="" /></span>}
            className="min-h-[40px]! w-full py-[10px]! opacity-100! [&>span]:w-full" />
        ))}
      </div>
      <div className="mt-[20px] flex flex-col gap-related">
        {logoutError && <p role="alert" className="text-small">{logoutError}</p>}
        <Button content={loggingOut ? "Logging out…" : "Log out"} disabled={loggingOut} onClick={handleLogout} className="w-full" />
      </div>
    </Card>
  );
}
