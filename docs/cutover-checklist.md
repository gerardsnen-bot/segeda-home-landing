# Corte seguro: Manus → Cloudflare Pages

## Estado preparado

- Zona Cloudflare: `mdfantasy.shop` (`77cbace575d975544d0656d3011dbb9a`)
- Estado actual: **pending**. No se ha modificado el DNS activo.
- Nameservers actuales de Hostinger: `hermes.dns-parking.com`, `artemis.dns-parking.com`
- Nameservers Cloudflare asignados: `mina.ns.cloudflare.com`, `patryk.ns.cloudflare.com`
- La zona fue creada sin registros importados; por eso no debe activarse antes de completar Pages y recrear los registros necesarios.

## Bloqueo externo identificado

Al crear el proyecto Pages por API, Cloudflare devolvió el error de instalación GitHub `8000011`. Esto se resuelve en Cloudflare Dashboard:

1. Abrir **Workers & Pages → Create application → Pages → Import an existing Git repository**.
2. Si Cloudflare pide reinstalar o autorizar GitHub, aceptar la conexión y conceder acceso a `gerardsnen-bot/segeda-home-landing`.
3. Seleccionar la rama `main` y usar los parámetros indicados en [`cloudflare-pages-variables.md`](cloudflare-pages-variables.md).
4. Esperar al primer despliegue y verificar en el subdominio `*.pages.dev`:
   - Inicio, categorías y fichas de producto.
   - Carrito y cálculo de Preventa Navideña (S/75 por unidad / 2 por S/135).
   - Panel `/admin`, inicio de sesión y edición de contenido.

## Antes de cambiar DNS

- [ ] Pages publica correctamente desde GitHub `main`.
- [ ] Las dos variables públicas de Supabase están configuradas en Pages.
- [ ] Supabase Auth tiene las Redirect URLs de producción y de Pages.
- [ ] Se comprobó que el catálogo, las imágenes y el panel funcionan desde `*.pages.dev`.
- [ ] Se añadieron los dominios `mdfantasy.shop` y `www.mdfantasy.shop` como Custom Domains en Pages.
- [ ] Se anotaron los registros DNS que Pages muestra para cada dominio.

## Cambio controlado en Hostinger

Solo después de completar las validaciones anteriores, en Hostinger cambia los nameservers del dominio por:

```text
mina.ns.cloudflare.com
patryk.ns.cloudflare.com
```

Cloudflare se activará normalmente en unas horas, aunque la propagación global puede tardar hasta 24 horas. Una vez activa la zona:

1. Crea o confirma los registros que Pages solicite para el apex y `www`.
2. Mantén el proxy naranja desactivado inicialmente si Pages indica **DNS only** durante su validación.
3. Verifica HTTPS, `https://mdfantasy.shop`, `https://www.mdfantasy.shop`, `/admin` y el flujo de recuperación de contraseña.
4. Cuando todo funcione, elimina en Hostinger cualquier registro que apunte a `cname.manus.space`.

> La creación de la zona no cambió el sitio actual. El único paso que conmuta tráfico es sustituir los nameservers en Hostinger; por ello debe realizarse únicamente después de validar Pages.

## Reversión

Si algo falla después del cambio de nameservers, vuelve temporalmente a los nameservers de Hostinger que estaban activos al crear la zona:

```text
hermes.dns-parking.com
artemis.dns-parking.com
```

Después revisa los registros y la publicación de Pages antes de intentar el corte de nuevo.
