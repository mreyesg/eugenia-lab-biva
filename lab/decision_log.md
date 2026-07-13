# Decision Log — Eugeneia Lab

Registro de decisiones que afectan la dirección, estructura o metodología del lab.

---

## Formato de entrada

```
## [YYYY-MM-DD] — Título de la decisión
**Contexto:** Qué situación motivó la decisión.
**Decisión:** Qué se decidió.
**Razón:** Por qué esta opción.
**Impacto:** Qué cambia como resultado.
```

---

## Registro

## [2026-05-07] — Inicialización de Eugeneia Lab
**Contexto:** Creación de la estructura formal del lab dentro del ecosistema.  
**Decisión:** Establecer `eugeneia_lab/` dentro de `labs/` con estructura de governance, proyectos, estudiantes, corpus, datasets, outputs, publicaciones, notas y configuración.  
**Razón:** Centralizar el trabajo del lab bajo una estructura coherente con las convenciones del ecosistema.  
**Impacto:** Todo trabajo futuro del lab se organiza dentro de esta estructura.

## [2026-07-09] — Arnés agentic técnico separado de la gobernanza del lab
**Contexto:** Se instaló un arnés operativo para agentes de código (`AGENTS.md`, `docs/`, `scripts/verify.sh`, roles en `.claude/agents/`), pensado para que un agente nuevo pueda arrancar sin leer el historial de chat.
**Decisión:** Ese arnés vive en `docs/` y no reemplaza ni se mezcla con `lab/`. Las decisiones de dirección de investigación/producto (framework del póster, hosting, modelo de IA, etc.) se siguen registrando aquí, en `lab/decision_log.md`. Las decisiones de tooling/harness/verificación se registran en `docs/decisions.md`.
**Razón:** `lab/` ya estaba activamente mantenida por Manuel con un propósito claro (gobernanza de investigación y estudiantes); forzarla a servir también de manual técnico para agentes la habría hecho más confusa para su audiencia original.
**Impacto:** Ver también `docs/decisions.md` para el detalle técnico de esta decisión y `AGENTS.md` para el punto de entrada completo del arnés.

## [2026-07-12] — Paso 6 (notas de lectura): sugerencia de IA opcional, no automatización completa

**Contexto:** La agenda en `lab/next_session.md` (2026-07-09) pedía "fichas de lectura automáticas" para el paso 6. Pero `CLAUDE.md` documenta como principio de producto que ese paso debe ser deliberadamente manual, sin IA, porque la curaduría crítica no debe delegarse a un atajo automático. Un agente explorando la tarea antes de implementar detectó el choque y lo reportó en vez de resolverlo por su cuenta.
**Decisión:** Ni automatización completa ni status quo puramente manual. Se agregó un botón "Sugerir con IA" en el paso 6 que rellena un borrador editable (idea principal, conceptos clave, relación con la investigación) a partir del resumen real del artículo, pero el estudiante debe revisarlo y confirmar "Guardar ficha" explícitamente; nada se guarda automáticamente. El botón se deshabilita para referencias agregadas a mano (sin resumen real), para no inventar contenido sin fuente.
**Razón:** Preserva el principio de `CLAUDE.md` (la reflexión y curaduría crítica siguen siendo del estudiante, no de la IA) mientras responde al ahorro de tiempo que motivó el ítem de la agenda. Es el mismo patrón técnico que ya usan los pasos con IA existentes (fricción, mapa, etc.), así que no introduce una arquitectura nueva.
**Impacto:** `web/api/generate.js` gana una quinta tarea (`notas`). `web/index.html` paso 6 ahora tiene un flujo de sugerencia + edición humana antes de guardar. `CLAUDE.md` se actualizó con una nota aclarando que esta descripción vieja de "sin IA" corresponde al artefacto legado (`app/`) y que `web/` (producción) ya diverge en este punto. Ver `docs/current-status.md` y `docs/module-map.md` para el detalle técnico.

## [2026-07-12] — Reposicionar la app: de pedagógica a herramienta de investigador, con el motor bibliométrico como eje
**Contexto:** La app se percibía como un tutorial para subgraduados. Manuel la va a presentar en el congreso del Colegio de Químicos de Puerto Rico (fin de julio 2026) y necesita que se sienta como una herramienta de investigador. Lo fundamental y lo que debe brillar es la obtención de las mejores fuentes bibliográficas para cada parte de una investigación en curso, y el salto de esa evidencia a criterios de metodología, comparación y discusión.
**Decisión:** Reestructurar `web/` alrededor del motor bibliométrico (no solo re-nivelar). Tres capacidades deben lograrse: evidencia evaluada por sección del manuscrito, síntesis de consenso/contradicción/brecha, y la Matriz de Decisión Experimental como culminación. Para la demo del congreso, la MDE es la función estrella. Audiencia: ambos perfiles, con el modo de investigador al frente. Plano completo y secuencia de fases en `docs/vision-app.md`.
**Razón:** Es el diferenciador real frente a un gestor de referencias: no solo encuentra fuentes, las evalúa, las mapea a las partes del trabajo y las traduce en criterios de decisión. La MDE ya era protagonista del póster; llevarla a la app cierra el círculo y es química-nativo, lo que conecta con la audiencia del congreso.
**Impacto:** Cambio grande, multi-sesión, construido por fases (ver `docs/vision-app.md`). La Fase A habilita el clímax de la demo (componentes de manuscrito + motor evaluado + generador de MDE). Pendiente de que Manuel confirme la taxonomía de componentes y si la MDE usa dimensiones fijas para química o siempre generadas por IA, antes de codificar.

## [2026-07-12] — Reenfoque desde los artículos aceptados, y colaboración con Bibliotecas UPR para acceso institucional
**Contexto:** Manuel notó dos cosas usando la app. Primero, que a veces la literatura encontrada es poca o tangencial, pero el investigador puede aceptar artículos igualmente porque le interesan, y eso podría justificar reorientar la investigación. Segundo, que sería valioso buscar en las bases que la universidad paga (Scopus, Web of Science).
**Decisión:** (1) Agregar la función de **reenfoque**: a partir de los artículos aceptados, la IA propone un foco reformulado que puede girar respecto al original; el investigador adopta o conserva el original. Implementado y desplegado. (2) Para el problema de recall, primero fuentes gratuitas sin llave (reintento amplio + Europe PMC), que sirven a cualquiera vía QR. (3) Para acceso institucional real, NO usar un parche de llave individual, sino buscar una **colaboración formal con el Sistema de Bibliotecas de la UPR** para que provean accesos oficiales. Pendiente de gestionar.
**Razón:** El reenfoque respeta el principio "la IA propone, el investigador decide" y responde a una práctica real (descubrir la pregunta leyendo). Sobre las bases institucionales, una app pública no puede embeber credenciales personales; la vía legítima y escalable es institucional, vía la biblioteca.
**Impacto:** `generate.js` gana la tarea `reenfoque` (7 tareas en total). El paso de Bibliografía gana la sección de reenfoque. La colaboración con Bibliotecas queda como meta a gestionar; el diseño técnico del acceso institucional se define cuando haya acuerdo. Ver `docs/vision-app.md` sección de extensiones.
