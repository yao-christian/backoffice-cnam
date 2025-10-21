import ProfileInfo from "./profile-info.client";
import { getCurrentUser } from "@/features/auth/auth-session";

export const revalidate = 0;

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("Vous devez être connecté pour accéder au profil.");
  }

  return <ProfileInfo profile={currentUser} />;
}
