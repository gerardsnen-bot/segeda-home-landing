# Acceso administrativo de Supabase

El registro de Supabase está habilitado para el proyecto, pero requiere confirmación de correo antes de crear una sesión. La mejora publicada en el checkpoint `6ab54ca9` añade un destino de confirmación hacia `/admin`, mensajes visibles de estado y reenvío de enlace de activación.

La comprobación inmediata de `https://mdfantasy.shop/admin?v=6ab54ca9` todavía sirvió el formulario anterior, reconocible por el texto **“Crear la primera cuenta administrativa”**. La propagación del bundle corregido debe verificarse antes de pedir un nuevo intento de creación de cuenta.

La auditoría posterior confirmó que el registro de Supabase está habilitado, pero exige confirmación de correo. No se creó una cuenta nueva durante el intento reciente: ya existe una única cuenta administrativa, confirmada y activa, con rol `admin`. Para evitar depender de una nueva invitación, el formulario incorpora recuperación de contraseña: solicita un enlace con destino `/admin?recovery=1` y permite definir una nueva clave desde ese enlace antes de abrir Productos.
