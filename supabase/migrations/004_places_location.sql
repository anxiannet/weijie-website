alter table public.infos
  add column if not exists location_name text,
  add column if not exists location_address text,
  add column if not exists location_postal text,
  add column if not exists location_lat numeric,
  add column if not exists location_lng numeric,
  add column if not exists location_source text,
  add column if not exists location_raw jsonb;

create table if not exists public.places_cache (
  id uuid primary key default gen_random_uuid(),
  query text,
  name text,
  address text,
  postal text,
  lat numeric,
  lng numeric,
  source text,
  raw jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_places_cache_query on public.places_cache(lower(query));
create index if not exists idx_places_cache_name on public.places_cache(lower(name));
create index if not exists idx_infos_location_name on public.infos(lower(location_name));

alter table public.places_cache enable row level security;

drop policy if exists "places cache readable" on public.places_cache;
create policy "places cache readable" on public.places_cache for select using (true);

drop policy if exists "places cache admin insert" on public.places_cache;
create policy "places cache admin insert" on public.places_cache for insert with check (private.is_admin());

drop policy if exists "places cache admin delete" on public.places_cache;
create policy "places cache admin delete" on public.places_cache for delete using (private.is_admin());
