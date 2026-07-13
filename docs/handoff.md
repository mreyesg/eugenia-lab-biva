# Handoff — protocolo de cierre de sesión

Este archivo es el protocolo *mecánico* que cualquier agente debe seguir al cerrar una sesión de trabajo en este repo, y el registro de la última entrega. No confundir con `lab/next_session.md`, que es la agenda *de contenido* (qué investigar, qué construir) para Manuel/Kamila — ese archivo se sigue manteniendo por separado.

## Protocolo (seguir en orden al cerrar sesión)

1. Correr `bash scripts/verify.sh` desde la raíz del repo. Si falla algo, no lo dejes en silencio: anótalo en la sección "Qué quedó roto o a medias" de abajo, no lo omitas del resumen final.
2. Actualizar `docs/current-status.md` con cualquier cambio de infraestructura, endpoints, o estado de variables de entorno.
3. Si tomaste una decisión de dirección técnica (no una tarea mecánica), añade una entrada a `docs/decisions.md`. Si la decisión fue sobre dirección de investigación/producto (no sobre el harness), va en `lab/decision_log.md` en su lugar.
4. Sobrescribe la sección "Última entrega" de este archivo (abajo) con el estado real al momento de cerrar. No acumules entregas viejas aquí, para eso está el historial de decisiones.
5. Si la agenda de contenido del lab cambió (próximos pasos de investigación, no de ingeniería), actualiza también `lab/next_session.md`.

## Última entrega

**Fecha:** 2026-07-13 (segunda ronda del mismo día)
**Quién:** sesión de Claude Code.

### Qué se hizo

- Se validó el Preview B+ (`https://web-qkumuraw9-mreyesgs-projects.vercel.app`) de punta a punta con un navegador real (Playwright, emulación iPhone 13), no solo por inspección de código: portada, selección de Modo investigador, Componentes del trabajo, búsqueda real de artículos, aceptación de referencias, MDE, síntesis, resumen, informe de evidencia, descarga de texto e impresión/PDF. Como el Preview está protegido por el login de Vercel y `vercel dev` local no soporta POST en Windows, se habilitó temporalmente el "Protection Bypass for Automation" del proyecto para poder probarlo con un bot, y se desactivó al terminar (detalle y por qué en `docs/decisions.md`, entrada 2026-07-13).
- Con el Preview validado, Manuel aprobó promover a producción. Se desplegó (`vercel --prod`, deployment `dpl_Exk9ie42BUk2Med7sXVh4eQSUsso`), y se repitió el mismo recorrido con Playwright directamente contra `https://web-beta-hazel-49.vercel.app` (esta vez sin bypass, porque producción no tiene el muro de login).
- Esa segunda corrida contra producción encontró un bug real: el paso "Componentes del trabajo" devolvió 1 de 4 ítems esperados, con un fragmento de JSON sin cerrar filtrado como texto visible. Causa: la tarea `mapa` en `web/api/generate.js` no tenía `maxTokens` propio (usaba el default de 1600) y el handler no revisaba `stop_reason === "max_tokens"` antes de parsear. Confirmado no-determinístico (3/3 llamadas directas por `curl` salieron limpias), pero con riesgo real para una demo pública en vivo.
- Se corrigió: `mapa` y `divulgacion` (la otra tarea con salida de varios ítems y sin `maxTokens` propio) ahora piden 2200 tokens, igual que `mde` y `sintesis` ya tenían. Se agregó un guard explícito en el handler: si la respuesta se trunca por `max_tokens`, responde un error limpio y reintentable en vez de dejar pasar JSON incompleto. Redesplegado a producción (`dpl_5bdyoCA9x3ioQxWgrBkqyT4ywuGQ`) y verificado con 4 llamadas directas más a la tarea `mapa`: 4/4 limpias.

### Verificación

- `bash scripts/verify.sh` (sin `--network`) corrido desde la raíz: 0 fallos, 0 advertencias.
- `node --check web/api/generate.js` tras el fix: OK.
- Recorrido completo en navegador real (no simulado) contra Preview y luego contra producción, ambos con 0 excepciones de JavaScript observadas por Playwright.
- Smoke test de red contra producción: `GET /` → 200, `POST /api/search` sin body → 400, `GET /api/search` → 405 (comportamiento esperado).
- El botón "Descargar texto" del informe disparó una descarga real (`informe-evidencia-biblioteca-viva.txt`); el botón "Imprimir/PDF" invocó `window.print()`.
- El secreto de bypass de Vercel usado durante las pruebas se desactivó y se confirmó por `curl` que ya no funciona (no quedó ninguna puerta trasera abierta).

