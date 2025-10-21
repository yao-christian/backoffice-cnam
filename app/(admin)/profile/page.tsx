import { getProfileByUserId } from "@/features/profile/profile.service";
import ProfileInfo from "./profile-info.client";
import { getAuthSession } from "@/lib/auth/auth-session";

export const revalidate = 0;

export default async function ProfilePage() {
  const session = await getAuthSession();
  const userId = (session?.user as any)?.id as string | undefined;

  if (!userId) {
    throw new Error("Vous devez être connecté pour accéder au profil.");
  }

  const profile = await getProfileByUserId(userId);
  if (!profile) {
    throw new Error("Profil introuvable.");
  }

  return <ProfileInfo profile={profile} />;
}
