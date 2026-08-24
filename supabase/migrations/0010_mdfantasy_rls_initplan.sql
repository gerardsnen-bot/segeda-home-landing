-- Evita reevaluar auth.uid() para cada fila durante lecturas con RLS.
alter policy "profiles_self_read" on public.profiles
  using (id = (select auth.uid()) or (select private.is_admin()));

alter policy "orders_self_read" on public.orders
  using (user_id = (select auth.uid()) or (select private.is_staff()));

alter policy "order_items_read" on public.order_items
  using (
    (select private.is_staff())
    or exists (
      select 1
      from public.orders o
      where o.id = order_id
        and o.user_id = (select auth.uid())
    )
  );
