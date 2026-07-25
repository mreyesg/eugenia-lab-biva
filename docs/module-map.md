# Module map

Mapa archivo por archivo, generado por inspección directa del repo (no por memoria). Última actualización: 2026-07-25.

## `web/` — app en producción

| Archivo | Qué hace | Notas |
|---|---|---|
| `web/index.html` (~2270 líneas) | App completa de las etapas de EugenIA Lab. HTML + JS vanilla en un solo archivo, sin build step. Persiste progreso en `localStorage`. | Llama a `/api/generate` y `/api/search`. Bloques añadidos el 2026-07-25: **interoperabilidad** (`toBibTeX`, `toRIS`, `toCSV`, `exportarCorpus`, `descargarArchivo`, `autoresDeRef`, `partirAutores`, `claveBibtex`, `slugProyecto`), **portabilidad del proyecto** (`exportarProyecto`, `importarProyecto`), **búsqueda auditable** (`searchControls`/`getSearchControls`, `renderAjustesBusqueda`, `renderQueryUsada`, `state.busquedas`, `renderRegistroBusquedaReport`, `buildMetodosBusqueda`). `migrateState()` además sanea `step`, `mode` y los campos que deben ser arreglos, para que un archivo importado corrupto no deje la app en blanco. |
| `web/api/generate.js` (~530 líneas) | Función serverless (Node, ESM porque `web/package.json` tiene `"type": "module"`). Proxy seguro hacia `api.anthropic.com/v1/messages`. Acepta 11 tareas: `friccion`, `pregunta`, `mapa`, `divulgacion`, `notas`, `mde` (Matriz de Decisión), `sintesis`, `reenfoque`, `extraerReferencia`, `borradores` (Fase C), `auditoria` (primer paso del "compañero de defendibilidad", agregada 2026-07-18, `maxTokens: 5000`), cada una con su propio JSON Schema de salida estructurada. El builder de `mapa` genera 4 componentes de manuscrito (Justificacion y brecha, Metodos, Comparacion de resultados, Discusion y contraste). | Lee `ANTHROPIC_API_KEY` y `CLAUDE_MODEL` de `process.env`. Devuelve 500 si falta la clave. `MAX_PAYLOAD_CHARS` = 150000 (subido de 40000 el 2026-07-25 porque los abstracts pasaron a 2500 caracteres y 15 referencias ya desbordaban el tope viejo con un 413). Para agregar una tarea nueva: `SCHEMAS.<clave>`, una función `build<Clave>(p)` que devuelva `{system, user, schemaKey, unwrap}` (y opcionalmente `maxTokens`), y registrarla en `BUILDERS`. `handler()` es genérico y no necesita cambios. Nota: `minItems`/`maxItems` mayores a 1 en un array del schema no están soportados por la API (ver `docs/decisions.md`, 2026-07-18); cardinalidad exacta se pide en el prompt, no en el schema. |
| `web/api/search.js` (~480 líneas) | Función serverless. Claude arma una consulta académica (o se usa la que escribió el investigador, y entonces **no** se llama al modelo ni se amplía sola) → busca en **OpenAlex, Europe PMC y Crossref** (las tres gratis, sin llave) en paralelo, intercala las N fuentes con `interleave(listas)` y deduplica por DOI/título; si sale poco (menos de 3) reintenta con una consulta más amplia, **solo cuando la consulta la generó la IA** → filtra por tipo si se pidió → Claude anota el aporte y la **fuerza** (alta/media/baja) de cada artículo real, con `maxTokens: 2800` por el tope de 12 resultados. Cada resultado trae `tipo_doc`, `revista`, `citas`, `anio`, `oa`, `resumen` (hasta `ABSTRACT_CHARS` = 2500), `fuente` y `autores_lista` (lista estructurada de autores). Responde además los metadatos del registro de búsqueda: `query`, `query_origen`, `query_ampliada`, `por_base`, `filtros`, `total_encontrado`, `descartados_por_tipo`. Nunca inventa citas. | Lee `ANTHROPIC_API_KEY`, `CLAUDE_MODEL`, `OPENALEX_MAILTO`. Acepta en el body: `query` (consulta manual), `desde_anio`, `tipo` (`revision`/`primario`), ambos saneados. `por_base` distingue `null` (la base no respondió) de `0` (respondió sin resultados). PubMed, Semantic Scholar y DOAJ se evaluaron y descartaron con datos, ver `docs/decisions.md` (2026-07-25). |
| `web/package.json` | `"type": "module"`, sin scripts, una sola devDependency (`vercel`). | No hay `npm test` ni `npm run build` porque no existen. |
| `web/.env.local` | Variables de entorno para `vercel dev` (local). Contiene la `ANTHROPIC_API_KEY` real en texto plano. | **Nunca leer su contenido en voz alta en un resumen ni pegarlo en un commit.** Ver `docs/testing.md` sobre por qué antes no funcionaba. |
| `web/.env.example` | Plantilla de las mismas variables, sin valores reales. | Seguro de compartir/commitear. |
| `web/.vercel/project.json` | Vincula esta carpeta al proyecto `web` en la cuenta de Vercel (`team_ZLYcj9ajzPM48HCF2gkui15r`). | Generado por `vercel link` / primer `vercel`. |
| `web/README.md` | Instrucciones de despliegue, ya escritas por una sesión previa. | Coincide con lo verificado en esta sesión; no se reescribió. |
| `web/node_modules/` | Dependencias de la CLI de Vercel (grande, ~cientos de paquetes). No es código del proyecto. | Si se inicializa git, debe ir a `.gitignore`. |

