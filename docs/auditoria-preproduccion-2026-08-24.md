# Auditoría de preproducción — MDFantasy

**Fecha:** 24 de agosto de 2026  
**Alcance:** catálogo público, preventa navideña, carrito, WhatsApp, administración Supabase, seguridad, SEO, diseño responsive, compilación y publicación.  
**Estado actual:** **PASS / GO** — la versión publicada superó las validaciones de datos, acceso, calidad técnica, responsive y smoke test de producción.

## Resumen ejecutivo

La revisión confirmó que el catálogo administrable conserva sus datos reales, que las rutas públicas principales cargan y que el panel reconoce correctamente a la cuenta administradora. Durante la auditoría se corrigieron hallazgos concretos: exposición visual del formulario SEO para una sesión no autorizada, el número de WhatsApp desactualizado en la configuración administrable, títulos heredados de Segeda Home, una página 404 en inglés y la falta de uso uniforme del logo oficial MDFantasy en las cabeceras públicas.

| Área | Resultado | Evidencia principal |
| --- | --- | --- |
| Integridad de catálogo | Aprobado | 683 productos activos, 14 categorías activas, 0 productos sin categoría, 0 imágenes huérfanas y 0 SKU nulos. |
| Seguridad Supabase | Aprobado | Helpers de rol movidos fuera del esquema API público mediante migración `0009`; políticas RLS optimizadas mediante `0010`. |
| Contacto comercial | Aprobado | `site_settings.whatsapp_number` verificado como `51938634695` después de la migración `0011`. |
| Flujos públicos | Aprobado | Selector de categorías, búsqueda, ficha de producto, carrito persistente y preventa con precio escalonado probados en navegador. |
| Administración | Aprobado | Dashboard, productos, contenido, editor visual, SEO e historial validados con sesión administradora real. |
| Calidad técnica | Aprobado | `pnpm lint`, `pnpm test`, `pnpm check`, `pnpm build`, `pnpm audit --prod` y `pnpm dedupe --check` sin fallos bloqueantes; 8 archivos de prueba y 11 pruebas aprobadas. |
| Producción | Aprobado | Smoke test HTTP `200`, bundle actualizado, Home, categoría estándar y Navidad verificados en el dominio publicado. |

## Correcciones aplicadas

| Hallazgo | Riesgo | Corrección aplicada | Verificación |
| --- | --- | --- | --- |
| Funciones auxiliares de rol expuestas en el esquema API | Alto | Migración `0009_mdfantasy_private_role_helpers.sql` para trasladarlas al esquema privado sin interrumpir RLS. | Asesores de Supabase revisados después de aplicar la migración. |
| Evaluación RLS repetida por fila | Medio de rendimiento | Migración `0010_mdfantasy_rls_initplan.sql`. | Migración aplicada y validada. |
| SEO editable visualmente por visitantes | Medio de experiencia y control | Guarda de sesión y rol `admin`/`super_admin` en `AdminSeo`. | Vista sin permisos muestra acceso requerido; sesión administradora carga el editor SEO. |
| WhatsApp administrable antiguo | Alto comercial | Migración `0011_mdfantasy_official_whatsapp.sql` y actualización del valor base a `51938634695`. | Consulta posterior a Supabase devuelve `51938634695`. |
| Logo inconsistente entre páginas | Medio de identidad | Logo oficial MDFantasy integrado en Home, categorías y preventa navideña. | Validación visual de escritorio y móvil. |
| Títulos y 404 heredados | Medio de marca y SEO | Títulos específicos MDFantasy y nueva pantalla 404 en español con retorno al catálogo. | Navegación manual de `/catalogo/nubes`, `/catalogo/navidad`, `/admin/*` y ruta inexistente. |

## Pruebas funcionales ejecutadas

