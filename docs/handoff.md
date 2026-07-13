# Handoff — protocolo de cierre de sesión

Este archivo es el protocolo *mecánico* que cualquier agente debe seguir al cerrar una sesión de trabajo en este repo, y el registro de la última entrega. No confundir con `lab/next_session.md`, que es la agenda *de contenido* (qué investigar, qué construir) para Manuel/Kamila — ese archivo se sigue manteniendo por separado.

## Protocolo (seguir en orden al cerrar sesión)

1. Correr `bash scripts/verify.sh` desde la raíz del repo. Si falla algo, no lo dejes en silencio: anótalo en la sección "Qué quedó roto o a medias" de abajo, no lo omitas del resumen final.
2. Actualizar `docs/current-status.md` con cualquier cambio de infraestructura, endpoints, o estado de variables de entorno.
3. Si tomaste una decisión de dirección técnica (no una tarea mecánica), añade una entrada a `docs/decisions.md`. Si la decisión fue sobre dirección de investigación/producto (no sobre el harness), va en `lab/decision_log.md` en su lugar.
4. Sobrescribe la sección "Última entrega" de este archivo (abajo) con el estado real al momento de cerrar. No acumules entregas viejas aquí, para eso está el historial de decisiones.
5. Si la agenda de contenido del lab cambió (próximos pasos de investigación, no de ingeniería), actualiza también `lab/next_session.md`.

## Última entrega

**Fecha:** 2026-07-09
**Quién:** sesión de Claude Code instalando el arnés agentic descrito en `AGENTS.md`.

### Qué se hizo

- Se diagnosticó y corrigió la causa raíz de que `vercel dev` no podía leer `ANTHROPIC_API_KEY` localmente: la variable solo existía en los entornos `Production`/`Preview` de Vercel, no en `Development`. Se agregó con `npx vercel env add ANTHROPIC_API_KEY development`.
- Se instaló este arnés operativo: `AGENTS.md`, `docs/current-status.md`, `docs/handoff.md` (este archivo), `docs/testing.md`, `docs/module-map.md`, `docs/decisions.md`, `scripts/verify.sh`, y tres subagentes en `.claude/agents/` (`explorador`, `implementador`, `verificador`).
- Se confirmó que este directorio no es un repositorio git.

### Qué quedó roto o a medias

- `npx vercel env pull .env.local` se intentó primero y se interrumpió; se reintentó más tarde en la misma sesión y **sí se completó**. Se confirmó de punta a punta: `vercel dev` local + `POST /api/generate` con `task: "friccion"` devolvió HTTP 200 con las 4 opciones esperadas. Este pendiente quedó resuelto, no hace falta repetirlo.
- Durante la sesión quedaron dos procesos `vercel dev` corriendo a la vez (puertos 3000 y 3001) por un `TaskStop` que no mató el proceso hijo real; se resolvió matándolos por PID vía PowerShell (`Get-NetTCPConnection` + `Stop-Process`). Al cierre de la sesión, los puertos 3000/3001 quedaron libres (verificado). Si una sesión futura ve el puerto 3000 ocupado sin explicación, este es el tipo de causa a revisar.
- No se decidió si inicializar git, ni cuál de los 3 alias de Vercel usar como el link oficial del QR.

### Próximo paso recomendado (el primero que debería hacer la siguiente sesión)

1. El flujo local de `web/` ya está confirmado funcionando; no hace falta re-diagnosticarlo. Si hace falta levantar `vercel dev` de nuevo, `.env.local` ya tiene la clave correcta.
2. Decidir cuál alias de Vercel es el oficial para el QR (ver `docs/current-status.md`) y, si aplica, fijarlo con `vercel alias set`.
3. Después de eso, seguir con la agenda de contenido en `lab/next_session.md` (fichas de lectura automáticas del paso 6, etc.), que es independiente de este arnés.
