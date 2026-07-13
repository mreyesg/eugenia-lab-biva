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
