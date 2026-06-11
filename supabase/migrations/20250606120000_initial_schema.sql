-- Site content sections (activity, services, gallery, about, contact)
create table if not exists public.site_sections (
  section text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_sections enable row level security;

create policy "Anyone can read site content"
  on public.site_sections
  for select
  using (true);

create policy "Authenticated users can insert site content"
  on public.site_sections
  for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update site content"
  on public.site_sections
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete site content"
  on public.site_sections
  for delete
  to authenticated
  using (true);

-- Public media bucket for dashboard uploads
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = excluded.public;

create policy "Anyone can read media files"
  on storage.objects
  for select
  using (bucket_id = 'media');

create policy "Authenticated users can upload media"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'media');

create policy "Authenticated users can update media"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'media')
  with check (bucket_id = 'media');

create policy "Authenticated users can delete media"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'media');
