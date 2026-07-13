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

**Superado por la entrada del 2026-07-12 abajo:** Manuel pidió explícitamente inicializar git y subirlo a GitHub. Esta entrada se conserva como registro histórico de por qué no se hizo unilateralmente en su momento.

## [2026-07-12] — Inicializar git y publicar el repo en GitHub (privado)

**Contexto:** Manuel pidió explícitamente crear el repo en GitHub, con la condición de no exponer `ANTHROPIC_API_KEY`. Ver la entrada del 2026-07-09 arriba sobre por qué no se había hecho antes.

**Decisión:** `git init` en la raíz, `.gitignore` (raíz + `web/.gitignore` ajustado) excluyendo `web/.env.local`, `web/.vercel/` y todo `node_modules/`, primer commit de 35 archivos, y `gh repo create mreyesg/eugenia-lab-biva --private`. Antes del commit se verificó con `git check-ignore -v` sobre cada ruta sensible (no solo se asumió que el patrón funcionaba) y con `grep -rl "sk-ant-"` sobre todo el árbol para descartar claves hardcodeadas fuera de `.env.local`.

**Razón:** Ya con confirmación explícita del dueño del proyecto, el riesgo que motivaba la cautela anterior (filtrar el secreto en el primer commit) se resuelve verificando antes de comprometer, no evitando el commit indefinidamente.

**Impacto:** El repo ahora sí tiene historial de git real; `AGENTS.md` y `docs/current-status.md` deben actualizarse para reflejar que la sección "no hay git" ya no aplica (revisar si quedó desactualizada en una lectura futura). `web/.gitignore` quedó con una regla nueva (`!.env.example`) porque la regla `.env*` original bloqueaba también a la plantilla sin secretos.

## [2026-07-12] — Rotar secretos sin que el valor pase por el chat/contexto del agente

**Contexto:** `ANTHROPIC_API_KEY` ya había quedado expuesta una vez en el historial de una sesión de Code (el problema que se está corrigiendo). Rotarla pidiéndole a Manuel que pegara la clave nueva en el chat habría repetido exactamente el mismo incidente.

**Decisión:** Manuel generó la clave nueva en console.anthropic.com y la escribió directamente en `web/.env.local` con su propio editor, sin pasarla por el chat. El agente nunca corrió `Read` sobre ese archivo durante la rotación; en vez de eso, usó `grep '^ANTHROPIC_API_KEY=' .env.local | sed ... | npx vercel env add ...` para subir el valor a Vercel por un pipe de shell, de modo que el valor nunca aparece en la salida que el agente recibe de vuelta.

**Razón:** La única forma de que un secreto no quede en el historial de una sesión de agente es que el agente nunca lo reciba como texto en su contexto. Pedir la acción (generar clave, editar archivo) sin pedir el valor logra eso sin sacrificar que el agente orqueste el resto (borrar la clave vieja de Vercel, subir la nueva, verificar, redesplegar).

**Impacto:** Este es el patrón a seguir la próxima vez que haga falta rotar o introducir un secreto nuevo en este proyecto: la escritura del valor la hace el humano en su editor, el agente solo mueve el valor entre archivo y destino final por pipes, nunca lo imprime ni lo lee con una herramienta que lo devuelva como texto visible.

## [2026-07-13] — Usar el bypass de automatización de Vercel para probar Previews con Playwright, y apagarlo despues de cada uso

**Contexto:** Antes de promover el Preview B+ a producción, se intentó un recorrido automatizado de las 8 etapas con Playwright (emulación móvil) contra la URL de Preview. Vercel protege todo Preview con un muro de login (devuelve 302 hacia `vercel.com/login`), así que un navegador headless sin sesión no puede pasar; probar contra `vercel dev` local tampoco sirve porque el adaptador en Windows falla al enviar `POST` (ver `docs/handoff.md`, entrada 2026-07-13 anterior).

**Decisión:** Se habilitó el "Protection Bypass for Automation" del proyecto (`npx vercel project protection enable web --protection-bypass --format json`), que genera un secreto de un solo propósito para pasar por header (`x-vercel-protection-bypass`) sin exponer el Preview públicamente. Con ese secreto, Playwright completó el recorrido real de punta a punta (mapa, búsqueda, MDE, síntesis, informe, descarga e impresión) contra el Preview. Al terminar, el secreto se desactivó (`... disable web --protection-bypass --protection-bypass-secret <secreto>`) y se confirmó con `curl` que ya no funciona.

**Razón:** Es el mecanismo que Vercel ofrece explícitamente para pruebas headless/CI contra Previews sin bajar la protección para el público general. Dejar el secreto activo indefinidamente, o reusar uno viejo, sería repetir el mismo tipo de riesgo que ya motivó la rotación de `ANTHROPIC_API_KEY` (secreto expuesto en el historial de una sesión de agente): mejor generarlo, usarlo, y apagarlo en la misma sesión.

**Impacto:** Patrón reusable para la próxima vez que haga falta un recorrido automatizado contra un Preview: habilitar el bypass, correr las pruebas, apagarlo. No dejar el bypass encendido entre sesiones. La prueba automatizada contra producción (una vez promovido) no necesita nada de esto, porque producción no tiene el muro de login por defecto.
