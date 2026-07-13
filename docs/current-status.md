# Current status (snapshot técnico para agentes)

**Última actualización:** 2026-07-12.

Este archivo es el snapshot *técnico/operativo* para que un agente nuevo sepa en qué estado está el código sin leer el chat. Para el snapshot *de investigación/estudiantes* (Kamila, fases del estudio de Plectranthus), ver `lab/project_state.md`, que se mantiene por separado y no se duplicó aquí.

## Infraestructura

- **Control de versiones:** existe desde 2026-07-12. Repo git inicializado en la raíz, primer commit hecho, y subido a GitHub como `mreyesg/eugenia-lab-biva` (privado). `.gitignore` (raíz y `web/.gitignore`) excluye `node_modules/`, `web/.env.local`, `web/.vercel/`; verificado con `git check-ignore` antes del primer commit que nada sensible quedó staged.
- **Hosting:** Vercel, proyecto `web` (org `mreyesgs-projects`, `projectId: prj_NSR0I03nKcM0kyjKlg1bw4UBBM5P`).
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

- Navegación de 8 etapas, persistencia en `localStorage`.
- `POST /api/generate` acepta 6 tareas: `friccion`, `pregunta`, `mapa`, `divulgacion`, `notas`, `mde`. Devuelve 500 con `{"error":"El servidor no tiene configurada la clave de la API."}` si `ANTHROPIC_API_KEY` no está en el entorno donde corre.
- **2026-07-12: arrancó la Fase A del reposicionamiento a herramienta de investigador** (ver `docs/vision-app.md` y `lab/decision_log.md`). Lo desplegado y probado en producción hoy:
  - Nueva etapa **Matriz de Decisión** (tarea `mde`) entre Bibliografía viva y Notas. Genera, adaptándose a cualquier disciplina, entre 3 y 6 dimensiones de decisión a partir de las referencias aceptadas, cada fila con evidencia curada, criterio adoptado, y chips que enlazan a las fuentes reales por DOI. Probado en vivo: con datos de química dio 5 dimensiones bien fundamentadas y con índices de fuente correctos.
  - El paso **"Mapa bibliográfico"** se reencuadró a **"Componentes del trabajo"**: la tarea `mapa` ahora genera 4 componentes de manuscrito (Justificacion y brecha, Metodos, Comparacion de resultados, Discusion y contraste) en vez de 5 perspectivas abstractas. La búsqueda del paso 5 ahora corre por componente.
  - `migrateState()` rellena claves nuevas (como `mde`) en proyectos ya guardados en `localStorage`, para no romper el progreso de quien ya usó la app.
  - Intro relanzada con lenguaje de investigador. Falta el pulido de lenguaje en el resto de la app (Fase D).
- **2026-07-12: Paso 6 (notas de lectura) ganó una sugerencia de IA opcional.** `CLAUDE.md` documentaba que ese paso debía ser deliberadamente manual; la agenda vieja en `lab/next_session.md` pedía automatizarlo por completo. Se resolvió el conflicto con un punto medio confirmado por Manuel: un botón "Sugerir con IA" (deshabilitado si la referencia no tiene `resumen` real, es decir, si se agregó a mano) rellena un borrador editable en las 3 cajas de texto; nada se guarda sin que el estudiante pase por "Guardar ficha" explícitamente. Ver `lab/decision_log.md` para el detalle de la decisión de producto y `docs/module-map.md` para las líneas exactas tocadas.
- `POST /api/search` motor bibliométrico vía OpenAlex + Claude, sin inventar citas.
- Probado con `curl` directo contra `vercel dev` local, ambos escenarios: el endpoint devuelve el error esperado cuando la clave falta, y devuelve HTTP 200 con contenido real una vez la clave está disponible (confirmado de nuevo tras la rotación del 2026-07-12).

## Verificación

- `node --check` pasa en los 3 archivos `.js` reales del proyecto (`web/api/generate.js`, `web/api/search.js`, `poster/src/build_poster.js`). Ver `docs/testing.md`.
- No se corrió una verificación visual del póster en esta sesión (no se tocó `build_poster.js`).
- No se abrió `web/index.html` en un navegador real en esta sesión.

## Pendientes activos

- Definir límite de gasto mensual en la consola de Anthropic.
- Generar el QR hacia la URL de producción elegida.
- Decidir cuál de los 3 alias de Vercel es "el" link oficial para el QR (`web-beta-hazel-49.vercel.app` es el que se usa hoy en la práctica, pero no se fijó explícitamente con `vercel alias set`).
- Llenar `lab/roadmap.md` (sigue casi vacío).
