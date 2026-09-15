create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  role text not null check (role in ('patient', 'doctor', 'super_admin')),
  full_name text not null,
  email text,
  mobile text,
  abha_number text,
  blood_group text,
  experience_years integer default 0,
  specialization text,
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.profiles(id) on delete cascade,
  doctor_id uuid references public.profiles(id) on delete set null,
  token_number text not null,
  reason text not null,
  waiting_minutes integer not null default 0,
  status text not null default 'pending' check (status in ('pending', 'approved', 'in_consultation', 'completed', 'cancelled')),
  appointment_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.health_records (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  record_type text not null,
  notes text,
  file_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_summaries (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.profiles(id) on delete cascade,
  doctor_id uuid references public.profiles(id) on delete set null,
  transcript text,
  summary text not null,
  forwarded_to_doctor boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.fhir_exports (
  id uuid primary key default gen_random_uuid(),
  workspace text not null,
  patient_id text not null,
  bundle jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists appointments_status_idx on public.appointments(status, appointment_at);
create index if not exists appointments_patient_idx on public.appointments(patient_id, created_at desc);
create index if not exists ai_summaries_patient_idx on public.ai_summaries(patient_id, created_at desc);
create index if not exists fhir_exports_patient_idx on public.fhir_exports(patient_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.appointments enable row level security;
alter table public.health_records enable row level security;
alter table public.ai_summaries enable row level security;
alter table public.fhir_exports enable row level security;

drop policy if exists "demo profiles all" on public.profiles;
create policy "demo profiles all" on public.profiles for all to anon using (true) with check (true);

drop policy if exists "demo appointments all" on public.appointments;
create policy "demo appointments all" on public.appointments for all to anon using (true) with check (true);

drop policy if exists "demo health records all" on public.health_records;
create policy "demo health records all" on public.health_records for all to anon using (true) with check (true);

drop policy if exists "demo ai summaries all" on public.ai_summaries;
create policy "demo ai summaries all" on public.ai_summaries for all to anon using (true) with check (true);

drop policy if exists "demo fhir exports all" on public.fhir_exports;
create policy "demo fhir exports all" on public.fhir_exports for all to anon using (true) with check (true);
