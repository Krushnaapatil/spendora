alter table public.audits
add column if not exists use_case text null;

alter table public.audits
add column if not exists team_size bigint null;