## `app/` — versión artefacto (legado)

| Archivo | Qué hace | Notas |
|---|---|---|
| `app/biblioteca_viva_app.html` (~950 líneas) | Versión original pensada para publicarse como artefacto de Claude.ai. Usa `window.storage` en vez de `localStorage`, llama directo a `api.anthropic.com` (funciona solo dentro del entorno de artefactos). | Ya no se despliega. Se conserva como referencia histórica, ver `docs/decisions.md`. |

## `poster/` — póster académico

| Archivo | Qué hace | Notas |
|---|---|---|
| `poster/Poster_EugenIA_Lab_MDE.pptx` | El póster final, 44x60", 4 columnas. | Generado, no editado a mano. |
| `poster/src/build_poster.js` (~347 líneas) | Script Node (CommonJS, usa `require`) que genera el `.pptx` con `pptxgenjs`. | Sin `package.json` propio: `pptxgenjs` se instala ad hoc con `npm install pptxgenjs` desde `poster/src/` cada vez que hace falta (confirmado: no hay `node_modules/` ahí en este momento). |
| `poster/src/previous_versions/*.js` | 4 iteraciones anteriores (`v1` a `v4`), ver `CLAUDE.md` para el detalle de cada una. | Solo referencia/histórico, no se ejecutan como parte del flujo actual. |

## `reference/` — material fuente

PDFs y un `.pptx` de presentaciones/planes previos. Estáticos, no se generan ni se editan por script. Ver `CLAUDE.md` para qué es cada uno.

## `lab/` — gobernanza del lab (ya existía antes de este arnés)

| Archivo | Qué es | Relación con `docs/` |
|---|---|---|
| `lab/project_state.md` | Snapshot del estado del proyecto por estudiante/fase, mantenido activamente (última actualización real: 2026-07-08). | Ver `docs/current-status.md`: ese archivo es el snapshot *técnico* para agentes; este es el snapshot *de investigación/estudiantes*. Se referencian entre sí. |
| `lab/next_session.md` | Agenda humana de la próxima sesión de trabajo del lab. | Ver `docs/handoff.md`: ese es el protocolo *mecánico* de cierre de sesión de un agente; este es la agenda *de contenido* para Manuel/Kamila. |
| `lab/decision_log.md` | Decisiones de dirección de investigación/producto. | Ver `docs/decisions.md`: ese es para decisiones de *ingeniería/harness*; este es para decisiones de *dirección del lab*. |
| `lab/roadmap.md` | Plantilla de visión a mediano/largo plazo. Casi vacía (secciones con checkboxes sin llenar). | No se tocó: llenarla es trabajo de contenido/planificación, no de este arnés. |

## `.claude/` — configuración de Claude Code

| Archivo | Qué hace |
|---|---|
| `.claude/settings.local.json` | Permiso puntual para `Bash(node -e ' *)`, de una sesión anterior. |
| `.claude/launch.json` | Config de VS Code para servir `web/` estático con `python -m http.server 4599` (sin las funciones `/api/*`, solo para ver la navegación de las 8 etapas). |
| `.claude/agents/*.md` | Nuevos en este arnés: roles `explorador`, `implementador`, `verificador`. Ver `AGENTS.md`. |

## `docs/` — este arnés (nuevo)

Este mismo directorio: `current-status.md`, `handoff.md`, `testing.md`, `module-map.md` (este archivo), `decisions.md`.

## `scripts/` — este arnés (nuevo)

`verify.sh`: chequeo de sintaxis + estructura, ver `docs/testing.md`.

## Lo que NO existe (para no inventarlo)

- No hay `.git` en ningún nivel del árbol.
- No hay `tsconfig.json`, `.eslintrc*`, `.prettierrc*`, `jest.config*` ni `vitest.config*` propios del proyecto (los únicos que aparecen en una búsqueda global están dentro de `node_modules`, son de dependencias de terceros).
- No hay CI/CD configurado (no hay `.github/workflows/`).
- No hay backend con base de datos: la única persistencia es `localStorage` en el navegador del usuario.
