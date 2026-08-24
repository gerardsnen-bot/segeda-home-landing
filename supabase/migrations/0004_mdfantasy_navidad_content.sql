-- Configuración administrable de la Preventa Navideña.
insert into public.site_sections (section_key, internal_name, title, description, cta_label, cta_url, active, sort_order, payload)
values (
  'navidad-preventa',
  'Preventa Navideña',
  'Preventa Navideña',
  'Elige uno, combina varios o repite tu modelo favorito. Los detalles de cada diseño se coordinan cómodamente por WhatsApp.',
  'Pedir por WhatsApp',
  'https://wa.me/51978642447',
  true,
  20,
  '{"regular_price":109,"single_price":79,"multi_price":69,"multi_minimum":2,"production_days":"5 a 7 días","reserve_message":"Reserva con 50%","shipping_message":"Envíos a todo el Perú"}'::jsonb
)
on conflict (section_key) do update set
  internal_name = excluded.internal_name,
  title = excluded.title,
  description = excluded.description,
  cta_label = excluded.cta_label,
  cta_url = excluded.cta_url,
  active = excluded.active,
  sort_order = excluded.sort_order,
  payload = excluded.payload,
  updated_at = now();
