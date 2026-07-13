# Handoff — protocolo de cierre de sesión

Este archivo es el protocolo *mecánico* que cualquier agente debe seguir al cerrar una sesión de trabajo en este repo, y el registro de la última entrega. No confundir con `lab/next_session.md`, que es la agenda *de contenido* (qué investigar, qué construir) para Manuel/Kamila — ese archivo se sigue manteniendo por separado.

## Protocolo (seguir en orden al cerrar sesión)

1. Correr `bash scripts/verify.sh` desde la raíz del repo. Si falla algo, no lo dejes en silencio: anótalo en la sección "Qué quedó roto o a medias" de abajo, no lo omitas del resumen final.
2. Actualizar `docs/current-status.md` con cualquier cambio de infraestructura, endpoints, o estado de variables de entorno.
3. Si tomaste una decisión de dirección técnica (no una tarea mecánica), añade una entrada a `docs/decisions.md`. Si la decisión fue sobre dirección de investigación/producto (no sobre el harness), va en `lab/decision_log.md` en su lugar.
4. Sobrescribe la sección "Última entrega" de este archivo (abajo) con el estado real al momento de cerrar. No acumules entregas viejas aquí, para eso está el historial de decisiones.
5. Si la agenda de contenido del lab cambió (próximos pasos de investigación, no de ingeniería), actualiza también `lab/next_session.md`.

## Última entrega

**Fecha:** 2026-07-12
**Quién:** sesión de Claude Code (continuación de la que instaló el arnés el 2026-07-09).

### Qué se hizo

- Se inicializó git en la raíz del repo y se publicó en GitHub como `mreyesg/eugenia-lab-biva` (privado). Ver `docs/decisions.md` para el detalle de cómo se verificó que no se filtró ningún secreto antes del primer commit.
- Se rotó `ANTHROPIC_API_KEY` completa: clave nueva generada por Manuel directamente en console.anthropic.com (nunca pasó por el chat/contexto del agente), reemplazada en `web/.env.local`, resubida a los 3 entornos de Vercel por separado, producción redesplegada (`vercel --prod`). Confirmado con `POST /api/generate` local (HTTP 200) y `scripts/verify.sh --network` contra producción (0 fallos, 0 advertencias).
- Se actualizaron `AGENTS.md`, `docs/current-status.md`, `docs/decisions.md` y `lab/next_session.md` para reflejar ambos cambios (ya no dicen "no hay git" ni "falta rotar la clave").

### Qué quedó roto o a medias

- Nada roto conocido al momento de cerrar. `bash scripts/verify.sh --network` corrió limpio como última acción de la sesión.

### Próximo paso recomendado (el primero que debería hacer la siguiente sesión)

La rotación de `ANTHROPIC_API_KEY` quedó cerrada del todo el 2026-07-12: Manuel confirmó que ya revocó la clave vieja en console.anthropic.com. No hace falta volver sobre esto.

1. Decidir cuál alias de Vercel es el oficial para el QR (ver `docs/current-status.md`) y, si aplica, fijarlo con `vercel alias set`.
2. Definir límite de gasto mensual en la consola de Anthropic, y generar el QR final.
3. Después de eso, seguir con la agenda de contenido en `lab/next_session.md` (fichas de lectura automáticas del paso 6, etc.), que es independiente de este arnés.
