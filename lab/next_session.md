# Next Session: EugenIA Lab / Biblioteca Viva

Agenda y preparación para la próxima sesión de trabajo.

---

## Próxima sesión

**Fecha:** 2026-07-09 (aprox.)
**Enfoque:** App "Biblioteca Viva", convertir los pasos 5 y 6 en un asistente bibliométrico completo.

---

## Dónde quedamos (2026-07-08)

La app ya está **desplegada en producción** en Vercel y funcional de punta a punta:

- URL pública (para el QR): `https://web-beta-hazel-49.vercel.app`
- Las 8 etapas navegan, guardan progreso (localStorage) y bloquean "Continuar" hasta completar lo mínimo en Idea, Fricción y Pregunta.
- Paso 5 ya propone **artículos reales** por cada perspectiva del mapa (motor `api/search.js` con OpenAlex + análisis de aporte por Claude). Probado en vivo y funcionando.

Código en la carpeta `web/`. El artefacto viejo de Claude.ai (`app/biblioteca_viva_app.html`) queda solo como referencia.

---

## Agenda (próxima ronda, en orden)

1. ~~**Paso 6, fichas de lectura automáticas:** para cada referencia aceptada, generar idea principal, conceptos clave y relación con la investigación, a partir del resumen real que ya trae la búsqueda.~~ **Hecho 2026-07-12, con un ajuste:** no se automatizó por completo (chocaba con el principio de `CLAUDE.md` de que ese paso debe ser manual). Se implementó como sugerencia de IA opcional y editable, confirmado con Manuel. Detalle en `lab/decision_log.md` (2026-07-12) y `docs/current-status.md`.
2. **Reformular la pregunta/objetivos** a la luz de la literatura seleccionada.
3. **Regenerar perspectivas del mapa por separado** (conservar unas, rehacer otras).

---

## Mejoras diferidas (cuando haya tiempo)

- Ampliar la búsqueda: reintento con consulta más amplia cuando OpenAlex devuelve 0 resultados, y añadir Crossref y PubMed como fuentes secundarias (PubMed es fuerte en fitoquímica).
- Evaluar usar un modelo más barato (Haiku) solo para los pasos mecánicos de la búsqueda, para bajar el costo por uso.

---

## Pendientes / higiene

- ~~**Rotar la `ANTHROPIC_API_KEY`**: quedó visible en el historial de una sesión de Code. Crear una nueva en console.anthropic.com, actualizarla en Vercel (Settings del proyecto, entorno Production) y en `web/.env.local`, y borrar la anterior.~~ **Hecho 2026-07-12:** clave nueva generada por Manuel directamente en console.anthropic.com (nunca pasó por el chat), actualizada en `web/.env.local` y en los 3 entornos de Vercel, producción redesplegada, y la clave vieja ya revocada por Manuel el mismo día. Rotación cerrada del todo. Detalle en `docs/current-status.md`.
- Considerar un **límite de gasto mensual** en la consola de Anthropic (la app es pública vía QR).
- Generar el **QR** apuntando a la URL pública para el póster.

---

## Notas para arrancar rápido mañana

- Para desplegar cambios: desde `web/`, `npx vercel --prod`.
- Para verificar que el backend está vivo: abrir `TU-URL/api/search` debe dar `{"error":"Metodo no permitido"}`.
- ~~El servidor local (`vercel dev`) dio problemas leyendo la clave; para probar conviene usar la URL de producción en ventana de incógnito.~~ **Corregido 2026-07-09:** la causa era que `ANTHROPIC_API_KEY` solo estaba guardada en Vercel para los entornos Production/Preview, no Development. Se agregó también a Development (`npx vercel env add ANTHROPIC_API_KEY development`) y se confirmó que `vercel dev` local ya funciona de punta a punta. Detalle en `docs/testing.md` y `docs/current-status.md`.
