# Handoff — protocolo de cierre de sesión

Este archivo es el protocolo *mecánico* que cualquier agente debe seguir al cerrar una sesión de trabajo en este repo, y el registro de la última entrega. No confundir con `lab/next_session.md`, que es la agenda *de contenido* (qué investigar, qué construir) para Manuel/Kamila — ese archivo se sigue manteniendo por separado.

## Protocolo (seguir en orden al cerrar sesión)

1. Correr `bash scripts/verify.sh` desde la raíz del repo. Si falla algo, no lo dejes en silencio: anótalo en la sección "Qué quedó roto o a medias" de abajo, no lo omitas del resumen final.
2. Actualizar `docs/current-status.md` con cualquier cambio de infraestructura, endpoints, o estado de variables de entorno.
3. Si tomaste una decisión de dirección técnica (no una tarea mecánica), añade una entrada a `docs/decisions.md`. Si la decisión fue sobre dirección de investigación/producto (no sobre el harness), va en `lab/decision_log.md` en su lugar.
4. Sobrescribe la sección "Última entrega" de este archivo (abajo) con el estado real al momento de cerrar. No acumules entregas viejas aquí, para eso está el historial de decisiones.
5. Si la agenda de contenido del lab cambió (próximos pasos de investigación, no de ingeniería), actualiza también `lab/next_session.md`.

## Última entrega

**Fecha:** 2026-07-18 (continuación: Fase D)
**Quién:** sesión de Claude Code.

Con Fase C ya en producción y aprobada, Manuel preguntó si podíamos adelantar algo más mientras Kamila reacciona. Le ofrecí tres direcciones (Fase D, higiene operativa, o el primer paso de la extensión estratégica) y eligió Fase D: pulir el lenguaje de investigador en toda la app.

### Qué se hizo

Auditoría completa del copy de `web/index.html`, paso por paso, buscando tono de tutorial o terminología obsoleta. Encontré un desfase real, no solo cosmético: cuando el paso "Mapa bibliográfico" se renombró a "Componentes del trabajo" en la Fase A (2026-07-12), el texto interno de tres lugares no se actualizó y seguía hablando de "mapa bibliográfico" y generando/regenerando un "mapa": el botón para generarlo, el de regenerarlo, y el hint del paso de Bibliografía cuando aún no hay componentes generados. Los tres quedaron corregidos.

Además: la lista de formatos de divulgación (compartida por ambos modos, investigador incluido) no tenía ninguna opción claramente profesional pese a que la app ahora se presenta como herramienta de investigador; se agregaron "Artículo científico" y "Ponencia de congreso" al inicio de la lista, sin quitar las opciones pedagógicas que sirven al modo guiado. Y el subtítulo de la pantalla de resumen final se ajustó de "tu recorrido por Biblioteca Viva" a "tu foco, tu evidencia y tus decisiones".

El resto de los pasos (Idea en modo investigador, Bibliografía, MDE, Síntesis, Notas, informe de evidencia) ya estaban en tono adecuado de rondas anteriores, no se tocaron. Fricción, Pregunta y Reflexión son exclusivos del modo guiado y mantienen tono pedagógico a propósito, tampoco se tocaron.

### Verificación

`node --check` sobre el JS embebido de `index.html`: OK. Se ejercitó el render real en un contexto `vm` con DOM simulado (mismo patrón que Fase C): 10/10 chequeos, cubriendo los 3 puntos corregidos, ausencia de "mapa bibliográfico" en cualquier render, las dos opciones nuevas de divulgación junto con las pedagógicas, y el nuevo subtítulo del resumen. `bash scripts/verify.sh`: 0 fallos.

### Qué quedó a medias

- **No desplegado a producción todavía.** Cambios de solo texto, bajo riesgo, pero pendientes de que Manuel decida si los sube ahora o los agrupa con el siguiente cambio.
- No se hizo una relectura humana completa; vale la pena antes del congreso, aunque la auditoría automatizada no encontró más restos obsoletos.

### Próximo paso recomendado

1. Manuel decide si despliega ya la Fase D (cambio de bajo riesgo) o espera.
2. Prueba en frío de Kamila (sigue pendiente, ella reacciona hasta el lunes).
3. Higiene de siempre: límite de gasto mensual en Anthropic, fijar el alias oficial de Vercel para el QR, generar el QR. O el primer paso de la extensión estratégica (auditoría de defendibilidad) si se prefiere seguir con desarrollo grande.

---

**Registro anterior: 2026-07-18 (Fase C)**
**Quién:** sesión de Claude Code.

Se avanzó la Fase C (salidas para publicar). Manuel pidió seguir a fondo con el desarrollo mientras Kamila, atrasada, reacciona a la prueba en frío hasta el lunes; así que esta sesión fue de código, no de validación con usuario.

