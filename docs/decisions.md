# Decisions log (harness/ingeniería)

Este log es para decisiones sobre **cómo trabajamos con el código y las herramientas** (harness de agentes, verificación, tooling, infraestructura de desarrollo). Para decisiones sobre **dirección de investigación o producto** (qué framework usar en el póster, qué modelo de IA usar en la app, cómo se hostea, qué contenido lleva el póster), esas van en `lab/decision_log.md`, que ya existía antes de este arnés y sigue siendo la fuente para ese tipo de decisión.

Mismo formato que `lab/decision_log.md`, por consistencia:

```
## [YYYY-MM-DD] — Título de la decisión
**Contexto:** Qué situación motivó la decisión.
**Decisión:** Qué se decidió.
**Razón:** Por qué esta opción.
**Impacto:** Qué cambia como resultado.
```

---

## [2026-07-09] — Instalar un arnés agentic específico al proyecto, en vez de reglas genéricas

**Contexto:** El proyecto ya tenía una carpeta `lab/` con gobernanza (estado, decisiones, agenda), pero nada orientado específicamente a que un agente de código nuevo pueda arrancar sin leer el chat: no había forma verificable de saber qué comandos son reales, qué stack hay, ni un protocolo de cierre de sesión.

**Decisión:** Crear `AGENTS.md` en la raíz como punto de entrada, y una carpeta `docs/` separada de `lab/` con: `current-status.md` (snapshot técnico), `handoff.md` (protocolo de cierre), `testing.md` (verificación real, sin inventar comandos), `module-map.md` (mapa de archivos), y este archivo. Se agregó `scripts/verify.sh` y tres roles en `.claude/agents/`.

**Razón:** `lab/` ya cumplía bien su función (gobernanza de investigación/estudiantes) y estaba activamente mantenida — sobrescribirla o forzarla a servir también de harness técnico la habría hecho más confusa. Separar por audiencia (`docs/` = agente técnico, `lab/` = investigación/PI) evita que ambos archivos compitan por ser "la fuente de verdad" del mismo tipo de información.

**Impacto:** Un agente nuevo debe leer `AGENTS.md` primero. Cualquier decisión de dirección de investigación sigue yendo a `lab/decision_log.md`; cualquier decisión de tooling/harness va aquí.

## [2026-07-09] — No inicializar git como parte de este arnés

**Contexto:** El repo no tiene `.git` en ningún nivel. Un harness agentic típico asumiría git para diffs, branches y rollback, y el paso 1 pedido para esta tarea fue justamente `git status`.

**Decisión:** Documentar la ausencia de git como riesgo activo (en `AGENTS.md` y `docs/current-status.md`) pero no correr `git init` unilateralmente en esta sesión.

**Razón:** Inicializar git es aditivo y reversible en sí mismo, pero `web/.env.local` contiene una `ANTHROPIC_API_KEY` real en texto plano y `web/node_modules/` es grande; un primer commit mal armado (sin `.gitignore` correcto) filtraría el secreto o metería binarios pesados al historial. Es una decisión de infraestructura que vale más confirmarla explícitamente con Manuel antes de tomarla, no algo que se dedujera de las instrucciones de esta tarea.

**Impacto:** La continuidad entre sesiones depende por ahora enteramente de `docs/` y `lab/`, no de historial de git. Si se decide inicializar git en una sesión futura, el `.gitignore` mínimo ya quedó especificado en `AGENTS.md`.
