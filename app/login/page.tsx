import { redirect } from "next/navigation";
import { WAITLIST_ROLES, type WaitlistRole } from "@/lib/waitlist";

type LoginPageProps = {
  searchParams: Promise<{ role?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { role } = await searchParams;
  const selectedRole = WAITLIST_ROLES.includes(role as WaitlistRole)
    ? role
    : "";
  redirect(
    selectedRole
      ? "/waitlist?role=" + selectedRole + "&source=login"
      : "/waitlist?source=login",
  );
}
