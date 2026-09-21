import type { Metadata } from "next";
import { ProviderProfile } from "@/components/profile/provider-profile";
import { getProfilePlaceholder } from "@/lib/profile-placeholders";

type ProfilePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = getProfilePlaceholder(slug);
  return {
    title: profile.name,
    description: `${profile.profileKind} preview for ${profile.name} on Requote.`,
    robots: { index: false, follow: false },
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  return <ProviderProfile profile={getProfilePlaceholder(slug)} />;
}
