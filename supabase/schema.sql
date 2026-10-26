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
  created_at timestamptz not null default now()
);

alter table public.job_applications enable row level security;

drop policy if exists "Allow public application submission" on public.job_applications;
create policy "Allow public application submission"
  on public.job_applications for insert to anon, authenticated
  with check (
    privacy_consent = true and full_name is not null
    and email is not null and phone is not null and city is not null
  );

-- Não crie policy pública de SELECT, UPDATE ou DELETE.
-- Painel administrativo deve usar autenticação e policies restritas.
-- Nunca coloque service_role no frontend.
create index if not exists job_applications_created_at_idx
  on public.job_applications (created_at desc);
create index if not exists job_applications_status_idx
  on public.job_applications (status);