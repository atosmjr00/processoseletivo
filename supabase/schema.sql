-- Execute no SQL Editor do Supabase antes de habilitar candidaturas reais.
create extension if not exists pgcrypto;

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 3 and 160),
  email text not null check (char_length(email) <= 254),
  phone text not null check (char_length(phone) between 7 and 40),
  city text not null check (char_length(city) <= 120),
  role text not null default 'Suporte ao Cliente e Customer Success (CS) para E-commerce/SaaS',
  linkedin_url text,
  experience text not null check (char_length(experience) between 20 and 5000),
  motivation text not null check (char_length(motivation) between 20 and 5000),
  salary_expectation text,
  privacy_consent boolean not null default false,
  privacy_consent_at timestamptz,
  status text not null default 'recebida'
    check (status in ('recebida', 'em_analise', 'proxima_etapa', 'encerrada')),
  created_at timestamptz not null default now(),
  constraint application_requires_consent check (privacy_consent = true)
);

create table if not exists public.job_assessments (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 3 and 160),
  email text not null check (char_length(email) <= 254),
  answers jsonb not null,
  score integer not null check (score between 0 and 20),
  total_questions integer not null default 20 check (total_questions = 20),
  score_percent integer not null check (score_percent between 0 and 100),
  outcome text not null check (outcome in ('apta', 'revisao', 'nao_apta')),
  privacy_consent boolean not null default false,
  privacy_consent_at timestamptz,
  created_at timestamptz not null default now(),
  constraint assessment_requires_consent check (privacy_consent = true)
);

alter table public.job_applications enable row level security;
alter table public.job_assessments enable row level security;

drop policy if exists "Allow public application submission" on public.job_applications;
create policy "Allow public application submission"
  on public.job_applications for insert to anon, authenticated
  with check (
    privacy_consent = true and full_name is not null
    and email is not null and phone is not null and city is not null
  );

drop policy if exists "Allow public assessment submission" on public.job_assessments;
create policy "Allow public assessment submission"
  on public.job_assessments for insert to anon, authenticated
  with check (privacy_consent = true and full_name is not null and email is not null);

grant usage on schema public to anon, authenticated;
grant insert on public.job_applications to anon, authenticated;
grant insert on public.job_assessments to anon, authenticated;

create index if not exists job_applications_created_at_idx
  on public.job_applications (created_at desc);
create index if not exists job_applications_status_idx
  on public.job_applications (status);
create index if not exists job_applications_email_idx
  on public.job_applications (lower(email));
create index if not exists job_assessments_created_at_idx
  on public.job_assessments (created_at desc);
create index if not exists job_assessments_email_idx
  on public.job_assessments (lower(email));

-- Segurança: não crie policies públicas de SELECT, UPDATE ou DELETE.
-- O acesso da equipe deve ser configurado separadamente com autenticação e permissões restritas.
-- Nunca coloque a chave service_role no frontend.