### Qué se hizo

- **Nueva tarea `borradores` en `web/api/generate.js`** (la número 10). A partir de las referencias aceptadas (con la síntesis y la MDE como contexto opcional), genera cuatro borradores de párrafo citados, uno por cada componente del trabajo (`justificacion`, `metodos`, `comparacion`, `discusion`), más una `tabla_comparativa` con una fila por fuente (enfoque, hallazgo principal, limitación). Cada afirmación cita sus fuentes con marcadores `[n]`; el prompt prohíbe usar corchetes para anotaciones que no sean citas y mantiene el principio de nunca inventar. Sigue el patrón genérico existente (SCHEMA + builder + registro en BUILDERS), `maxTokens: 3200`.
- **Informe de evidencia ampliado en `web/index.html`.** La sección "Borradores para publicar" (generar/regenerar con su propio estado de carga `borradoresState`, `fetch` propio a `/api/generate`), un selector de estilo de cita **APA / ACS / Vancouver** que reformatea la lista de referencias con `formatCitation()` (formateo puro de metadatos reales, sin IA), y todo incluido en la impresión/PDF y en la descarga de texto. Estado nuevo del proyecto: `borradores` y `citaEstilo`, rellenados por `migrateState()` en proyectos guardados.

### Verificación

- **Contrato de `borradores` contra la API real:** se invocó el handler de `generate.js` directamente en Node 22 (cargando la clave desde `web/.env.local` sin imprimirla). HTTP 200, los 4 párrafos + tabla comparativa de 3 filas, 18 marcadores `[n]` todos dentro de rango, y honestidad correcta (marcó como limitación que una fuente no aportaba TPC comparable). Se afinó el prompt para evitar un corchete no-cita que se coló en la primera corrida, y se re-verificó la sintaxis.
- **Frontend:** se cargó el JS embebido de `index.html` en un contexto `vm` con DOM simulado y se ejercitaron las funciones reales del informe. 15/15 chequeos OK: los 3 estilos de cita, el render del informe con los 4 encabezados + tabla + selector, el handler `onchange` reformateando en vivo, la descarga de texto con borradores y estilo, y el estado vacío mostrando el botón generar.
- `node --check` sobre `generate.js` y sobre el JS extraído de `index.html`: OK. `bash scripts/verify.sh`: 0 fallos, 0 advertencias.

### Aprobación y despliegue (mismo día, continuación)

- Se generó una vista previa visual (artefacto) del informe con contenido real de una corrida de `borradores`, reutilizando exactamente la paleta y tipografía de `index.html` (nada de diseño nuevo, es la pantalla real). Manuel la revisó y aprobó explícitamente: "perfectamente alineado" con el trabajo de Kamila, y anotó que la generación a partir de datos reales de literatura le será particularmente útil a ella. Esa conexión con el plan formal de Kamila (no solo la demo del congreso) quedó guardada en memoria de largo plazo.
- Manuel pidió desplegar de inmediato para que Kamila pueda acceder a una versión más adelantada de la app.
- **Gotcha de esta sesión: el despliegue se intentó desde una máquina distinta a la habitual** (la laptop de Manuel, no la de escritorio donde se hizo el resto del desarrollo). Esa laptop no tenía sesión de Vercel CLI (`Error: The specified token is not valid`) ni Node.js/`npx` en el PATH del sistema. Se resolvió sin instalar nada nuevo: el Node portátil ya presente en el repo (`.tools/node-v22.23.0-win-x64`, el mismo que se instaló hace días por el problema de permisos de administrador en la otra máquina) se agregó al PATH de la sesión, y Manuel corrió `vercel login` él mismo en su propia terminal (paso interactivo que el agente no puede completar, y que por el patrón de seguridad del proyecto tampoco se intentó resolver pidiéndole un token por el chat). Una vez autenticado como `mreyesg`, el despliegue procedió normalmente.
- **Desplegado a producción:** `vercel --prod` desde `web/`, deployment `dpl_26rhM1oGvG9S9C4ktScu1HFrjDNU`, alias `web-beta-hazel-49.vercel.app` actualizado automáticamente (el mismo alias de siempre).
- **Verificado en producción real, no solo el despliegue:** `curl` confirmó que `index.html` servido ya contiene "Borradores para publicar" y el selector `citaEstilo`; una llamada POST real a `/api/generate` tarea `borradores` contra producción devolvió HTTP 200 con los 4 párrafos y la tabla, manejando bien el caso límite de una sola fuente de prueba (no inventó comparaciones sin sustento). `bash scripts/verify.sh --network`: 0 fallos.