| Flujo | Resultado comprobado |
| --- | --- |
| Home `/catalogo` | Carga de colecciones, logo oficial, selector de categorías y contador de carrito. |
| Selector de categorías | Modal completo con las 14 categorías y navegación funcional a Nubes temáticas. |
| Categoría `/catalogo/nubes` | 213 diseños disponibles, búsqueda, filtros, medidas y precios visibles; ficha del producto `Diseño 204` abierta correctamente. |
| Carrito estándar | Se añadió una unidad de prueba, el contador se conservó al volver a Home, se inspeccionó el detalle y se eliminó la unidad para restaurar el estado. |
| Preventa `/catalogo/navidad` | Nueve modelos cargados; una unidad totaliza S/79 y dos modelos totalizan S/138 con precio especial aplicado; la selección de prueba se vació al terminar. |
| Panel administrativo | Dashboard con 683 productos y 14 categorías; gestor por categorías, editor visual, contenido, SEO e historial accesibles para la cuenta administradora. |
| Protección SEO | Sin sesión de Supabase no se muestran controles editables; la cuenta administradora sí carga título, descripción, palabras clave e imagen social. |
| Ruta inexistente | Pantalla `404` en español, con identidad MDFantasy y botón de retorno a `/catalogo`. |

## Validación técnica

| Comando | Resultado |
| --- | --- |
| `pnpm lint` | Aprobado sin advertencias. |
| `pnpm test` | Aprobado: 8 archivos, 11 pruebas. Incluye carrito, validación de imágenes, RLS, proxy de Storage y fallback estático. |
| `pnpm check` | Aprobado sin errores TypeScript. |
| `pnpm build` | Aprobado. Genera el bundle de cliente y servidor. |
| Reinicio limpio del servidor | Aprobado. No reapareció el fallo histórico de OAuth sobre tabla `users` después del reinicio. |

## Riesgos no bloqueantes y seguimiento recomendado

El compilador informa que el bundle principal supera el umbral de 500 kB después de minificación, con aproximadamente 316.7 kB comprimidos. No impide la salida actual, pero se recomienda una futura división dinámica de módulos administrativos para mejorar la primera carga. Asimismo, el compilador conserva las rutas `/manus-storage/...` para resolverlas en tiempo de ejecución; las capturas del catálogo confirmaron que los recursos esenciales cargan en el entorno de prueba, y el smoke test de producción deberá reconfirmarlo.

No se envió ningún mensaje real por WhatsApp durante la auditoría. Se validaron los destinos y el armado del carrito, preservando el control del usuario sobre cualquier comunicación saliente.

## Ajustes posteriores a la auditoría inicial

El **24 de agosto de 2026** se incorporó el nuevo logo oficial MDFantasy en Home, categorías y Preventa Navideña. Las capturas de escritorio y móvil confirman que se renderiza íntegro mediante un contenedor dedicado y `object-fit: contain`, sin recortes. También se habilitó la carga directa de archivos para Hero, Fe y Navidad desde el editor visual: acepta JPG, PNG, WEBP y SVG de hasta 10 MB, actualiza la vista previa y persiste la URL pública al guardar. El flujo se probó cargando nuevamente la imagen actual del Hero y verificando su reflejo en la landing sin cambio visual de contenido.

La barra de categorías de `/catalogo` ahora es fija durante el desplazamiento. La comprobación en navegador confirmó que permanece visible después de abandonar la cabecera; su diseño distribuye los diez accesos en dos filas de cinco botones, con fondo translúcido, borde dorado, reflejo interior y foco accesible. Las capturas responsive validaron la disposición compacta de dos líneas en móvil. Las verificaciones móviles finales de `/catalogo/nubes` y `/catalogo/navidad` confirmaron asimismo que el nuevo logo se muestra íntegro en ambas cabeceras.

La auditoría de repositorio no detectó archivos `.env` versionados ni patrones de claves privadas en archivos rastreados. Se saneó el historial de migraciones para retirar payloads transitorios que duplicaban los scripts SQL y todavía retenían el contacto anterior; la búsqueda final no devolvió referencias a ese número fuera del informe histórico. También se actualizaron `axios`, `drizzle-orm`, `streamdown`, `express` y `nanoid` a versiones corregidas y se eliminó el componente de gráficos no usado junto con `recharts`. Tras estos cambios, `pnpm audit --prod` finalizó con código `0`.

