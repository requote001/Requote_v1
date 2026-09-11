import { redirect } from "next/navigation";
import { WAITLIST_ROLES, type WaitlistRole } from "@/lib/waitlist";

type CreateAccountPageProps = {
  searchParams: Promise<{ role?: string }>;
};

export default async function CreateAccountPage({
  searchParams,
}: CreateAccountPageProps) {
  const { role } = await searchParams;
  const selectedRole = WAITLIST_ROLES.includes(role as WaitlistRole)
    ? role
    : "";
  redirect(
    selectedRole
      ? "/waitlist?role=" + selectedRole + "&source=create-account"
      : "/waitlist?source=create-account",
  );
}
