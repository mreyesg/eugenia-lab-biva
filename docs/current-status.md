# Current status (snapshot técnico para agentes)

**Última actualización:** 2026-07-13 (segunda ronda: validación B+ y promoción a producción).

Este archivo es el snapshot *técnico/operativo* para que un agente nuevo sepa en qué estado está el código sin leer el chat. Para el snapshot *de investigación/estudiantes* (Kamila, fases del estudio de Plectranthus), ver `lab/project_state.md`, que se mantiene por separado y no se duplicó aquí.

## Infraestructura

- **Runtime Node fijado en 22.x (2026-07-13):** `web/package.json`, `web/package-lock.json` y `web/.nvmrc` declaran Node 22. Como el equipo no tiene gestor de versiones y Chocolatey requiere privilegios administrativos, se instaló Node 22.23.0 portátil en `.tools/` (ignorado por Git). `scripts/vercel-dev-node22.ps1` inicia Vercel Dev en el puerto 3005 usando explícitamente ese runtime.
- **Control de versiones:** existe desde 2026-07-12. Repo git inicializado en la raíz, primer commit hecho, y subido a GitHub como `mreyesg/eugenia-lab-biva` (privado). `.gitignore` (raíz y `web/.gitignore`) excluye `node_modules/`, `web/.env.local`, `web/.vercel/`; verificado con `git check-ignore` antes del primer commit que nada sensible quedó staged.
- **Hosting:** Vercel, proyecto `web` (org `mreyesgs-projects`, `projectId: prj_NSR0I03nKcM0kyjKlg1bw4UBBM5P`).
- **Preview B+ (2026-07-13):** `https://web-qkumuraw9-mreyesgs-projects.vercel.app`, deployment `dpl_8g6dn6eNYN6GRwLbke71rKekagRR`, construido con Node 22.23.0. Manuel abrió el Preview y confirmó que la diferencia entre Modo investigador y Modo guiado se entiende. **Ya promovido a producción, ver entrada siguiente.**
- **2026-07-13 (segunda ronda): B+ promovido a producción, con un fix aplicado en el camino.** Se validó el Preview de punta a punta con Playwright (emulación móvil iPhone 13, con el bypass de automatización de Vercel activado solo durante la prueba, ver `docs/decisions.md`): portada, Modo investigador, Componentes del trabajo, búsqueda real, aceptación de referencias, MDE, síntesis, resumen, informe de evidencia, descarga de texto e impresión/PDF. Todo funcionó sin excepciones de JavaScript. Se desplegó a producción (`vercel --prod`, deployment `dpl_Exk9ie42BUk2Med7sXVh4eQSUsso`).

  Al repetir la verificación **contra producción ya desplegada**, una corrida del paso "Componentes del trabajo" devolvió solo 1 de los 4 componentes esperados, con un fragmento de JSON sin cerrar filtrándose como texto visible al final de la descripción (síntoma de respuesta truncada por `max_tokens`, ver causa abajo). Repetido por `curl` directo, 3/3 intentos salieron limpios (4/4 componentes), así que es una falla de baja probabilidad, no determinística, pero con riesgo real en una demo pública en vivo.

  **Causa:** en `web/api/generate.js`, la tarea `mapa` (y `divulgacion`) no tenían `maxTokens` propio y usaban el default de 1600, insuficiente cuando el modelo no respeta la instrucción de "1-2 oraciones" y genera descripciones más largas para los 4 (o 5-8, en divulgación) ítems. El handler tampoco revisaba `stop_reason === "max_tokens"` antes de intentar `JSON.parse`, así que una respuesta truncada podía colarse parcialmente a la pantalla del usuario en vez de fallar limpio.

  **Fix aplicado y redesplegado (deployment `dpl_5bdyoCA9x3ioQxWgrBkqyT4ywuGQ`):** `mapa` y `divulgacion` ahora piden `maxTokens: 2200` (mismo orden de magnitud que `mde` y `sintesis`, que ya lo tenían). El handler agregó un guard explícito: si `stop_reason === "max_tokens"`, responde `502` con `{"error":"La respuesta del agente quedo incompleta. Intenta de nuevo."}` en vez de intentar parsear JSON truncado. Verificado con 4 llamadas directas más a `/api/generate` (tarea `mapa`) contra producción tras el fix: 4/4 limpias.

- **URL de producción:** `https://web-beta-hazel-49.vercel.app`. Confirmado con `vercel alias ls` que hay 3 alias apuntando al mismo deployment actual (13h de antigüedad al momento de revisar):
  - `web-beta-hazel-49.vercel.app` (la que usan `lab/next_session.md` y el README)
  - `web-mreyesgs-projects.vercel.app`
  - `web-mreyesg-mreyesgs-projects.vercel.app`

  Los tres sirven lo mismo hoy. No hay una alias "fija" elegida deliberadamente para el QR del póster; si un despliegue futuro no incluye `--prod` o cambia de nombre, no está garantizado que seguirán apuntando al mismo sitio. Pendiente: decidir uno y, si se quiere estabilidad, fijarlo con `vercel alias set`.

