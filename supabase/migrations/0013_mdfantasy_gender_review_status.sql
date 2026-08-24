alter table public.products
  add column if not exists gender_review_status text not null default 'pending_review';

alter table public.products
  drop constraint if exists products_gender_review_status_check;

alter table public.products
  add constraint products_gender_review_status_check
    check (gender_review_status in ('classified', 'pending_review'));

create index if not exists products_gender_review_status_idx
  on public.products (gender_review_status)
  where deleted_at is null;

comment on column public.products.gender_review_status is 'classified para una clasificación visual verificada o pending_review para imágenes pendientes.';
