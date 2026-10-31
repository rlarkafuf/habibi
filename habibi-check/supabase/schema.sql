-- =====================================================================
-- Habibi Check: Supabase / PostgreSQL Schema for Abu Dhabi Real Estate
-- Supports DARI Official Transactions + Property Finder / Bayut Listings
-- =====================================================================

create table if not exists public.properties (
  id text primary key,
  name text not null,
  project_name text not null,
  building_name text not null,
  island text not null check (island in ('Al Reem Island', 'Yas Island', 'Saadiyat Island')),
  developer text not null,
  unit_type text not null default 'Apartment',
  bedrooms text not null,
  area_sqft numeric not null check (area_sqft > 0),
  transaction_amount_aed numeric not null check (transaction_amount_aed > 0),
  asking_aed numeric not null check (asking_aed > 0),
  service_charge_sqft numeric not null default 16,
  completion_status text not null default 'Ready',
  lat double precision not null,
  lng double precision not null,
  transaction_date date not null default current_date,
  portal_source text not null default 'DARI / Property Finder',
  verified_listing boolean not null default true,
  historical_trends jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists idx_properties_island on public.properties (island);
create index if not exists idx_properties_project_bedrooms on public.properties (project_name, bedrooms);
create index if not exists idx_properties_developer on public.properties (developer);

alter table public.properties enable row level security;

create policy "Allow public read access on properties"
  on public.properties
  for select
  to anon, authenticated
  using (true);

create policy "Allow authenticated insert/upsert on properties"
  on public.properties
  for all
  to authenticated
  using (true)
  with check (true);

