import { redirect } from "next/navigation";

type CreateAccountPageProps = {
  searchParams: Promise<{ role?: string }>;
};

export default async function CreateAccountPage({
  searchParams,
}: CreateAccountPageProps) {
  const { role } = await searchParams;
  redirect(role === "provider" ? "/waitlist?role=provider" : "/waitlist");
}
