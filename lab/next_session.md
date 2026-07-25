# Next Session: EugenIA Lab / Biblioteca Viva

Agenda y preparación para la próxima sesión de trabajo.

## Arranque recomendado (actualizado 2026-07-25, cierre de sesión larga)

**Todo lo que estaba construido y sin desplegar YA ESTÁ EN PRODUCCIÓN.** Se cerró el pendiente que arrastraba desde el 18 de julio (Fase D, "Tus resultados" y auditoría de defendibilidad) y además se hizo una ronda nueva de utilidad científica. La app en `https://web-beta-hazel-49.vercel.app` sirve hoy:

- Exportación del corpus a **BibTeX, RIS y CSV** (para Zotero, Mendeley, EndNote o una hoja de cálculo).
- **Guardar y cargar el proyecto** como archivo. Antes el progreso vivía solo en `localStorage`: quien usaba el QR en el teléfono y luego abría su laptop perdía todo.
- **Búsqueda auditable:** se ve la consulta que se ejecutó y su origen, se puede reescribir, filtrar por año y por tipo de documento, y se ve cuántos resultados dio cada base. Cada búsqueda queda registrada y el informe trae un **párrafo de métodos listo para pegar** en un manuscrito.
- **Tres bases de datos** (OpenAlex, Europe PMC y Crossref), 12 resultados por búsqueda en vez de 8, y abstracts completos en vez de cortados a la mitad.

**Contención de costo, desplegada el 2026-07-25.** Los endpoints `/api/generate` y `/api/search` ya no están abiertos: rechazan lo que no venga del dominio de la app (403), limitan el ritmo por prefijo de red (429 con `Retry-After`) y topan el tamaño del cuerpo (413). Antes de esto, cualquiera con la URL podía llamarlos desde una terminal y el gasto lo pagaba la clave del proyecto. Si alguien reporta un 429 usando la app con normalidad, la perilla es `LIMITE_POR_MINUTO` en Vercel, sin tocar código. Para depurar por qué el límite no dispara, `DIAG_CONTENCION=1` añade una cabecera de diagnóstico a cada respuesta.

**El QR impreso sigue sirviendo sin cambios**, porque apunta al alias del proyecto y no a un despliegue concreto. Está en `poster/assets/qr-produccion.svg` (para impresión) y `.png` (para pantalla); se verificó decodificándolo.

**La ponencia se cerró para imprenta sin la prueba de Kamila**, que no llegó a tiempo. Hay dos versiones de tema visual: botánica (`build_presentation.js`) y química (`build_presentation_quimico.js`). Ojo al mantenerlas: son dos scripts independientes que solo difieren en la paleta, así que un cambio de contenido va en los dos.

**Todo quedó comiteado y con push** (tres commits temáticos: ponencia, utilidad científica, documentación). El repo ya no va por detrás de producción.

Próximos pasos, en orden:

1. **Límite de gasto mensual en Anthropic** (solo Manuel, en la consola). Sigue siendo el pendiente de mayor valor y el único con riesgo sin techo. **Cobra más peso todavía después del 25 de julio:** se cerraron los tres huecos de contención que sí se pueden cerrar con código (origen, ritmo, tope de cuerpo), y lo que quedó demostrado en el proceso es que ninguno de los tres es un límite duro. El pool CGNAT del ISP permite evadir el límite por red rotando prefijos, y la cabecera `Origin` la falsifica cualquier cliente que no sea un navegador. **El tope de gasto es la única cota real que existe.** Ver `docs/decisions.md` (2026-07-25).
2. **Escanear el QR con un teléfono físico real y recorrer la app.** El pendiente más barato con más valor antes del congreso: las funciones nuevas nunca se han visto en pantalla pequeña.
3. **Modelo por tarea: discutido con números el 2026-07-25, sin decidir.** Se puede probar hoy sin tocar código poniendo `CLAUDE_MODEL=claude-opus-5` en Vercel. Si la diferencia se nota en la MDE y en la auditoría, el cambio por tarea son tres líneas, pero hay una trampa con `thinking: disabled` y los topes de `max_tokens`. Análisis completo, con costos y la trampa, en `lab/decision_log.md` (2026-07-25). No re-derivarlo.
4. Decidir el etiquetado de las columnas generadas por IA en el CSV exportado (hoy `ajuste` y `aporte_a_mi_investigacion` no se distinguen del metadato real).
5. **Congreso del Colegio de Químicos.** La MDE sigue siendo la función estrella; el registro de búsqueda y los exportadores son argumentos nuevos de credibilidad para la demo.
6. **Después del congreso, el trabajo de fondo:** extracción estructurada de variables experimentales cuantitativas, la meta del semestre de Kamila. Es el techo real de la app: hoy la MDE se construye sobre prosa, no sobre una tabla de números. Plan de 4 pasos en `lab/roadmap.md`.

Detalle completo en `docs/handoff.md` (entrada 2026-07-25), `docs/current-status.md` y `docs/decisions.md` (4 entradas del 2026-07-25).

---

## Arranque recomendado (actualizado 2026-07-18, cierre de sesión larga)

**Sesión larga del 2026-07-18, en orden:**