### Qué quedó roto o a medias

- Nada roto. Fase C (borradores citados + tabla comparativa + estilos de cita) está en producción y verificada.
- No se recorrió en navegador real ni en teléfono físico (la verificación fue por contrato de API real, simulación de DOM en `vm`, y `curl` directo contra producción; no Playwright: no está instalado en esta máquina y bajarlo era pesado).
- Estilos de cita limitados por los metadatos disponibles (falta volumen/páginas), así que APA/ACS/Vancouver salen aproximados. Queda por decidir si vale ampliarlos y si se quiere una salida específica por formato de divulgación.
- La laptop de Manuel (usada hoy) ahora tiene su propia sesión de Vercel CLI autenticada, pero sigue sin Node.js instalado globalmente; futuras sesiones desde esa máquina necesitarán el mismo paso de agregar `.tools/node-v22.23.0-win-x64` al PATH antes de cualquier comando de `npm`/`npx`/`vercel`.

### Próximo paso recomendado

1. Prueba en frío de Kamila con la versión ya adelantada en producción (sigue siendo el hito de validación más importante; ella reacciona hasta el lunes).
2. Manuel recorre producción en teléfono físico cuando pueda.
3. Higiene de siempre: límite de gasto mensual en Anthropic, fijar el alias oficial de Vercel para el QR, generar el QR.

---

**Registro anterior: 2026-07-13 (cierre de sesión antes de receso)**
**Quién:** sesión de Claude Code.

Sesión larga con varios entregables, cada uno ya commiteado y documentado en su lugar. Este es el resumen del estado al cerrar; el detalle de cada pieza está en los registros anteriores de abajo y en los docs citados.

### Qué se hizo (en orden)

1. **Validación de B+ y promoción a producción, con un fix.** Se recorrió el modo investigador de punta a punta con Playwright contra Preview y luego producción; se encontró y corrigió un bug de truncamiento en "Componentes del trabajo" (tarea `mapa` sin `maxTokens` propio + falta de guard sobre `stop_reason`), y se promovió B+ a producción. Detalle en el registro "segunda ronda" abajo.
2. **Dos mejoras al motor de evidencia** (registro "tercera ronda" abajo): señal de acceso cerrado con recomendación manual, y subir un PDF propio con extracción de referencia (tarea `extraerReferencia`, 9 tareas en total). Ambas probadas con Playwright y desplegadas a producción.
3. **Presentación viva creada** (`presentation/`): ponencia de 25 slides sobre el desarrollo de la app, con enfoque metodológico como base de una posible publicación. Es código (pptxgenjs), igual que el póster. Documento vivo con marcadores PENDIENTE. Ver `presentation/README.md`.
4. **Dirección estratégica registrada:** "de herramienta de evidencia a compañero de defendibilidad" (diferenciación vs. Elicit; los resultados propios del investigador como insumo, auditoría de defendibilidad por dimensiones, bucle longitudinal). Registrada, NO construida, en `docs/vision-app.md`, `lab/roadmap.md` (llenado por primera vez) y un slide de la presentación. Decisión en `lab/decision_log.md` (2026-07-13).
5. **Cerradas las dos preguntas abiertas de Fase A:** se mantiene la taxonomía de 4 componentes (salvo que muestre ser insuficiente) y las dimensiones de la MDE se generan por IA según el campo, no fijas para química. En `docs/vision-app.md`, `lab/decision_log.md` y `docs/current-status.md`.

### Nota de capacidades del entorno (útil para futuras sesiones)

En esta máquina **no hay LibreOffice**, pero **sí PowerPoint**. La verificación visual de un `.pptx` se puede hacer exportando las slides a PNG con automatización COM de PowerPoint desde PowerShell (`$app = New-Object -ComObject PowerPoint.Application; ... SaveAs(carpeta, 18)`), y luego mirándolas. Así se revisó la presentación slide por slide y se atrapó un traslape antes de darla por buena. Ver `presentation/README.md`.

### Detalle de la ronda de acceso cerrado + PDF (parte de esta sesión)

