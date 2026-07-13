# Roadmap — EugenIA Lab

Visión a mediano y largo plazo del lab. Incluye metas, hitos y dirección estratégica. Para el detalle técnico del estado de la app ver `docs/current-status.md`; para la visión de producto ver `docs/vision-app.md`; para el registro de decisiones ver `lab/decision_log.md`.

---

## Visión del lab

EugenIA Lab traduce evidencia bibliométrica curada en decisiones de investigación concretas y defendibles. La herramienta insignia, Biblioteca Viva, no aspira a ser un mejor buscador de papers, sino un compañero de integridad y defendibilidad: mantiene honesta la pregunta de investigación frente a la literatura que se acumula y frente a los resultados propios del investigador, y ayuda a divulgar un trabajo científico sólido y defendible. El motor bibliométrico es el corazón; la funcionalidad se extiende a detectar huecos teóricos, metodológicos y éticos que puedan debilitar el trabajo. Ver la diferenciación completa en `docs/vision-app.md`, sección "Extensión estratégica".

---

## Hitos por período

### Corto plazo (0–3 meses)

- [ ] Validación real de Biblioteca Viva: prueba en frío con Kamila usando la app sola, sin guía, y recoger qué logra y dónde se pierde.
- [ ] Recorrer producción en un teléfono físico real antes de imprimir el QR para el congreso.
- [ ] Congreso del Colegio de Químicos de Puerto Rico (fin de julio 2026): presentar la app con la MDE como función estrella.
- [ ] Higiene operativa: límite de gasto mensual en Anthropic, alias oficial de Vercel fijado, QR generado.

### Mediano plazo (3–12 meses)

- [ ] Fase C completa: salidas orientadas a publicación (tabla comparativa, borradores citados de justificación, métodos y discusión) en estilos de cita estándar.
- [ ] Fase D: pulido de lenguaje de investigador en toda la app.
- [ ] Semestre de Kamila (CIFI 4996, ago-dic 2026): integrar la extracción estructurada de variables experimentales cuantitativas al pipeline de EugenIA (meta EugenIA v2.0). Ver `reference/Plan_Trabajo_Kamila_Ago-Dic2026.pdf`.
- [ ] Primer paso de la extensión estratégica: insumo de "tus propios resultados" y una tarea de auditoría de defendibilidad anclada a evidencia (ver Líneas futuras).

### Largo plazo (1–3 años)

- [ ] Biblioteca Viva como compañero de defendibilidad longitudinal completo: bucle que reexamina la pregunta a medida que crecen el corpus y los resultados.
- [ ] Acceso institucional legítimo a bases pagadas (Scopus, Web of Science) vía colaboración formal con el Sistema de Bibliotecas de la UPR.
- [ ] Escalar la herramienta más allá del caso de química a otras disciplinas.
- [ ] Publicación metodológica sobre desarrollo de apps de IA para la investigación científica (la presentación viva en `presentation/` es su base).

---

## Líneas de trabajo activas

| Línea | Descripción | Estado |
|-------|-------------|--------|
| Motor bibliométrico y MDE | Búsqueda multi-fuente real, señales de calidad, Matriz de Decisión, síntesis, informe. | Fases A y B completas y en producción; Fase C iniciada. |
| Herramienta de investigador | Modo investigador, entrada rápida, lenguaje de investigador. | Modo investigador desplegado; pulido de lenguaje (Fase D) pendiente. |
| Incorporar fuentes propias | Subir PDF propio y extraer su referencia; señal de acceso cerrado. | Desplegado (2026-07-13). |
| Documentación viva | Ponencia sobre el desarrollo de la app, como base de publicación. | Primera versión creada (`presentation/`); se actualiza por hitos. |

---

## Líneas futuras o en exploración

- **Compañero de defendibilidad (dirección estratégica, 2026-07-13).** Extender la app más allá de encontrar evidencia hacia mantener viva la validez de la pregunta y auditar la defendibilidad del trabajo. Tres piezas nuevas: (1) los resultados propios del investigador como insumo de primera clase; (2) una auditoría por dimensiones (teórica, metodológica, ética, novedad, reproducibilidad, alineación pregunta-evidencia), con cada señal anclada a evidencia real o a una ausencia declarada, nunca inventada, y lo ético como preguntas a considerar y no veredictos; (3) el bucle longitudinal que reexamina la pregunta a medida que crecen corpus y resultados. Detalle en `docs/vision-app.md`.
- Acceso institucional a bases pagadas vía Bibliotecas UPR (gestión, no código).

---

## Última revisión del roadmap

**Fecha:** 2026-07-13
**Notas:** Roadmap llenado por primera vez (antes era plantilla vacía). Se incorporó la dirección estratégica de "compañero de defendibilidad" que Manuel articuló el 2026-07-13 como el diferenciador que sostiene el proyecto frente a herramientas de descubrimiento tipo Elicit.
