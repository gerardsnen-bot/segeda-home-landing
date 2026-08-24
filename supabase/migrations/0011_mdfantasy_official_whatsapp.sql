-- Mantiene el contacto administrable alineado con el número oficial de MDFantasy.
update public.site_settings
set whatsapp_number = '51938634695'
where singleton = true;
