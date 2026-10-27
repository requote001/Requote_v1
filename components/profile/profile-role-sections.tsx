import { ROLE_FIELDS, setupRoleLabel } from "@/lib/account-setup";
import type { PublicProfileView } from "@/lib/profile-preview";

export function ProfileRoleSections({ profile }: { profile: Pick<PublicProfileView, "roles" | "roleDetails"> }) {
  return <div className="profile-role-sections">
    {profile.roles.map((role) => {
      const values = profile.roleDetails[role] || {};
      const fields = ROLE_FIELDS[role].filter((field) => values[field.key] &&
        (!field.when || values[field.when.field] === field.when.value));
      return <section className="my-profile-panel" key={role}>
        <div className="my-profile-panel__heading"><div><p>{setupRoleLabel(role).toUpperCase()} DETAILS</p><h2>{setupRoleLabel(role)} context</h2></div></div>
        {fields.length ? <dl className="profile-context-list">{fields.map((field) => <div key={field.key}><dt>{field.label}</dt><dd>{values[field.key]}</dd></div>)}</dl>
          : <p>No role-specific details shared yet.</p>}
      </section>;
    })}
  </div>;
}
