-- MDFantasy / Segeda Home: núcleo administrable en Supabase.
-- La migración es aditiva y no elimina ni modifica datos existentes.

create extension if not exists pgcrypto;

create type public.app_role as enum ('user', 'editor', 'admin', 'super_admin');
create type public.product_status as enum ('draft', 'active', 'hidden', 'archived');
create type public.order_status as enum ('draft', 'pending', 'confirmed', 'in_production', 'shipped', 'completed', 'cancelled');
create type public.import_status as enum ('draft', 'validating', 'completed', 'completed_with_errors', 'failed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.app_role not null default 'user',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.media_library (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  public_url text not null,
  file_name text not null,
  mime_type text not null,
  size_bytes bigint,
  width integer,
  height integer,
  alt_text text,
  usage_count integer not null default 0 check (usage_count >= 0),
  created_by uuid references public.profiles(id) on delete set null,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  image_media_id uuid references public.media_library(id) on delete set null,
  image_url text,
  icon text,
  active boolean not null default true,
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  short_description text,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  audience text,
  theme_group text,
  estimated_days text,
  status public.product_status not null default 'draft',
  stock integer check (stock is null or stock >= 0),
  featured boolean not null default false,
  is_new boolean not null default false,
  is_offer boolean not null default false,
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  label text not null,
  sku_suffix text,
  price numeric(10,2) not null check (price >= 0),
  compare_at_price numeric(10,2) check (compare_at_price is null or compare_at_price >= 0),
  sale_price numeric(10,2) check (sale_price is null or sale_price >= 0),
  stock integer check (stock is null or stock >= 0),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(product_id, label)
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  media_id uuid references public.media_library(id) on delete set null,
  image_url text not null,
  alt_text text,
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table public.product_tags (
  product_id uuid not null references public.products(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (product_id, tag_id)
);

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  collection_type text not null default 'manual',
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.collection_products (
  collection_id uuid not null references public.collections(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  sort_order integer not null default 0,
  primary key (collection_id, product_id)
);

create table public.site_settings (
  singleton boolean primary key default true check (singleton),
  business_name text not null default 'MDFantasy',
  whatsapp_number text not null default '51938634695',
  default_whatsapp_message text,
  email text,
  phone text,
  address text,
  city text,
  country text,
  business_hours text,
  logo_media_id uuid references public.media_library(id) on delete set null,
  favicon_media_id uuid references public.media_library(id) on delete set null,
  social_links jsonb not null default '{}'::jsonb,
  seo_defaults jsonb not null default '{}'::jsonb,
  analytics_settings jsonb not null default '{}'::jsonb,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  description text,
  desktop_image_url text,
  mobile_image_url text,
  primary_cta_label text,
  primary_cta_url text,
  secondary_cta_label text,
  secondary_cta_url text,
  content_alignment text not null default 'left' check (content_alignment in ('left', 'center', 'right')),
  active boolean not null default true,
  sort_order integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  internal_name text not null,
  title text,
  subtitle text,
  description text,
  image_url text,
  cta_label text,
  cta_url text,
  payload jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  sort_order integer not null default 0,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity unique,
  user_id uuid references public.profiles(id) on delete set null,
  customer_name text,
  customer_phone text,
  customer_email text,
  whatsapp_message text,
  status public.order_status not null default 'draft',
  currency text not null default 'PEN',
  subtotal numeric(10,2) not null default 0 check (subtotal >= 0),
  discount_total numeric(10,2) not null default 0 check (discount_total >= 0),
  total numeric(10,2) not null default 0 check (total >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  variant_label text,
  unit_price numeric(10,2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  image_url text,
  personalization jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.import_jobs (
  id uuid primary key default gen_random_uuid(),
  source_file_name text not null,
  storage_path text,
  mode text not null check (mode in ('create', 'update', 'upsert')),
  status public.import_status not null default 'draft',
  found_count integer not null default 0,
  created_count integer not null default 0,
  updated_count integer not null default 0,
  error_count integer not null default 0,
  summary jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.import_rows (
  id uuid primary key default gen_random_uuid(),
  import_id uuid not null references public.import_jobs(id) on delete cascade,
  row_number integer not null,
  payload jsonb not null,
  status text not null check (status in ('valid', 'warning', 'error', 'imported')),
  errors jsonb,
  product_id uuid references public.products(id) on delete set null
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_state jsonb,
  after_state jsonb,
  created_at timestamptz not null default now()
);

create index categories_public_order_idx on public.categories(active, sort_order) where deleted_at is null;
create index products_catalog_idx on public.products(category_id, status, sort_order) where deleted_at is null;
create index products_featured_idx on public.products(featured, status) where deleted_at is null;
create index products_name_idx on public.products using gin (to_tsvector('simple', name));
create index product_variants_product_idx on public.product_variants(product_id, active, sort_order);
create index product_images_product_idx on public.product_images(product_id, sort_order);
create index import_rows_import_idx on public.import_rows(import_id, row_number);
create index audit_logs_entity_idx on public.audit_logs(entity_type, entity_id, created_at desc);
create index audit_logs_actor_idx on public.audit_logs(actor_id, created_at desc);
create index orders_status_idx on public.orders(status, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'))
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and active = true
      and role in ('editor', 'admin', 'super_admin')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and active = true
      and role in ('admin', 'super_admin')
  );
$$;

create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger set_media_updated_at before update on public.media_library for each row execute function public.set_updated_at();
create trigger set_categories_updated_at before update on public.categories for each row execute function public.set_updated_at();
create trigger set_products_updated_at before update on public.products for each row execute function public.set_updated_at();
create trigger set_product_variants_updated_at before update on public.product_variants for each row execute function public.set_updated_at();
create trigger set_collections_updated_at before update on public.collections for each row execute function public.set_updated_at();
create trigger set_site_settings_updated_at before update on public.site_settings for each row execute function public.set_updated_at();
create trigger set_hero_slides_updated_at before update on public.hero_slides for each row execute function public.set_updated_at();
create trigger set_site_sections_updated_at before update on public.site_sections for each row execute function public.set_updated_at();
create trigger set_orders_updated_at before update on public.orders for each row execute function public.set_updated_at();
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.media_library enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.tags enable row level security;
alter table public.product_tags enable row level security;
alter table public.collections enable row level security;
alter table public.collection_products enable row level security;
alter table public.site_settings enable row level security;
alter table public.hero_slides enable row level security;
alter table public.site_sections enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.import_jobs enable row level security;
alter table public.import_rows enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles_self_read" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "profiles_admin_write" on public.profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "media_public_read" on public.media_library for select to anon, authenticated using (deleted_at is null);
create policy "media_staff_manage" on public.media_library for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "categories_public_read" on public.categories for select to anon, authenticated using (active = true and deleted_at is null);
create policy "categories_staff_manage" on public.categories for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "products_public_read" on public.products for select to anon, authenticated using (status = 'active' and deleted_at is null);
create policy "products_staff_manage" on public.products for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "variants_public_read" on public.product_variants for select to anon, authenticated using (active = true and exists (select 1 from public.products p where p.id = product_id and p.status = 'active' and p.deleted_at is null));
create policy "variants_staff_manage" on public.product_variants for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "product_images_public_read" on public.product_images for select to anon, authenticated using (exists (select 1 from public.products p where p.id = product_id and p.status = 'active' and p.deleted_at is null));
create policy "product_images_staff_manage" on public.product_images for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "tags_public_read" on public.tags for select to anon, authenticated using (true);
create policy "tags_staff_manage" on public.tags for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "product_tags_public_read" on public.product_tags for select to anon, authenticated using (true);
create policy "product_tags_staff_manage" on public.product_tags for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "collections_public_read" on public.collections for select to anon, authenticated using (active = true);
create policy "collections_staff_manage" on public.collections for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "collection_products_public_read" on public.collection_products for select to anon, authenticated using (true);
create policy "collection_products_staff_manage" on public.collection_products for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "settings_public_read" on public.site_settings for select to anon, authenticated using (true);
create policy "settings_admin_manage" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "hero_public_read" on public.hero_slides for select to anon, authenticated using (active = true and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at >= now()));
create policy "hero_staff_manage" on public.hero_slides for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "sections_public_read" on public.site_sections for select to anon, authenticated using (active = true);
create policy "sections_staff_manage" on public.site_sections for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "orders_self_read" on public.orders for select to authenticated using (user_id = auth.uid() or public.is_staff());
create policy "orders_staff_manage" on public.orders for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "order_items_read" on public.order_items for select to authenticated using (public.is_staff() or exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));
create policy "order_items_staff_manage" on public.order_items for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "imports_staff_manage" on public.import_jobs for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "import_rows_staff_manage" on public.import_rows for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "audit_admin_read" on public.audit_logs for select to authenticated using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('mdfantasy-media', 'mdfantasy-media', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
on conflict (id) do nothing;

create policy "mdfantasy_media_public_read" on storage.objects for select to public using (bucket_id = 'mdfantasy-media');
create policy "mdfantasy_media_staff_upload" on storage.objects for insert to authenticated with check (bucket_id = 'mdfantasy-media' and public.is_staff());
create policy "mdfantasy_media_staff_update" on storage.objects for update to authenticated using (bucket_id = 'mdfantasy-media' and public.is_staff()) with check (bucket_id = 'mdfantasy-media' and public.is_staff());
create policy "mdfantasy_media_staff_delete" on storage.objects for delete to authenticated using (bucket_id = 'mdfantasy-media' and public.is_staff());

insert into public.site_settings (singleton, business_name, whatsapp_number, default_whatsapp_message, city, country)
values (true, 'MDFantasy', '51938634695', 'Hola MDFantasy, quiero consultar por un producto personalizado.', 'Lima', 'Perú')
on conflict (singleton) do nothing;
