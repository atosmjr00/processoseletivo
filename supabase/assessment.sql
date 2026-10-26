-- Execute este arquivo no SQL Editor do Supabase para habilitar o registro da etapa 2.
create extension if not exists pgcrypto;

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

alter table public.job_assessments enable row level security;

drop policy if exists "Allow public assessment submission" on public.job_assessments;
create policy "Allow public assessment submission"
  on public.job_assessments for insert to anon, authenticated
  with check (privacy_consent = true and full_name is not null and email is not null);

create index if not exists job_assessments_email_idx on public.job_assessments (email);
create index if not exists job_assessments_created_at_idx on public.job_assessments (created_at desc);

-- Não crie políticas públicas de SELECT, UPDATE ou DELETE.
-- O acesso da equipe a resultados deve ser configurado separadamente com autenticação e permissões restritas.
