"use client";

import { useEffect, useRef, useState } from "react";
import { PROFILE_FIELDS, profileEditValues, profileEditIssues, saveLocalProfile,
  type PreviewProfileMember, type ProfileField } from "@/lib/profile-preview";
import { ProfileDialog } from "./profile-dialog";

export function ProfileEditor({ member, onSaved, onClose }: {
  member: PreviewProfileMember; onSaved: (member: PreviewProfileMember) => void; onClose: () => void;
}) {
  const [baseline] = useState(member);
  const [values, setValues] = useState(() => profileEditValues(baseline));
  const [issues, setIssues] = useState<Partial<Record<ProfileField, string>>>({});
  const [error, setError] = useState("");
  const [discarding, setDiscarding] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const dirty = JSON.stringify(values) !== JSON.stringify(profileEditValues(baseline));
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function close() { if (dirty) setDiscarding(true); else onClose(); }
  return (
    <ProfileDialog title="A little more about you." onClose={close}>
      <p className="profile-dialog__intro">Give people the context they need. Changes are saved only in this browser preview.</p>
      <form ref={form} noValidate onSubmit={(event) => {
        event.preventDefault();
        const nextIssues = profileEditIssues(values);
        setIssues(nextIssues); setError("");
        const first = Object.keys(nextIssues)[0];
        if (first) { form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus(); return; }
        try { onSaved(saveLocalProfile(window.localStorage, baseline, values)); }
        catch (issue) { setError(issue instanceof Error ? issue.message : "Changes could not be saved. Please try again."); }
      }}>
        <div className="profile-edit-grid">
          {PROFILE_FIELDS.map((field) => {
            const shared = {
              id: `profile-edit-${field.key}`, name: field.key, value: values[field.key],
              maxLength: field.max, "aria-invalid": Boolean(issues[field.key]),
              "aria-describedby": `profile-edit-${field.key}-hint`,
              onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setValues({ ...values, [field.key]: event.target.value });
                setIssues({ ...issues, [field.key]: undefined }); setError(""); setDiscarding(false);
              },
            };
            return <div key={field.key} className={field.key === "professionalOverview" || field.key === "skills" ? "profile-edit-field profile-edit-field--wide" : "profile-edit-field"}>
              <label htmlFor={shared.id}>{field.label}{"required" in field ? " *" : ""}</label>
              {field.key === "professionalOverview" ? <textarea {...shared} rows={4} /> : <input {...shared} required={"required" in field} />}
              <small id={shared["aria-describedby"]} className={issues[field.key] ? "profile-edit-error" : ""}>
                {issues[field.key] || (field.key === "skills" ? "Separate your skills with commas." : `${values[field.key].length}/${field.max}`)}
              </small>
            </div>;
          })}
        </div>
        {error && <p className="profile-edit-error" role="alert">{error}</p>}
        {discarding && <div className="profile-discard" role="alert">
          <strong>Discard your unsaved changes?</strong><p>Your saved profile will stay as it was.</p>
          <div><button type="button" onClick={() => setDiscarding(false)}>Keep editing</button><button type="button" onClick={onClose}>Discard changes</button></div>
        </div>}
        <footer className="profile-dialog__footer"><button type="button" onClick={close}>Cancel</button><button type="submit" className="is-primary">Save changes</button></footer>
      </form>
    </ProfileDialog>
  );
}
