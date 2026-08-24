-- Las funciones booleanas se emplean exclusivamente dentro de políticas RLS.
-- Las personas autenticadas necesitan poder evaluarlas para que las políticas de administración funcionen.
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_staff() to authenticated;