1. **Fase C desplegada y aprobada:** borradores de párrafo citados por sección + tabla comparativa + estilos de cita APA/ACS/Vancouver en el informe de evidencia. Manuel la revisó, la aprobó ("perfectamente alineado" con el trabajo de Kamila) y pidió desplegarla de inmediato. **En producción.**
2. **Fase D (primera pasada de lenguaje) y higiene operativa (alias de Vercel confirmado, QR generado):** comiteadas.
3. **Primer paso del "compañero de defendibilidad" construido y verificado, NO desplegado.** A pedido de Manuel (para mencionarlo en el póster como trabajo en curso): paso "Tus resultados" (100% manual) y paso "Auditoría de defendibilidad" (6 dimensiones, cada señal anclada a fuente real, ausencia declarada, o resultado propio, nunca a intuición del modelo). Verificado a fondo contra la API real, con foco especial en probar que el modelo NO inventa señales cuando falta evidencia (prueba con aserción dura: cero señales fabricadas). Se le mostró a Manuel una vista previa visual (artefacto publicado en la sesión) con contenido real. **Quedó pendiente que Manuel la revise y apruebe el despliegue.**

Detalle completo en `docs/handoff.md` (entrada 2026-07-18), `docs/current-status.md`, `docs/vision-app.md` y `docs/decisions.md`.

Nota operativa: la sesión se corrió desde la laptop de Manuel (no la máquina habitual), sin Node.js global ni sesión de Vercel CLI; se resolvió con el Node portátil ya presente en el repo y Manuel corriendo `vercel login` él mismo. Si la próxima sesión arranca desde esa laptop, hay que repetir el paso de agregar `.tools/node-v22.23.0-win-x64` al PATH antes de cualquier comando `npm`/`npx`/`vercel`.

Próximos pasos, en orden:

1. **Manuel revisa la vista previa de la auditoría de defendibilidad** y decide si se despliega (Fase D también sigue sin desplegar, se puede agrupar).
2. **Prueba en frío de Kamila** con la versión ya adelantada en producción (sigue pendiente; ella se atrasó y reacciona hasta el lunes). Es el hito de validación más importante.
3. Manuel recorre producción en teléfono físico cuando pueda.
4. Decidir si se amplían los estilos de cita (hoy aproximados por falta de volumen/páginas en las fuentes gratuitas) y si se quiere una salida específica por formato de divulgación.
5. Cuando se apruebe la auditoría: mencionarla en el póster como trabajo en curso (fuera de esta sesión, con su propia verificación visual).
6. Higiene: solo queda el límite de gasto mensual en Anthropic (Manuel, en la consola).

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

- ~~Ampliar la búsqueda: reintento con consulta más amplia cuando OpenAlex devuelve 0 resultados, y añadir Crossref y PubMed como fuentes secundarias (PubMed es fuerte en fitoquímica).~~ **Cerrado el 2026-07-25, con una corrección basada en medición:** el reintento amplio y Europe PMC se hicieron el 2026-07-12, y Crossref se añadió el 2026-07-25. **PubMed se probó y se descartó:** devolvió 1 resultado y 0 que Europe PMC no tuviera ya, porque Europe PMC indexa MEDLINE/PubMed. La intuición de que "PubMed es fuerte en fitoquímica" es correcta, pero esa fortaleza ya llega por Europe PMC. También se descartaron Semantic Scholar (HTTP 429 sin llave) y DOAJ (0 resultados en consultas específicas). No reabrir sin datos nuevos; ver `docs/decisions.md` (2026-07-25).
- Evaluar usar un modelo más barato (Haiku) solo para los pasos mecánicos de la búsqueda, para bajar el costo por uso.

---

## Pendientes / higiene

- ~~**Rotar la `ANTHROPIC_API_KEY`**: quedó visible en el historial de una sesión de Code. Crear una nueva en console.anthropic.com, actualizarla en Vercel (Settings del proyecto, entorno Production) y en `web/.env.local`, y borrar la anterior.~~ **Hecho 2026-07-12:** clave nueva generada por Manuel directamente en console.anthropic.com (nunca pasó por el chat), actualizada en `web/.env.local` y en los 3 entornos de Vercel, producción redesplegada, y la clave vieja ya revocada por Manuel el mismo día. Rotación cerrada del todo. Detalle en `docs/current-status.md`.
- Considerar un **límite de gasto mensual** en la consola de Anthropic (la app es pública vía QR).
- ~~Generar el **QR** apuntando a la URL pública para el póster.~~ **Hecho el 2026-07-18** (`poster/assets/qr-produccion.svg` y `.png`), y reverificado el 2026-07-25 decodificándolo: apunta al alias vigente, no hay que regenerarlo.

---

## Notas para arrancar rápido mañana

- Para desplegar cambios: desde `web/`, `npx vercel --prod`.
- Para verificar que el backend está vivo: abrir `TU-URL/api/search` debe dar `{"error":"Metodo no permitido"}`.
- ~~El servidor local (`vercel dev`) dio problemas leyendo la clave; para probar conviene usar la URL de producción en ventana de incógnito.~~ **Corregido 2026-07-09:** la causa era que `ANTHROPIC_API_KEY` solo estaba guardada en Vercel para los entornos Production/Preview, no Development. Se agregó también a Development (`npx vercel env add ANTHROPIC_API_KEY development`) y se confirmó que `vercel dev` local ya funciona de punta a punta. Detalle en `docs/testing.md` y `docs/current-status.md`.
