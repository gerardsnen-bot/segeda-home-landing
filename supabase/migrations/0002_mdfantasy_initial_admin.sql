-- Bootstrap de administración MDFantasy.
-- La primera cuenta autenticada puede reclamar el rol administrador una sola vez.

create or replace function public.claim_initial_admin()
returns public.app_role
language plpgsql
security definer
set search_path = public
as $$
declare
  current_role public.app_role;
begin
  if auth.uid() is null then
    raise exception 'Authentication is required';
  end if;

  -- Evita que dos registros simultáneos reclamen el primer rol administrativo.
  perform pg_advisory_xact_lock(hashtext('mdfantasy-initial-admin'));

  select role into current_role from public.profiles where id = auth.uid();
  if current_role is null then
    insert into public.profiles (id, role, active)
    values (auth.uid(), 'user', true)
    on conflict (id) do nothing;
    select role into current_role from public.profiles where id = auth.uid();
  end if;

  if exists (select 1 from public.profiles where role in ('admin', 'super_admin')) then
    return current_role;
  end if;

  update public.profiles
  set role = 'admin', active = true
  where id = auth.uid();

  return 'admin';
end;
$$;

revoke all on function public.claim_initial_admin() from public;
grant execute on function public.claim_initial_admin() to authenticated;