- **Variables de entorno en Vercel** (`npx vercel env ls`, verificado 2026-07-12): `ANTHROPIC_API_KEY` presente y separada en los 3 entornos (`Production`, `Preview`, `Development`), cada una agregada independientemente (ya no una sola entrada compartiendo Production+Preview como antes).

  Historial relevante:
  - 2026-07-09: se descubrió que `ANTHROPIC_API_KEY` no estaba en el entorno `Development`, causa raíz de que `vercel dev` local fallara. Se agregó y se confirmó de punta a punta (`POST /api/generate` → HTTP 200).
  - **2026-07-12: se rotó la clave completa.** La clave vieja (la que había quedado expuesta en el historial de una sesión de Code, pendiente documentado desde antes de este arnés) se generó de nuevo en console.anthropic.com por Manuel directamente (nunca pasó por el chat), se reemplazó en `web/.env.local`, se removió de los 3 entornos en Vercel (`vercel env rm`) y se volvió a subir la nueva (`vercel env add`, leyendo el valor de `.env.local` vía pipe para que nunca apareciera en la salida de ninguna herramienta). Producción se redesplegó (`vercel --prod`) para que sirviera con la clave nueva de inmediato. Confirmado con `POST /api/generate` local (HTTP 200) y con `bash scripts/verify.sh --network` contra producción (0 fallos).
  - **2026-07-12 (mismo día): Manuel confirmó que ya revocó la clave vieja en console.anthropic.com.** Rotación cerrada del todo, no queda ninguna acción pendiente sobre esto.

## Funcionalidad de la app (`web/`)

Confirmado por inspección de código, no solo por lo que dice `lab/project_state.md` (aunque coincide):

- Navegación adaptada por perfil, persistencia en `localStorage`. El modo investigador omite fricción, formulación guiada y reflexión; el modo guiado conserva el recorrido completo.
- `POST /api/generate` acepta 8 tareas: `friccion`, `pregunta`, `mapa`, `divulgacion`, `notas`, `mde`, `sintesis`, `reenfoque`. Devuelve 500 con `{"error":"El servidor no tiene configurada la clave de la API."}` si `ANTHROPIC_API_KEY` no está en el entorno donde corre.
- **2026-07-13: Fase B y primera entrega B+, validadas y desplegadas a producción (ver detalle de infraestructura arriba).** La portada ofrece entrada rápida de investigador (tema, pregunta, abstract y objetivo) o recorrido guiado. La tarea `sintesis` compara las referencias aceptadas y devuelve consensos, contradicciones y brechas con implicación, confianza e índices de fuentes. El informe de evidencia reúne foco, síntesis, MDE y referencias; se imprime/guarda como PDF o descarga como texto. Los chips `fuerza` se renombraron a `Ajuste directo/parcial/tangencial`, porque miden pertinencia para el componente y no calidad metodológica.
- **2026-07-13: selector de modo aclarado localmente.** La portada nombra explícitamente `Modo investigador` y `Modo guiado`, explica para quién sirve cada uno y muestra su recorrido resumido. Durante el trabajo, el encabezado conserva visible el modo activo y permite volver a cambiarlo.
- **2026-07-13: procedencia bibliográfica aclarada localmente.** El paso Bibliografía indica que consulta directamente OpenAlex y Europe PMC, explica que Crossref/PubMed son parte de la cobertura agregada pero no endpoints separados, y declara que Scopus, Web of Science y Google Scholar aún no están integrados. Cada resultado muestra ahora su fuente directa como chip.
- **2026-07-12: Reenfoque desde los artículos aceptados (desplegado).** En el paso de Bibliografía, con 2+ referencias aceptadas, aparece "Reenfocar desde mis artículos": propone un foco reformulado que emerge de lo que el investigador seleccionó, incluso si gira respecto al original. Adopta (actualiza idea/pregunta) o conserva el original. Ver `docs/vision-app.md` y `lab/decision_log.md`.
- **2026-07-12: Recall mejorado (desplegado).** `search.js` ahora busca en OpenAlex y Europe PMC (ambas gratis, sin llave), intercala las dos fuentes para que ninguna domine, deduplica por DOI/título, y reintenta con una consulta más amplia si salen menos de 3 resultados. Probado en producción: para una consulta biomédica devuelve 4 de OpenAlex y 4 de Europe PMC, con aporte y fuerza intactos. Nota de diseño: se probó ordenar por citas pero sesgaba todo hacia OpenAlex, por eso se intercala en vez de ordenar.
- **2026-07-12: arrancó la Fase A del reposicionamiento a herramienta de investigador** (ver `docs/vision-app.md` y `lab/decision_log.md`). Lo desplegado y probado en producción hoy:
  - Nueva etapa **Matriz de Decisión** (tarea `mde`) entre Bibliografía viva y Notas. Genera, adaptándose a cualquier disciplina, entre 3 y 6 dimensiones de decisión a partir de las referencias aceptadas, cada fila con evidencia curada, criterio adoptado, y chips que enlazan a las fuentes reales por DOI. Probado en vivo: con datos de química dio 5 dimensiones bien fundamentadas y con índices de fuente correctos.
  - El paso **"Mapa bibliográfico"** se reencuadró a **"Componentes del trabajo"**: la tarea `mapa` ahora genera 4 componentes de manuscrito (Justificacion y brecha, Metodos, Comparacion de resultados, Discusion y contraste) en vez de 5 perspectivas abstractas. La búsqueda del paso 5 ahora corre por componente.
  - `migrateState()` rellena claves nuevas (como `mde`) en proyectos ya guardados en `localStorage`, para no romper el progreso de quien ya usó la app.
  - Intro relanzada con lenguaje de investigador. Falta el pulido de lenguaje en el resto de la app (Fase D).
  - **Motor enriquecido (segunda parte de Fase A):** `search.js` ahora devuelve `tipo_doc` (tipo de documento de OpenAlex) y `fuerza` (alta/media/baja, evaluada por Claude según qué tan directamente el artículo sostiene ese componente). El frontend los muestra como chips (`signalChips`) en candidatos y referencias aceptadas, junto a revista, citas, año y acceso abierto. Con esto la **Fase A quedó completa**. Siguientes fases (B síntesis, C salidas de publicación, D modo investigador + pulido de lenguaje) pendientes, ver `docs/vision-app.md`.
