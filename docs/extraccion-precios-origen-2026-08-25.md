# Extracción de precios desde la web original de Segeda Home

## Fuente inspeccionada

Se inspeccionó la URL original proporcionada por el usuario: `https://segeda-home-tienda.mad-elynnlevon7.chatgpt.site/catalogo?categoria=cuadros`.

La página carga dinámicamente la categoría **Cuadros infantiles** y muestra 170 diseños. La vista de lista confirma que los precios y medidas aparecen al abrir cada diseño. En la cuadrícula inicial, los diseños 001 a 012 muestran un precio de partida de **S/ 50**.

## Próximo paso de extracción

Se localizará el origen estructurado usado por la página para recuperar los precios por variante de todos los productos. La actualización en Supabase se limitará a asociaciones que puedan verificarse por identificador, nombre y variante; cualquier discrepancia permanecerá sin modificar.
