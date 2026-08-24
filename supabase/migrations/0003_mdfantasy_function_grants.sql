-- Restringe funciones internas que solo deben ejecutarse desde triggers o políticas RLS.
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.is_staff() from public, anon, authenticated;
revoke all on function public.is_admin() from public, anon, authenticated;

-- El bootstrap inicial requiere sesión válida, pero nunca acceso anónimo.
revoke all on function public.claim_initial_admin() from public, anon;
grant execute on function public.claim_initial_admin() to authenticated;
