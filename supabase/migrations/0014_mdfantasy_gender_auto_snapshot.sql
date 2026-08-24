alter table public.products
  add column if not exists gender_auto_target text,
  add column if not exists gender_auto_confidence numeric(4,3),
  add column if not exists gender_auto_analysis jsonb not null default '{}'::jsonb,
  add column if not exists gender_auto_classified_at timestamptz;

alter table public.products
  drop constraint if exists products_gender_auto_target_check,
  drop constraint if exists products_gender_auto_confidence_check;

alter table public.products
  add constraint products_gender_auto_target_check
    check (gender_auto_target is null or gender_auto_target in ('girl', 'boy', 'unisex')),
  add constraint products_gender_auto_confidence_check
    check (gender_auto_confidence is null or (gender_auto_confidence >= 0 and gender_auto_confidence <= 1));

comment on column public.products.gender_auto_target is 'Última propuesta del análisis visual, preservada aunque exista override manual.';
comment on column public.products.gender_auto_confidence is 'Confianza de la última propuesta visual.';
comment on column public.products.gender_auto_analysis is 'Evidencia visual de la última propuesta automática.';