### Qué quedó roto o a medias

- El informe sigue siendo la primera salida de Fase C: no genera todavía estilos ACS/APA/Vancouver ni párrafos específicos para métodos y discusión (esto ya estaba documentado antes, no cambió en esta ronda).
- No se re-auditaron `friccion`, `pregunta` ni `notas` (que se quedaron en el `maxTokens` default de 1600); no hay evidencia de que trunquen, pero tampoco se probaron a fondo esta ronda. Ver "Pendientes activos" en `docs/current-status.md`.
- No se probó en un teléfono físico real (solo emulación de viewport móvil en Chromium headless). Sigue pendiente que Manuel lo recorra en su propio teléfono antes de imprimir el QR.

### Próximo paso recomendado

1. Manuel recorre producción en su teléfono físico (no solo emulación) para el visto bueno final antes de generar el QR.
2. Continuar Fase C: tabla comparativa y borradores citados de justificación, métodos y discusión.
3. Pendientes de siempre, sin cambios: límite de gasto mensual en Anthropic, fijar el alias oficial de Vercel para el QR, generar el QR, llenar `lab/roadmap.md`.

---

**Registro anterior: 2026-07-13 (primera ronda del mismo día)**
**Quién:** sesión de Codex.

### Qué se hizo

- Manuel aprobó la ruta B+: entrada rápida de investigador, síntesis trazable e informe de evidencia.
- Se implementó el modo investigador: recibe tema, pregunta, abstract y objetivo; omite fricción, formulación guiada y reflexión. El modo guiado conserva el flujo completo.
- El selector de entrada ahora diferencia explícitamente `Modo investigador` y `Modo guiado`, con criterios y recorridos visibles; el encabezado muestra el modo activo y permite cambiarlo.
- Se implementó `sintesis` como octava tarea de `generate.js`: consenso, contradicción y brecha con implicación, confianza y fuentes numeradas. La interfaz enlaza cada hallazgo a las referencias aceptadas.
- Se añadió un informe de evidencia con foco, síntesis, MDE y bibliografía aceptada. Permite imprimir/guardar PDF y descargar texto.
- Los chips de `fuerza` ahora dicen "Ajuste directo/parcial/tangencial" para no confundir pertinencia temática con calidad metodológica.
- El paso Bibliografía aclara que consulta directamente OpenAlex y Europe PMC, distingue la cobertura agregada de Crossref/PubMed y declara que Scopus, Web of Science y Google Scholar no están integrados. Cada resultado muestra su fuente directa.
- Se creó el Preview `https://web-qkumuraw9-mreyesgs-projects.vercel.app` con Node 22.23.0. Manuel confirmó allí que la diferencia entre los dos modos se entiende.

### Verificación

- El proyecto quedó fijado en Node 22.x y Node 22.23.0 portátil pasó todos los chequeos de sintaxis. La distribución local está en `.tools/`, excluida de Git, y se ejecuta mediante `scripts/vercel-dev-node22.ps1`.
- Pasaron `node --check` para `generate.js`, `search.js`, `build_poster.js` y el JavaScript extraído de `index.html`.
- Pasó una prueba aislada del contrato del handler `sintesis` y una llamada real directa a Anthropic: HTTP 200 con consensos y brechas, confianza y fuentes válidas.
- `bash scripts/verify.sh` no pudo ejecutarse porque WSL no tiene una distribución instalada; se corrió manualmente su equivalente en PowerShell.
- Vercel Dev sirve GET localmente, pero su adaptador en Windows falla al enviar POST con `NotSupportedError: expect header not supported`, tanto en Node 24 como en Node 22. El backend sí quedó validado directamente y el Preview construyó sin error.

### Qué quedó roto o a medias