- **2026-07-12: Paso 6 (notas de lectura) ganó una sugerencia de IA opcional.** `CLAUDE.md` documentaba que ese paso debía ser deliberadamente manual; la agenda vieja en `lab/next_session.md` pedía automatizarlo por completo. Se resolvió el conflicto con un punto medio confirmado por Manuel: un botón "Sugerir con IA" (deshabilitado si la referencia no tiene `resumen` real, es decir, si se agregó a mano) rellena un borrador editable en las 3 cajas de texto; nada se guarda sin que el estudiante pase por "Guardar ficha" explícitamente. Ver `lab/decision_log.md` para el detalle de la decisión de producto y `docs/module-map.md` para las líneas exactas tocadas.
- `POST /api/search` motor bibliométrico vía OpenAlex + Claude, sin inventar citas.
- Probado con `curl` directo contra `vercel dev` local, ambos escenarios: el endpoint devuelve el error esperado cuando la clave falta, y devuelve HTTP 200 con contenido real una vez la clave está disponible (confirmado de nuevo tras la rotación del 2026-07-12).

## Verificación

- `node --check` pasa en los 3 archivos `.js` reales del proyecto (`web/api/generate.js`, `web/api/search.js`, `poster/src/build_poster.js`). Ver `docs/testing.md`.
- No se corrió una verificación visual del póster en esta sesión (no se tocó `build_poster.js`).
- El JavaScript embebido pasó `node --check` con Node 22.23.0. El contrato de `sintesis` pasó con `fetch` simulado y también en una llamada real directa a Anthropic: HTTP 200, consensos y brechas estructurados con confianza y fuentes. `vercel dev` en Windows sigue fallando para POST con `NotSupportedError: expect header not supported` aun bajo Node 22; el runtime y el backend se validaron por separado y el Preview construyó correctamente.
- **2026-07-13 (segunda ronda): primera verificación real en navegador de punta a punta.** `web/index.html` sí se abrió en un navegador (Chromium headless vía Playwright, emulación iPhone 13) contra el Preview y luego contra producción, con las 8 etapas del Modo investigador recorridas y las llamadas reales a `/api/generate` y `/api/search` funcionando (no simuladas). 0 excepciones de JavaScript en ambas corridas. Encontró el bug de truncamiento en `mapa` descrito arriba, que ya se corrigió y redesplegó. `bash scripts/verify.sh` (sin `--network`) también se corrió y pasó, 0 fallos.

## Pendientes activos

- Definir límite de gasto mensual en la consola de Anthropic.
- Generar el QR hacia la URL de producción elegida.
- Decidir cuál de los 3 alias de Vercel es "el" link oficial para el QR (`web-beta-hazel-49.vercel.app` es el que se usa hoy en la práctica, pero no se fijó explícitamente con `vercel alias set`).
- Llenar `lab/roadmap.md` (sigue casi vacío).
- Considerar si `friccion`, `pregunta` y `notas` (que se quedaron en el `maxTokens` default de 1600) necesitan el mismo margen que se le dio a `mapa` y `divulgacion`; por ahora no se ha visto evidencia de que trunquen, pero tampoco se probaron a fondo en esta ronda.
