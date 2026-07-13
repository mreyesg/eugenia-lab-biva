# AGENTS.md — punto de entrada para agentes

Este archivo es lo primero que debe leer cualquier agente (Claude Code u otro) que empiece a trabajar en este repositorio sin haber visto el historial de chat previo. Si algo aquí contradice lo que observas en el repo, confía en el repo y corrige este archivo.

Para contexto de negocio/investigación (quién es quién, qué es EugenIA Lab, decisiones de producto de la app) lee primero `CLAUDE.md` en la raíz. Este archivo (`AGENTS.md`) es el complemento operativo: cómo verificar, dónde está cada cosa, y cómo cerrar una sesión dejando estado utilizable por el siguiente agente.

## Estado del control de versiones

Desde 2026-07-12 este directorio **sí es un repositorio git**, con el primer commit hecho y subido a GitHub como `mreyesg/eugenia-lab-biva` (privado). Antes de esa fecha no había `.git`; ver `docs/decisions.md` para el porqué y el detalle de cómo se hizo sin exponer secretos.

- El `.gitignore` de la raíz (y `web/.gitignore`, más específico) excluyen `node_modules/`, `web/.env.local` y `web/.vercel/`. **Antes de cualquier commit que toque esas rutas, confirma con `git check-ignore -v <ruta>` que sigue excluida**, no lo asumas.
- `web/.env.local` contiene una `ANTHROPIC_API_KEY` real en texto plano. Nunca la leas con `Read` ni la imprimas en un comando si se puede evitar: usa pipes de shell (`grep ... | vercel env add ...`) para mover el valor sin que pase por la salida que ves. Ver el patrón completo en `docs/decisions.md`, entrada "Rotar secretos sin que el valor pase por el chat/contexto del agente".
- `origin` apunta por SSH a GitHub. No hagas `git push --force` ni reescribas historial sin confirmar con Manuel primero.

## Qué es este repo, en una frase por pieza

| Carpeta | Qué es | Stack |
|---|---|---|
| `web/` | App "Biblioteca Viva" en producción (Vercel) | HTML/JS vanilla sin build + 2 funciones serverless Node |
| `app/` | Versión vieja como artefacto de Claude.ai | HTML/JS vanilla — solo referencia, no se despliega |
| `poster/` | Póster académico 44x60" | Generado por script Node (`pptxgenjs`), no editado a mano |
| `reference/` | PDFs/PPTX de referencia (plan de trabajo, presentaciones previas) | Estáticos, no se tocan |
| `lab/` | Gobernanza del lab: estado del proyecto, decisiones de investigación, agenda | Markdown, mantenido por Manuel y por sesiones previas de Code |
| `docs/` | Este arnés operativo (nuevo) | Markdown, agent-facing |

Ver [`docs/module-map.md`](docs/module-map.md) para el detalle archivo por archivo.

## No hay test suite, lint ni typecheck — y es intencional

Verificado por inspección directa (no hay `.eslintrc*`, `tsconfig.json`, `jest.config*` ni similar en ningún `package.json` del proyecto, fuera de `node_modules`). El proyecto es deliberadamente "sin build step" (así lo dice `CLAUDE.md` sobre `web/index.html`). No inventes un test runner que no existe.

Lo que sí existe y es real, ver [`docs/testing.md`](docs/testing.md) para el detalle:

- Chequeo de sintaxis con `node --check` sobre los 3 archivos `.js` reales del proyecto.
- `scripts/verify.sh`, que automatiza lo anterior más un par de chequeos de estructura.
- Verificación manual/visual para el póster (conversión a PDF + imágenes) y para la app (abrir en navegador).

## Comandos reales por área

**App web (`web/`)**
```
cd web
npx vercel dev             # servidor local en :3000 (o :3001 si :3000 está ocupado)
npx vercel --prod          # despliega a producción
npx vercel env ls          # ver qué variables de entorno existen y en qué entorno
npx vercel env pull .env.local   # traer las variables del entorno Development a local
```

**Póster (`poster/src/`)**
```
cd poster/src
npm install pptxgenjs      # no hay package.json commiteado; se instala ad hoc cada vez
node build_poster.js       # genera el .pptx en poster/src/, copiar a poster/ manualmente
```

**Verificación general (raíz del repo)**
```
bash scripts/verify.sh
```

No hay comando de "build" para `web/` (es estático) ni para `app/` (HTML suelto). No inventes `npm run build` donde no existe.

## Roles / subagentes de este proyecto

Si tu herramienta soporta subagentes con definición en `.claude/agents/*.md`, este repo ya tiene tres roles adaptados a su forma real de trabajar (no genéricos):

- **`explorador`**: mapea código/estado antes de tocar nada, nunca escribe.
- **`implementador`**: hace el cambio mínimo pedido, respetando las convenciones de `CLAUDE.md` (sin guiones largos, sin over-engineering, sin build step en `web/`).
- **`verificador`**: corre `scripts/verify.sh` y, si aplica, la verificación visual del póster o el smoke test de los endpoints. Nunca da por bueno un cambio solo porque el código "se ve bien".

## Protocolo de cierre de sesión

Antes de terminar cualquier sesión de trabajo en este repo:

1. Correr `bash scripts/verify.sh` y confirmar que pasa (o documentar por qué no).
2. Actualizar [`docs/current-status.md`](docs/current-status.md) con lo que cambió.
3. Si hubo una decisión de dirección (no solo una tarea mecánica), añadir una entrada a [`docs/decisions.md`](docs/decisions.md) (harness/ingeniería) o a `lab/decision_log.md` (dirección de investigación/producto) — ver esos archivos para cuál te toca.
4. Dejar la agenda de la próxima sesión en [`docs/handoff.md`](docs/handoff.md) y, si afecta la agenda del lab, también en `lab/next_session.md`.

## Riesgos conocidos activos (no resolver sin confirmar con Manuel)

- `ANTHROPIC_API_KEY` se rotó el 2026-07-12 (clave nueva en los 3 entornos de Vercel, producción redesplegada, confirmado funcionando) y la clave vieja ya fue revocada por Manuel en console.anthropic.com el mismo día. Rotación cerrada del todo, no hay acción pendiente aquí.
- No hay límite de gasto mensual configurado en la consola de Anthropic para una app pública vía QR.
- El QR final todavía no existe (ni el link "canónico": hay 3 alias de Vercel apuntando al mismo deployment, ver `docs/current-status.md`).
