# Acceso administrativo de Supabase

El registro de Supabase está habilitado para el proyecto, pero requiere confirmación de correo antes de crear una sesión. La mejora publicada en el checkpoint `6ab54ca9` añade un destino de confirmación hacia `/admin`, mensajes visibles de estado y reenvío de enlace de activación.

La comprobación inmediata de `https://mdfantasy.shop/admin?v=6ab54ca9` todavía sirvió el formulario anterior, reconocible por el texto **“Crear la primera cuenta administrativa”**. La propagación del bundle corregido debe verificarse antes de pedir un nuevo intento de creación de cuenta.

La auditoría posterior confirmó que el registro de Supabase está habilitado, pero exige confirmación de correo. No se creó una cuenta nueva durante el intento reciente: ya existe una única cuenta administrativa, confirmada y activa, con rol `admin`. Para evitar depender de una nueva invitación, el formulario incorpora recuperación de contraseña: solicita un enlace con destino `/admin?recovery=1` y permite definir una nueva clave desde ese enlace antes de abrir Productos.

La primera lectura del dominio de proyecto tras el checkpoint `cc45bc40` aún presentó el formulario anterior, sin la opción **“Olvidé mi contraseña”**. El código, pruebas y build contienen el flujo de recuperación; falta confirmar la propagación del bundle antes de solicitar el restablecimiento desde el navegador del usuario.

El flujo de recuperación ya se propagó posteriormente al dominio `mdfantasy.shop` y Supabase aceptó la solicitud para la cuenta administrativa existente. El usuario informó que el correo no llegó. Una consulta puntual a los registros unificados de Auth devolvió un error interno del backend de registros, por lo que no aportó un estado de entrega verificable.

La cuenta indicada para recuperación (`xavimark.1706@gmail.com`) no está vinculada a un perfil de Auth confirmado en este proyecto, por lo que Supabase no creó ni entregó un enlace de recuperación. El único perfil administrativo confirmado está asociado a un correo distinto. No se modifica su contraseña hasta que el propietario confirme que esa es la cuenta que desea recuperar.

Tras la confirmación expresa del propietario, se estableció una contraseña temporal segura para la cuenta administrativa confirmada. El inicio de sesión de Supabase se completó y, una vez autenticada la sesión de Manus, `/admin/productos` presentó el gestor de Productos por categoría con los controles de **Categoría** y **Sección** en cada ficha.

La consulta de perfil confirmó que la cuenta administrativa estaba activa y ya tenía rol `admin`; no fue necesario modificar privilegios. La prueba operativa de categoría y sección se completó y el producto usado para validación se restauró a su ubicación original.

## Limitación de cuentas nuevas y método operativo

La creación y recuperación de cuentas nuevas depende del proveedor de correo administrado por Supabase. Aunque Auth aceptó la solicitud, la entrega de correo no pudo verificarse y los registros de Auth devolvieron un error interno al consultar el estado del envío. Por tanto, la creación de administradores adicionales mediante enlace de correo se considera una **limitación externa pendiente**.

El acceso de la cuenta administrativa existente quedó operativo mediante una contraseña temporal autorizada por el propietario. Debe cambiarse desde el panel después del próximo inicio de sesión. Si se requieren más administradores, la alternativa recomendada es crear el usuario desde la consola de Supabase o configurar un proveedor SMTP propio antes de invitarlo desde la interfaz.
