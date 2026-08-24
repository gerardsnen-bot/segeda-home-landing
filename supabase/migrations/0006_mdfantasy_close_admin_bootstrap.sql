-- El primer administrador ya fue activado. La función de bootstrap deja de estar disponible vía API.
revoke execute on function public.claim_initial_admin() from authenticated;
revoke execute on function public.claim_initial_admin() from anon;
