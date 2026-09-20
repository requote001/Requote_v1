import type { Metadata } from "next";
import { MyProfile } from "@/components/profile/my-profile";

export const metadata: Metadata = {
  title: "Your profile",
  description: "Manage your Requote profile, roles, and visibility preferences.",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return <MyProfile />;
}
