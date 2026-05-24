-- Row Level Security for Spendora
--
-- Design:
-- - Public audit pages fetch a single audit by UUID via get_audit_public() (no table scan).
-- - Authenticated users read their audits and lead-linked audits via RLS.
-- - Authenticated users can claim unlinked audits (user_id IS NULL).
-- - Inserts for audits/leads stay on the service role (API routes) after validation.

-- ─── Audits ─────────────────────────────────────────────────────────────────

alter table public.audits enable row level security;

drop policy if exists "audits_select_own" on public.audits;
create policy "audits_select_own"
  on public.audits
  for select
  to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1
      from public.leads
      where leads.audit_id = audits.id
        and lower(leads.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

drop policy if exists "audits_link_unclaimed" on public.audits;
create policy "audits_link_unclaimed"
  on public.audits
  for update
  to authenticated
  using (user_id is null)
  with check (user_id = auth.uid());

drop policy if exists "audits_owner_update" on public.audits;
create policy "audits_owner_update"
  on public.audits
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ─── Leads ──────────────────────────────────────────────────────────────────

alter table public.leads enable row level security;

drop policy if exists "leads_select_own_email" on public.leads;
create policy "leads_select_own_email"
  on public.leads
  for select
  to authenticated
  using (
    lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

-- ─── Public audit fetch by ID (shareable links) ───────────────────────────────

create or replace function public.get_audit_public(p_id uuid)
returns setof public.audits
language sql
security definer
set search_path = public
stable
as $$
  select *
  from public.audits
  where id = p_id;
$$;

revoke all on function public.get_audit_public(uuid) from public;
grant execute on function public.get_audit_public(uuid) to anon, authenticated;