- A pedido de Manuel, evaluación honesta de si la app aporta valor real (resumen: el núcleo de grounding real + honestidad sobre brechas sí es un aporte genuino, verificado en vivo; pero nunca se había probado con un usuario que no fuera Manuel). Se acordó que Kamila la probará sola, sin guía, como validación real, y que antes se fortalecería el motor de evidencia con dos mejoras concretas que Manuel propuso. Detalle completo de la decisión en `lab/decision_log.md` (2026-07-13).
- **Señal de acceso cerrado:** `signalChips()` en `web/index.html` ahora muestra un chip "Acceso cerrado" cuando `oa === false`, y si además `fuerza === "alta"` agrega una nota explícita recomendando conseguir el artículo manualmente (Sistema de Bibliotecas UPR, préstamo interbibliotecario). Cambio puro de render; `search.js` ya traía esos datos, solo faltaba comunicarlos.
- **Subir un PDF propio:** nueva tarea `extraerReferencia` en `generate.js` (9 tareas en total). El formulario de "Añadir referencia manual" en Bibliografía gana un input de PDF + botón "Leer datos del PDF": el texto se extrae 100% en el cliente con `pdf.js` (CDN, sin dependencia npm nueva) y solo el texto (nunca el PDF) se envía al backend, que devuelve título/autores/año/resumen estructurados para prellenar el formulario. Nada se guarda hasta que el investigador pulsa "Añadir referencia" explícitamente. Esto resuelve que antes una referencia añadida a mano no tenía resumen y por tanto contribuía débilmente a la MDE y la Síntesis (ambas dependen fuertemente de ese campo).
- Se usó plan mode para diseñar la arquitectura de la subida de PDF antes de codificar (decisión: extracción client-side vs. server-side, justificada en el plan guardado en `C:\Users\manue\.claude\plans\jaunty-launching-torvalds.md`).
- Ambas mejoras probadas de punta a punta con Playwright contra un Preview (con el bypass de automatización de Vercel, igual patrón que la ronda anterior, activado y desactivado en la misma sesión) y desplegadas a producción (deployment `dpl_46kCygQXv8ENKfmepS9KTXy34y5G`).

### Verificación

- **Al cierre de sesión:** `bash scripts/verify.sh` 0 fallos y árbol de trabajo limpio (toda la sesión quedó en 5 commits, `9f78a0a` a `194f612`). La presentación se verificó slide por slide exportándola a PNG con automatización COM de PowerPoint.
- `node --check web/api/generate.js` y `bash scripts/verify.sh`: OK, 0 fallos.
- `node --check` sobre el JS embebido de `index.html` (extraído a un archivo temporal): OK.
- Playwright contra Preview: el chip y la nota de acceso cerrado aparecieron correctamente en resultados de búsqueda real; un PDF de prueba con abstract real (generado con `pdfkit` solo para la prueba, no es dependencia del proyecto) se extrajo con título/autores/año/resumen correctos (729 caracteres); confirmado por `localStorage` que nada se guardó hasta pulsar "Añadir referencia" (0 antes, 1 después); formulario se limpió tras guardar; un PDF sin capa de texto disparó el aborto limpio esperado sin llamar a la API. 0 excepciones de JavaScript.
- Verificado en producción con `curl` directo a `/api/generate` tarea `extraerReferencia`: respuesta limpia con los 4 campos.
- El secreto de bypass de Vercel se desactivó al terminar y se confirmó por `curl` que ya no funciona.

### Qué quedó roto o a medias

- Nada roto. Todo lo de la sesión está commiteado y verificado; el árbol de trabajo quedó limpio.
- La **dirección estratégica** (compañero de defendibilidad) está registrada pero NO construida. Su primer paso concreto está descrito en `lab/roadmap.md` y `docs/vision-app.md`: insumo de "tus propios resultados" y una tarea de auditoría de defendibilidad anclada a evidencia.
- No se probó la subida de PDF en un teléfono físico real (solo emulación de viewport). El input `type="file"` con `accept="application/pdf"` debería abrir el selector nativo en móvil, pero no se confirmó en un dispositivo real.
- El alcance de la extracción de PDF es deliberadamente solo metadatos bibliográficos, no variables experimentales cuantitativas (ver `lab/decision_log.md`).
- Heredados sin cambios: no hay una corrida de regresión completa de las 8 etapas tras los últimos cambios; falta recorrer producción en un teléfono físico real antes del QR.

### Próximo paso recomendado

1. **Validación en frío con Kamila:** darle la app para que la use sola, sin guía, y recoger qué logra y dónde se pierde. Es la validación real pendiente y el hito más importante. Sus hallazgos son lo primero que debe volcarse en el slide de validación de la presentación.
2. Manuel recorre producción en su teléfono físico real antes de generar el QR.
3. Cuando se retome el desarrollo: o bien continuar la Fase C (tabla comparativa y borradores citados por sección), o bien arrancar el primer paso de la extensión estratégica (insumo de resultados propios + auditoría de defendibilidad anclada).
4. Higiene pendiente, sin cambios: límite de gasto mensual en Anthropic, fijar el alias oficial de Vercel para el QR, generar el QR. (`lab/roadmap.md` ya se llenó esta sesión.)

---

**Registro anterior: 2026-07-13 (segunda ronda del mismo día)**
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
