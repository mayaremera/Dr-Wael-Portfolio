-- Ensure the public media bucket and authenticated upload policies exist.
-- Safe to re-run: drops existing policies by name, then recreates them.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Anyone can read media files" on storage.objects;
drop policy if exists "Authenticated users can upload media" on storage.objects;
drop policy if exists "Authenticated users can update media" on storage.objects;
drop policy if exists "Authenticated users can delete media" on storage.objects;

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
