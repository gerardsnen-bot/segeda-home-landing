-- site_settings usa una clave booleana singleton, por lo que requiere un auditor específico sin entity_id UUID.
create or replace function public.audit_mdfantasy_settings_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_logs (actor_id, action, entity_type, entity_id, before_state, after_state)
  values (auth.uid(), 'update', 'site_settings', null, to_jsonb(old), to_jsonb(new));
  return new;
end;
$$;

revoke all on function public.audit_mdfantasy_settings_change() from public, anon, authenticated;
drop trigger if exists audit_site_settings_changes on public.site_settings;
create trigger audit_site_settings_changes
after update on public.site_settings
for each row execute function public.audit_mdfantasy_settings_change();
