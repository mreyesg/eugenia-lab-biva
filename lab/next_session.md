# Next Session: EugenIA Lab / Biblioteca Viva

Agenda y preparación para la próxima sesión de trabajo.

## Arranque recomendado (actualizado 2026-07-18, cierre de sesión)

**En la sesión del 2026-07-18 se avanzó y desplegó la Fase C (salidas para publicar):** el informe de evidencia ahora genera borradores de párrafo citados por sección (justificación, métodos, comparación, discusión) más una tabla comparativa de fuentes, y ofrece un selector de estilo de cita APA / ACS / Vancouver. Manuel revisó una vista previa visual, la aprobó ("perfectamente alineado" con el trabajo de Kamila), y pidió desplegar de inmediato para que ella acceda a una versión más adelantada. **Ya está en producción**, verificado con una llamada real contra `web-beta-hazel-49.vercel.app`. Detalle en `docs/handoff.md` (entrada 2026-07-18), `docs/current-status.md` y `docs/decisions.md` (2026-07-18).

Nota operativa: el despliegue se hizo desde la laptop de Manuel (no la máquina habitual), que no tenía Node.js global ni sesión de Vercel CLI; se resolvió con el Node portátil ya presente en el repo y Manuel corriendo `vercel login` él mismo. Si la próxima sesión arranca desde esa laptop, hay que repetir el paso de agregar `.tools/node-v22.23.0-win-x64` al PATH antes de cualquier comando `npm`/`npx`/`vercel`.

Próximos pasos, en orden:

1. **Prueba en frío de Kamila** con la versión ya adelantada en producción (sigue pendiente; ella se atrasó y reacciona hasta el lunes). Es el hito de validación más importante.
2. Manuel recorre producción en teléfono físico cuando pueda.
3. Decidir si se amplían los estilos de cita (hoy aproximados por falta de volumen/páginas en las fuentes gratuitas) y si se quiere una salida específica por formato de divulgación.
4. Higiene de siempre: límite de gasto mensual en Anthropic, fijar el alias oficial de Vercel para el QR, generar el QR.

---

## Arranque recomendado para 2026-07-14

**El plan que estaba aquí ya se hizo el 2026-07-13** (segunda y tercera ronda del mismo día): el recorrido completo del Modo investigador se validó con un navegador real, se corrigió un bug de truncamiento en "Componentes del trabajo", y se agregaron dos mejoras al motor de evidencia (señal de acceso cerrado con recomendación manual, y subida de PDF propio con extracción de referencia). **B+ con ambas mejoras ya está en producción** (`https://web-beta-hazel-49.vercel.app`). Detalle completo en `docs/handoff.md`, `docs/current-status.md` y `lab/decision_log.md` (entrada 2026-07-13).

**El siguiente paso es la validación real pendiente desde hace días: dar la app a Kamila para que la use sola, sin guía, y ver qué logra.** Es la prueba que de verdad responde si la app aporta valor, no otra ronda de pruebas automatizadas por un agente.

1. Compartir el link de producción con Kamila, sin acompañarla mientras la usa.
2. Recoger qué logró, dónde se perdió, y qué le pareció confuso o útil, directamente de ella.
3. Con eso en mano, decidir los próximos ajustes (probablemente más informativo que seguir adivinando mejoras desde afuera).
4. Pendiente aparte, porque requiere a Manuel en persona: recorrer producción en un **teléfono físico real** (lo hecho hasta ahora fue emulación de viewport móvil en Chromium headless).

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
