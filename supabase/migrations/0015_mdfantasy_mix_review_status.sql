alter table public.products
  drop constraint if exists products_gender_review_status_check;

alter table public.products
  add constraint products_gender_review_status_check
    check (gender_review_status in ('classified', 'pending_review', 'mix'));

comment on column public.products.gender_review_status is
  'classified para clasificación visual verificada, pending_review para revisión pendiente o mix para productos publicados sin una etiqueta de género inferida.';

create index if not exists products_gender_review_status_idx
  on public.products (gender_review_status)
  where deleted_at is null;
