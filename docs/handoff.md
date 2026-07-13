# Handoff — protocolo de cierre de sesión

Este archivo es el protocolo *mecánico* que cualquier agente debe seguir al cerrar una sesión de trabajo en este repo, y el registro de la última entrega. No confundir con `lab/next_session.md`, que es la agenda *de contenido* (qué investigar, qué construir) para Manuel/Kamila — ese archivo se sigue manteniendo por separado.

## Protocolo (seguir en orden al cerrar sesión)

1. Correr `bash scripts/verify.sh` desde la raíz del repo. Si falla algo, no lo dejes en silencio: anótalo en la sección "Qué quedó roto o a medias" de abajo, no lo omitas del resumen final.
2. Actualizar `docs/current-status.md` con cualquier cambio de infraestructura, endpoints, o estado de variables de entorno.
3. Si tomaste una decisión de dirección técnica (no una tarea mecánica), añade una entrada a `docs/decisions.md`. Si la decisión fue sobre dirección de investigación/producto (no sobre el harness), va en `lab/decision_log.md` en su lugar.
4. Sobrescribe la sección "Última entrega" de este archivo (abajo) con el estado real al momento de cerrar. No acumules entregas viejas aquí, para eso está el historial de decisiones.
5. Si la agenda de contenido del lab cambió (próximos pasos de investigación, no de ingeniería), actualiza también `lab/next_session.md`.

## Última entrega

**Fecha:** 2026-07-12 (tercera ronda del mismo día)
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
