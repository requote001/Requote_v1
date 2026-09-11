alter table public.waitlist_entries
  add column if not exists profile_interest varchar(120);

alter table public.waitlist_entries
  drop constraint if exists waitlist_entries_role_check;

alter table public.waitlist_entries
  add constraint waitlist_entries_role_check
  check (role in (
    'requester',
    'provider',
    'employer',
    'employee',
    'investor',
    'both'
  ));

create index if not exists waitlist_entries_profile_interest_created_at_idx
  on public.waitlist_entries (profile_interest, created_at desc)
  where profile_interest is not null;

comment on column public.waitlist_entries.profile_interest is
  'An optional role-specific early-access interest, such as an employment area or investment focus.';
