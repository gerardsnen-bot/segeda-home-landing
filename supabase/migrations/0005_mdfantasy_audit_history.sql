-- Historial automático de cambios administrativos para entidades de catálogo.
create or replace function public.audit_mdfantasy_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.audit_logs (actor_id, action, entity_type, entity_id, after_state)
    values (auth.uid(), 'create', tg_table_name, new.id, to_jsonb(new));
    return new;
  elsif tg_op = 'UPDATE' then
    insert into public.audit_logs (actor_id, action, entity_type, entity_id, before_state, after_state)
    values (auth.uid(), 'update', tg_table_name, new.id, to_jsonb(old), to_jsonb(new));
    return new;
  elsif tg_op = 'DELETE' then
    insert into public.audit_logs (actor_id, action, entity_type, entity_id, before_state)
    values (auth.uid(), 'delete', tg_table_name, old.id, to_jsonb(old));
    return old;
  end if;
  return null;
end;
$$;

revoke all on function public.audit_mdfantasy_change() from public, anon, authenticated;

create trigger audit_categories_changes after insert or update or delete on public.categories for each row execute function public.audit_mdfantasy_change();
create trigger audit_products_changes after insert or update or delete on public.products for each row execute function public.audit_mdfantasy_change();
create trigger audit_product_variants_changes after insert or update or delete on public.product_variants for each row execute function public.audit_mdfantasy_change();
create trigger audit_product_images_changes after insert or update or delete on public.product_images for each row execute function public.audit_mdfantasy_change();
create trigger audit_site_sections_changes after insert or update or delete on public.site_sections for each row execute function public.audit_mdfantasy_change();
create trigger audit_hero_slides_changes after insert or update or delete on public.hero_slides for each row execute function public.audit_mdfantasy_change();
create trigger audit_media_library_changes after insert or update or delete on public.media_library for each row execute function public.audit_mdfantasy_change();
