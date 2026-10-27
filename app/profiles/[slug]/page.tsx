import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProviderProfile } from "@/components/profile/provider-profile";
import { getProfilePlaceholder } from "@/lib/profile-placeholders";

type ProfilePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = getProfilePlaceholder(slug);
  if (!profile) notFound();
  return {
    title: profile.name,
    description: `${profile.profileKind} preview for ${profile.name} on Requote.`,
    alternates: { canonical: `/profiles/${profile.slug}` },
    robots: { index: false, follow: false },
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  const profile = getProfilePlaceholder(slug);
  if (!profile) notFound();
  return <ProviderProfile profile={profile} />;
}
