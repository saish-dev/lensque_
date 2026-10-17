-- Lensque: photos table, admin allow-list, storage bucket and policies.

create table public.admins (
  email text primary key
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admins where email = (auth.jwt() ->> 'email')
  );
$$;

create table public.photos (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  caption text not null default '',
  category text not null check (category in ('Portraits', 'Events', 'Product', 'Travel')),
  storage_path text not null unique,
  width int,
  height int,
  published boolean not null default false,
  featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index photos_public_idx on public.photos (published, category, sort_order, created_at desc);

alter table public.photos enable row level security;

create policy "public reads published photos"
  on public.photos for select
  using (published = true);

create policy "admin reads all photos"
  on public.photos for select
  using (public.is_admin());

create policy "admin inserts photos"
  on public.photos for insert
  with check (public.is_admin());

create policy "admin updates photos"
  on public.photos for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin deletes photos"
  on public.photos for delete
  using (public.is_admin());

-- Storage: one public bucket for the images themselves.
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

create policy "anyone can view photo files"
  on storage.objects for select
  using (bucket_id = 'photos');

create policy "admin uploads photo files"
  on storage.objects for insert
  with check (bucket_id = 'photos' and public.is_admin());

create policy "admin updates photo files"
  on storage.objects for update
  using (bucket_id = 'photos' and public.is_admin());

create policy "admin deletes photo files"
  on storage.objects for delete
  using (bucket_id = 'photos' and public.is_admin());
