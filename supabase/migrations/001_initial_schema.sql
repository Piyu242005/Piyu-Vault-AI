create extension if not exists pgcrypto;

create type public.role as enum ('OWNER', 'ADMIN', 'MEMBER');

create table if not exists public.users (
  id text primary key default gen_random_uuid()::text,
  auth_id uuid unique not null references auth.users(id) on delete cascade,
  email text unique not null,
  first_name text,
  last_name text,
  image_url text,
  role public.role not null default 'MEMBER',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notes (
  id text primary key default gen_random_uuid()::text,
  user_id text not null references public.users(id) on delete cascade,
  title text not null,
  content text not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create table if not exists public.documents (
  id text primary key default gen_random_uuid()::text,
  user_id text not null references public.users(id) on delete cascade,
  name text not null,
  file_type text not null,
  size integer not null,
  storage_path text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create table if not exists public.activity_logs (
  id text primary key default gen_random_uuid()::text,
  user_id text not null references public.users(id) on delete cascade,
  action text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create table if not exists public.security_events (
  id text primary key default gen_random_uuid()::text,
  user_id text not null references public.users(id) on delete cascade,
  event_type text not null,
  ip_address text,
  device text,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create index if not exists users_auth_id_idx on public.users(auth_id);
create index if not exists notes_user_id_idx on public.notes(user_id);
create index if not exists documents_user_id_idx on public.documents(user_id);
create index if not exists activity_logs_user_id_idx on public.activity_logs(user_id);
create index if not exists security_events_user_id_idx on public.security_events(user_id);

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (auth_id, email, first_name, last_name, image_url)
  values (
    new.id,
    coalesce(new.email, new.id::text || '@local.invalid'),
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'image_url')
  )
  on conflict (auth_id) do update set
    email = excluded.email,
    first_name = coalesce(excluded.first_name, public.users.first_name),
    last_name = coalesce(excluded.last_name, public.users.last_name),
    image_url = coalesce(excluded.image_url, public.users.image_url),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert or update of email, raw_user_meta_data on auth.users
for each row execute procedure public.handle_new_auth_user();

alter table public.users enable row level security;
alter table public.notes enable row level security;
alter table public.documents enable row level security;
alter table public.activity_logs enable row level security;
alter table public.security_events enable row level security;

create or replace function public.current_profile_id()
returns text
language sql
stable
security definer set search_path = public
as $$
  select id from public.users where auth_id = auth.uid();
$$;

drop policy if exists users_self_select on public.users;
create policy users_self_select on public.users for select using (auth_id = auth.uid());

drop policy if exists notes_self_all on public.notes;
create policy notes_self_all on public.notes for all using (user_id = public.current_profile_id()) with check (user_id = public.current_profile_id());

drop policy if exists documents_self_all on public.documents;
create policy documents_self_all on public.documents for all using (user_id = public.current_profile_id()) with check (user_id = public.current_profile_id());

drop policy if exists activity_self_select on public.activity_logs;
create policy activity_self_select on public.activity_logs for select using (user_id = public.current_profile_id());

drop policy if exists security_self_select on public.security_events;
create policy security_self_select on public.security_events for select using (user_id = public.current_profile_id());

insert into storage.buckets (id, name, public)
values ('vault-files', 'vault-files', false)
on conflict (id) do update set public = false;

drop policy if exists vault_files_select on storage.objects;
create policy vault_files_select on storage.objects for select to authenticated
using (bucket_id = 'vault-files' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists vault_files_insert on storage.objects;
create policy vault_files_insert on storage.objects for insert to authenticated
with check (bucket_id = 'vault-files' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists vault_files_update on storage.objects;
create policy vault_files_update on storage.objects for update to authenticated
using (bucket_id = 'vault-files' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'vault-files' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists vault_files_delete on storage.objects;
create policy vault_files_delete on storage.objects for delete to authenticated
using (bucket_id = 'vault-files' and (storage.foldername(name))[1] = auth.uid()::text);
