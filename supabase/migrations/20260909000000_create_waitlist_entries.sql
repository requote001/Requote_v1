create extension if not exists citext with schema extensions;

create table if not exists public.waitlist_entries (
  id uuid primary key default gen_random_uuid(),
  full_name varchar(100) not null,
  email extensions.citext not null unique,
  phone varchar(30),
  role text not null check (role in ('requester', 'provider', 'both')),
  city varchar(100),
  service_category varchar(120),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'invited', 'onboarded', 'removed')),
  source varchar(100) not null default 'website',
  utm_source varchar(120),
  utm_campaign varchar(120),
  request_intent text not null default 'general'
    check (request_intent in ('general', 'draft', 'published')),
  consent_at timestamptz not null,
  privacy_policy_version varchar(30) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists waitlist_entries_status_created_at_idx
  on public.waitlist_entries (status, created_at desc);

create index if not exists waitlist_entries_role_created_at_idx
  on public.waitlist_entries (role, created_at desc);

create or replace function public.set_waitlist_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists waitlist_entries_set_updated_at
  on public.waitlist_entries;

create trigger waitlist_entries_set_updated_at
before update on public.waitlist_entries
for each row execute function public.set_waitlist_updated_at();

alter table public.waitlist_entries enable row level security;

revoke all on table public.waitlist_entries from anon, authenticated;
grant select, insert, update on table public.waitlist_entries to service_role;

comment on table public.waitlist_entries is
  'Private early-access registrations submitted through the Requote server endpoint.';
