# Sonda de visión para clasificación pendiente MDFantasy

## Alcance y criterio

El 25 de agosto de 2026 se reanudó el proceso mediante una **única sonda controlada** antes de analizar el lote completo. El objetivo era comprobar que el modelo devolviera una respuesta estructurada, no vacía y visualmente suficiente para actualizar una clasificación sin usar el nombre, texto, categoría ni colores aislados.

## Estado antes de la sonda

| Métrica | Resultado |
| --- | ---: |
| Productos `pending_review` | 252 |
| Overrides manuales | 0 |
| Producto de sonda | `74694d1d-3720-4a10-ac37-91f4a1f1acdd` |
| Imagen principal | `https://cdn.quicksell.co/-NV9ezkowGxNeSYLnGe0/products_400/-OpeCyXMbEQM8gg3yJbz.jpg` |

## Resultado de la sonda

El modelo de visión respondió con JSON estructurado usando `gpt-5-mini`, pero marcó el resultado como `uncertain`, con confianza `0.25`. Identificó una placa en forma de nube, un personaje infantil tipo dinosaurio o dragón con corona, estrellas y un fondo de nubes. La propia evaluación concluyó que estos elementos no proporcionaban evidencia visual suficiente para una clasificación verificada como Niña o Niño.

> No se aplicó ningún cambio a Supabase. El producto evaluado y los 252 productos pendientes permanecen con `gender_review_status = pending_review`.

## Decisión

La disponibilidad técnica del modelo quedó confirmada, pero la sonda no alcanzó el umbral de evidencia necesario para actualizar un producto. Por el criterio de seguridad acordado, **no se ejecutó el lote completo** y no se infirieron clasificaciones a partir del texto, la categoría o los colores.

La siguiente reanudación deberá usar el mismo control: solo continuar con resultados que tengan evidencia visual concreta, estructurada y suficiente; todos los casos ambiguos permanecerán pendientes para revisión manual.