La comprobación final de dependencias ejecutó `pnpm dedupe --check` sin cambios pendientes. Durante la actualización de Express 5 se detectó que los comodines heredados del proxy `/manus-storage/*` y de los fallbacks `*` ya no eran válidos. Se migraron a rutas con parámetro nombrado, se añadió una prueba de registro del proxy y se verificó un reinicio limpio junto con la carga posterior de `/catalogo`.

Los enlaces renderizados de Home para contacto y creación personalizada apuntan a `https://wa.me/51938634695`; el mensaje codificado es “Hola MDFantasy, quiero crear un producto personalizado”. En categorías estándar, el artículo se agrega al carrito persistente y el usuario continúa por el checkout de Home; no se abre un mensaje desde la ficha. En Preventa Navideña, el flujo construye localmente el mensaje de reserva con modelos, cantidades y total antes de abrir `https://wa.me/51938634695?text=…`. Se inspeccionaron esas construcciones sin abrir ni enviar conversaciones.

## Smoke test de producción

La versión publicada en `https://segcatalogo-enteya63.manus.space/catalogo` respondió correctamente y mostró el nuevo logo, la barra de categorías de dos filas, las rutas públicas y el Hero con su fotografía. En la primera captura el Hero aún estaba cargando. La inspección posterior del HTML publicado identificó la URL efectiva de la imagen en el bucket público de Supabase y la solicitud HTTP devolvió `200`, `image/jpeg` y `115378` bytes; por tanto, no se identificó un defecto persistente de carga.

Un primer despliegue expuso un `500` únicamente en solicitudes nuevas, mientras que el artefacto local respondía `200`. Se reforzó el fallback estático para resolver primero `dist/public` desde el directorio de trabajo, se añadió manejo explícito de error de `index.html` y se eliminó la dependencia de un comodín de router para el fallback. La reproducción local en modo producción devolvió `200`; tras la re-publicación, una solicitud HTTP nueva a `/catalogo` devolvió `200` y sirvió el bundle `index-BSJ04kFk.js`. Finalmente, las rutas de producción `/catalogo/nubes` y `/catalogo/navidad` cargaron catálogo, 213 productos de Nubes, nueve modelos y las tarifas navideñas `S/79` y `S/69`, con títulos MDFantasy correctos.

Las comprobaciones responsive sobre el **dominio publicado** con viewport móvil de `390 × 844` confirmaron el ajuste de Home, la categoría Nubes y Preventa Navideña. Las capturas almacenadas en `mdfantasy_final_audit/production-responsive/` muestran que, en Home, las acciones principales, métricas y Hero mantienen jerarquía legible; en Nubes, el buscador, filtros, categorías temáticas y contador se adaptan a una sola columna sin recortes; y en Navidad, las dos ofertas, indicadores y acceso a modelos se conservan con tamaño y separación táctil adecuados. La misma versión de interfaz quedó publicada y validada en escritorio mediante los smoke tests del dominio.

## Dictamen final

> **PASS / GO para producción.** La versión `8dcc4bb3` quedó publicada y las rutas públicas `/catalogo`, `/catalogo/nubes` y `/catalogo/navidad` respondieron correctamente en producción. Las comprobaciones cubrieron el catálogo y sus datos, carrito, administración, RLS, Storage, WhatsApp, SEO, diseño responsive, seguridad de dependencias y fallback estático del servidor.

Quedan dos recomendaciones no bloqueantes para una iteración posterior: dividir dinámicamente módulos para reducir el bundle principal y revisar en futuras actualizaciones las advertencias de compatibilidad del complemento de localización de Vite. Ninguna de ellas impidió la compilación, el arranque, las pruebas, la carga de recursos o los flujos de compra y administración auditados.