- Los cambios están en Preview, no en producción. Falta recorrer búsqueda, MDE, síntesis, informe, descarga e impresión en teléfono.
- El informe es una primera salida de Fase C. Todavía no genera estilos ACS/APA/Vancouver ni párrafos específicos para métodos y discusión.

### Próximo paso recomendado

1. Continuar en el Preview ya creado y probar búsqueda, MDE, síntesis, informe, impresión y descarga móvil.
2. Corregir cualquier detalle visual y promover a producción con aprobación de Manuel.
3. Continuar Fase C con tabla comparativa y borradores citados de justificación, métodos y discusión.

---

**Registro anterior: 2026-07-12 (tercera ronda del mismo día)**
**Quién:** sesión de Claude Code.

### Qué se hizo

- Se decidió con Manuel reposicionar la app de pedagógica a herramienta de investigador, reestructurando alrededor del motor bibliométrico, con la MDE como función estrella para el congreso del Colegio de Químicos (fin julio 2026). Plano en `docs/vision-app.md`, decisión en `lab/decision_log.md`.
- **Fase A COMPLETA, desplegada a producción:**
  - Nueva etapa **Matriz de Decisión** (tarea `mde`): genera dimensiones de decisión adaptables a cualquier disciplina desde las referencias aceptadas, con celdas enlazadas a fuentes reales por DOI. Probada con `curl` en local (5 dimensiones bien fundamentadas para un caso de química) y en producción. Manuel la recorrió en navegador y la aprobó.
  - El paso "Mapa bibliográfico" se reencuadró a "Componentes del trabajo": la tarea `mapa` da los 4 componentes de manuscrito confirmados. Probado, devuelve los 4 exactos.
  - **Motor enriquecido:** `search.js` devuelve `tipo_doc` y `fuerza` (alta/media/baja evaluada por Claude por componente); el frontend los muestra como chips (`signalChips`) con revista, citas, año y OA. Probado en vivo: la fuerza discrimina bien (revisión general → baja para Métodos; artículos de extracción → alta/media).
  - `migrateState()` protege el progreso guardado de usuarios previos al agregar la clave `mde`.
- Verificado: `node --check` sobre `generate.js`, extracción y `node --check` del JS embebido de `index.html`, `scripts/verify.sh`, y `curl` real contra `vercel dev` y contra producción. Desplegado con `vercel --prod`.

### Qué quedó roto o a medias

- Nada roto. La Fase A está completa. Lo siguiente es la Fase B (síntesis de evidencia: consenso, contradicción, brecha), luego C (salidas de publicación) y D (modo investigador + pulido de lenguaje). Ver `docs/vision-app.md`.
- Verificación visual: Manuel recorrió la etapa MDE en navegador y la aprobó. No se hizo un recorrido visual explícito de los chips de señales nuevos en el paso de bibliografía; se probaron los endpoints con `curl`. Vale la pena una mirada rápida en el teléfono.

### Novedades 2026-07-12 (tercera ronda, esta sesión)

- **Reenfoque** desde los artículos aceptados: tarea `reenfoque` en `generate.js` + sección en el paso de Bibliografía. Desplegado y probado (propone un giro coherente cuando los artículos aceptados son tangenciales al foco original).
- **Recall mejorado** en `search.js`: se añadió Europe PMC como segunda fuente gratuita, con intercalado de fuentes (no ordenar por citas, sesgaba a OpenAlex), deduplicación por DOI/título y reintento con consulta amplia. Desplegado; en producción da mezcla 4/4 de ambas fuentes.
- Registrada la meta de **colaboración con el Sistema de Bibliotecas de la UPR** para acceso institucional a bases pagadas (Scopus, WoS). Es gestión, no código; ver `lab/decision_log.md` y `docs/vision-app.md`.

### Próximo paso recomendado

1. Empezar la **Fase B**: síntesis de evidencia. Una tarea nueva en `generate.js` (por ejemplo `sintesis`) que tome las referencias aceptadas y devuelva consenso, contradicción y brecha; una etapa o sección nueva que lo muestre. Alimenta justificación y discusión.
2. Considerar pasar `fuerza` de cada referencia al generador de la MDE, para que pondere mejor las fuentes fuertes (hoy la MDE no la usa).
3. Cuando avance la gestión con Bibliotecas UPR, diseñar el acceso institucional (proxy o llaves provistas por la biblioteca).

