-- Clasificación visual persistente de productos: resultado automático o corrección manual.
alter table public.products
  add column if not exists gender_target text not null default 'unisex',
  add column if not exists gender_confidence numeric(4,3),
  add column if not exists gender_source text not null default 'auto',
  add column if not exists gender_analysis jsonb not null default '{}'::jsonb,
  add column if not exists gender_classified_at timestamptz;

alter table public.products
  drop constraint if exists products_gender_target_check,
  drop constraint if exists products_gender_source_check,
  drop constraint if exists products_gender_confidence_check;

alter table public.products
  add constraint products_gender_target_check
    check (gender_target in ('girl', 'boy', 'unisex')),
  add constraint products_gender_source_check
    check (gender_source in ('auto', 'manual')),
  add constraint products_gender_confidence_check
    check (gender_confidence is null or (gender_confidence >= 0 and gender_confidence <= 1));

create index if not exists products_gender_target_active_idx
  on public.products (gender_target, status)
  where deleted_at is null;

comment on column public.products.gender_target is 'Público principal: girl, boy o unisex.';
comment on column public.products.gender_confidence is 'Confianza entre 0 y 1 de la clasificación automática.';
comment on column public.products.gender_source is 'auto para análisis visual o manual para corrección de administración.';
comment on column public.products.gender_analysis is 'Señales visuales y explicación breve del último análisis automático.';
