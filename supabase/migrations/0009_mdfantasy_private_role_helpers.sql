-- Los helpers SECURITY DEFINER se usan exclusivamente dentro de RLS.
-- Se alojan fuera del esquema expuesto para que no puedan invocarse mediante RPC.
create schema if not exists private;
revoke all on schema private from public;

create or replace function private.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and active = true
      and role in ('editor', 'admin', 'super_admin')
  );
$$;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and active = true
      and role in ('admin', 'super_admin')
  );
$$;

grant usage on schema private to authenticated;
grant execute on function private.is_staff() to authenticated;
grant execute on function private.is_admin() to authenticated;
revoke all on function public.is_staff() from public, anon, authenticated;
revoke all on function public.is_admin() from public, anon, authenticated;

alter policy "profiles_self_read" on public.profiles using (id = auth.uid() or private.is_admin());
alter policy "profiles_admin_write" on public.profiles using (private.is_admin()) with check (private.is_admin());
alter policy "media_staff_manage" on public.media_library using (private.is_staff()) with check (private.is_staff());
alter policy "categories_staff_manage" on public.categories using (private.is_staff()) with check (private.is_staff());
alter policy "products_staff_manage" on public.products using (private.is_staff()) with check (private.is_staff());
alter policy "variants_staff_manage" on public.product_variants using (private.is_staff()) with check (private.is_staff());
alter policy "product_images_staff_manage" on public.product_images using (private.is_staff()) with check (private.is_staff());
alter policy "tags_staff_manage" on public.tags using (private.is_staff()) with check (private.is_staff());
alter policy "product_tags_staff_manage" on public.product_tags using (private.is_staff()) with check (private.is_staff());
alter policy "collections_staff_manage" on public.collections using (private.is_staff()) with check (private.is_staff());
alter policy "collection_products_staff_manage" on public.collection_products using (private.is_staff()) with check (private.is_staff());
alter policy "settings_admin_manage" on public.site_settings using (private.is_admin()) with check (private.is_admin());
alter policy "hero_staff_manage" on public.hero_slides using (private.is_staff()) with check (private.is_staff());
alter policy "sections_staff_manage" on public.site_sections using (private.is_staff()) with check (private.is_staff());
alter policy "orders_self_read" on public.orders using (user_id = auth.uid() or private.is_staff());
alter policy "orders_staff_manage" on public.orders using (private.is_staff()) with check (private.is_staff());
alter policy "order_items_read" on public.order_items using (private.is_staff() or exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));
alter policy "order_items_staff_manage" on public.order_items using (private.is_staff()) with check (private.is_staff());
alter policy "imports_staff_manage" on public.import_jobs using (private.is_staff()) with check (private.is_staff());
alter policy "import_rows_staff_manage" on public.import_rows using (private.is_staff()) with check (private.is_staff());
alter policy "audit_admin_read" on public.audit_logs using (private.is_admin());
alter policy "mdfantasy_media_staff_upload" on storage.objects with check (bucket_id = 'mdfantasy-media' and private.is_staff());
alter policy "mdfantasy_media_staff_update" on storage.objects using (bucket_id = 'mdfantasy-media' and private.is_staff()) with check (bucket_id = 'mdfantasy-media' and private.is_staff());
alter policy "mdfantasy_media_staff_delete" on storage.objects using (bucket_id = 'mdfantasy-media' and private.is_staff());