### Contexto de sesiones previas del mismo día (para no repetir trabajo)

- Git ya inicializado y en GitHub (`mreyesg/eugenia-lab-biva`, privado). `ANTHROPIC_API_KEY` ya rotada y la vieja revocada. El paso 6 (notas de lectura) ya tiene sugerencia de IA opcional.
- Los subagentes de rol (`explorador`/`implementador`/`verificador`) siguen sin registrarse por nombre hasta reiniciar Claude Code (gotcha documentado en `AGENTS.md`).

---

**Registro anterior (2026-07-12, segunda ronda):**
**Quién:** sesión de Claude Code (continuación de la que instaló el arnés el 2026-07-09 y roto la API key más temprano hoy).

### Qué se hizo

- Se probó el arnés en vivo, a propósito: se intentó invocar los subagentes `explorador`/`implementador`/`verificador` por nombre y **fallaron** ("Agent type not found"). Causa confirmada (no adivinada): `.claude/agents/` se creó durante una sesión anterior a la actual, y el watcher de subagentes solo escanea directorios que ya existían al arrancar la sesión. Documentado como gotcha en `AGENTS.md`. **Pendiente de confirmar la próxima sesión:** reiniciar Claude Code y verificar que `explorador`/`implementador`/`verificador` ya aparecen en la lista de agentes disponibles.
- Como workaround, se usó el agente `general-purpose` pasándole el contenido íntegro del rol `explorador.md` como instrucciones. Funcionó: mapeó la tarea "Paso 6, fichas de lectura automáticas" (primer ítem de `lab/next_session.md`) y **encontró una contradicción real** entre esa agenda y el principio de `CLAUDE.md` de que ese paso debe ser manual, sin IA, sin que nadie se lo señalara primero.
- Se llevó la contradicción a Manuel, que eligió un punto medio: sugerencia de IA opcional y editable, no automatización completa. Se implementó: `web/api/generate.js` ganó una quinta tarea (`notas`, con su `SCHEMAS.notas` y `buildNotas`), y `web/index.html` (paso 6) ganó un botón "Sugerir con IA" que rellena un borrador editable, deshabilitado cuando la referencia no tiene `resumen` real (agregada a mano). Nada se guarda sin pasar por "Guardar ficha" explícito del estudiante.
- Verificado con `node --check` y con `curl` real contra `vercel dev`, en ambos escenarios: con resumen (devuelve una ficha de calidad, incluso señaló una tensión real entre un método de extracción y la restricción de "viabilidad de laboratorio docente" del proyecto) y sin resumen (se degrada con gracia, no inventa datos).
- Se actualizaron `CLAUDE.md` (nota aclarando que la sección vieja de "notas de lectura sin IA" describe el artefacto legado `app/`, no `web/`), `lab/decision_log.md` (nueva entrada de decisión de producto), `lab/next_session.md` (ítem 1 de la agenda marcado como hecho), `docs/current-status.md` y `docs/module-map.md` (5 tareas en vez de 4), y `web/README.md`.

### Qué quedó roto o a medias

- Los subagentes de rol siguen sin poder invocarse por nombre en esta sesión (ver arriba). No es un bug del contenido de los roles, es un tema de cuándo se creó la carpeta respecto al arranque de la sesión.

### Próximo paso recomendado (el primero que debería hacer la siguiente sesión)

1. Reiniciar Claude Code y confirmar que `explorador`/`implementador`/`verificador` ya aparecen como `subagent_type` válidos. Si siguen sin aparecer, ahí sí es un problema real a investigar, no repitas el diagnóstico de memoria.
2. Seguir con la agenda de `lab/next_session.md`: ítem 2 (reformular pregunta/objetivos a la luz de la literatura) e ítem 3 (regenerar perspectivas del mapa por separado).
3. Antes de esos, si aplica: desplegar a producción (`vercel --prod` desde `web/`) el cambio del paso 6, que por ahora solo se probó en local. Ver si Manuel quiere revisar la funcionalidad en producción antes.
4. Pendientes de siempre, sin cambios: decidir el alias oficial de Vercel para el QR, límite de gasto mensual en Anthropic, generar el QR.
