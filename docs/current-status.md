# Current status (snapshot técnico para agentes)

**Última actualización:** 2026-07-09.

Este archivo es el snapshot *técnico/operativo* para que un agente nuevo sepa en qué estado está el código sin leer el chat. Para el snapshot *de investigación/estudiantes* (Kamila, fases del estudio de Plectranthus), ver `lab/project_state.md`, que se mantiene por separado y no se duplicó aquí.

## Infraestructura

- **Control de versiones:** no existe. Este directorio no es un repositorio git (confirmado con `git status`, falla). Ver `AGENTS.md` sección "Estado del control de versiones".
- **Hosting:** Vercel, proyecto `web` (org `mreyesgs-projects`, `projectId: prj_NSR0I03nKcM0kyjKlg1bw4UBBM5P`).
- **URL de producción:** `https://web-beta-hazel-49.vercel.app`. Confirmado con `vercel alias ls` que hay 3 alias apuntando al mismo deployment actual (13h de antigüedad al momento de revisar):
  - `web-beta-hazel-49.vercel.app` (la que usan `lab/next_session.md` y el README)
  - `web-mreyesgs-projects.vercel.app`
  - `web-mreyesg-mreyesgs-projects.vercel.app`

  Los tres sirven lo mismo hoy. No hay una alias "fija" elegida deliberadamente para el QR del póster; si un despliegue futuro no incluye `--prod` o cambia de nombre, no está garantizado que seguirán apuntando al mismo sitio. Pendiente: decidir uno y, si se quiere estabilidad, fijarlo con `vercel alias set`.

- **Variables de entorno en Vercel** (`npx vercel env ls`, verificado 2026-07-09):

  | Variable | Entornos |
  |---|---|
  | `ANTHROPIC_API_KEY` | Production, Preview (desde hace ~20h) **y Development (agregada hoy, ~7h)** |

  Antes de esta sesión, `ANTHROPIC_API_KEY` NO estaba disponible en el entorno `Development`, que es el que usa `vercel dev` localmente. Esa era la causa raíz de que "el servidor local diera problemas leyendo la clave" (mencionado en `lab/next_session.md`, ahora corregido ahí también). Se agregó con `npx vercel env add ANTHROPIC_API_KEY development`, reutilizando el valor que ya estaba en `web/.env.local`.

  **Confirmado de punta a punta en esta sesión:** `npx vercel env pull .env.local` trajo la clave al archivo local, se reinició `vercel dev`, y un `POST /api/generate` real con `task: "friccion"` devolvió las 4 opciones esperadas (HTTP 200). El flujo local ya funciona igual que producción.

## Funcionalidad de la app (`web/`)

Confirmado por inspección de código, no solo por lo que dice `lab/project_state.md` (aunque coincide):

- Navegación de 8 etapas, persistencia en `localStorage`.
- `POST /api/generate` acepta 4 tareas: `friccion`, `pregunta`, `mapa`, `divulgacion`. Devuelve 500 con `{"error":"El servidor no tiene configurada la clave de la API."}` si `ANTHROPIC_API_KEY` no está en el entorno donde corre.
- `POST /api/search` motor bibliométrico vía OpenAlex + Claude, sin inventar citas.
- Probado en esta sesión con `curl` directo contra `vercel dev` local: el endpoint responde y devuelve el error esperado cuando la clave falta (antes del fix); no se volvió a probar con la clave ya disponible en Development porque el `env pull` quedó pendiente (ver arriba).

## Verificación

- `node --check` pasa en los 3 archivos `.js` reales del proyecto (`web/api/generate.js`, `web/api/search.js`, `poster/src/build_poster.js`). Ver `docs/testing.md`.
- No se corrió una verificación visual del póster en esta sesión (no se tocó `build_poster.js`).
- No se abrió `web/index.html` en un navegador real en esta sesión.

## Pendientes activos (heredados de sesiones anteriores, no introducidos por este arnés)

- Rotar `ANTHROPIC_API_KEY` (quedó expuesta en el historial de una sesión de Code).
- Definir límite de gasto mensual en la consola de Anthropic.
- Generar el QR hacia la URL de producción elegida.
- Llenar `lab/roadmap.md` (sigue casi vacío).

## Pendientes introducidos/descubiertos en esta sesión

- Decidir si se inicializa git y con qué `.gitignore`.
- Decidir cuál de los 3 alias de Vercel es "el" link oficial para el QR.
