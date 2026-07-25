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
- [~] Higiene operativa: alias oficial de Vercel confirmado y QR generado (`poster/assets/qr-produccion.svg`/`.png`), ambos cerrados el 2026-07-18. Queda pendiente el límite de gasto mensual en Anthropic (tiene que hacerlo Manuel en la consola).

### Mediano plazo (3–12 meses)

- [~] Fase C: salidas orientadas a publicación. La tabla comparativa, los borradores citados por sección (justificación, métodos, comparación, discusión) y los estilos de cita estándar (APA / ACS / Vancouver) ya están implementados, verificados y **en producción (2026-07-18)**. Falta decidir si se quieren estilos de cita más completos (limitados hoy por los metadatos disponibles) y una salida específica por formato de divulgación.
- [~] Fase D: pulido de lenguaje de investigador en toda la app. Primera pasada hecha (2026-07-18): corregido un desfase real (restos de "mapa bibliográfico"/"perspectivas" en el paso ya renombrado a "Componentes del trabajo"), ampliada la lista de formatos de divulgación con opciones profesionales, y ajustado el subtítulo del resumen final. El resto de los pasos ya estaba en tono adecuado. Vale una relectura humana antes del congreso.
- [ ] **Extracción estructurada de variables experimentales cuantitativas (la pieza de fondo que falta, prioridad después del congreso).** Es la meta formal del semestre de Kamila (CIFI 4996, ago-dic 2026) y el techo real de utilidad científica de la app hoy. Estado actual: la MDE se construye a partir de abstracts en prosa, así que puede decir "usar etanol 50-70%" pero no puede construir una tabla de "5 estudios reportan TPC 20-80 mg GAE/g con etanol 20-40% v/v, mediana 45". Lo que hace falta, en orden:
  1. Una tarea nueva de extracción que, dado el texto de un artículo, devuelva variables experimentales tipadas (variable, valor, unidad, método, matriz/muestra, condiciones) con el fragmento textual que las sostiene, y que declare explícitamente cuando un dato no está en el texto en vez de estimarlo. El riesgo de alucinación aquí es mayor que en la auditoría, porque un número inventado es indistinguible de uno real a simple vista: exige el mismo tratamiento de anclaje obligatorio y pruebas anti-alucinación con aserciones duras.
  2. Extraer de texto completo, no solo del abstract. Hoy `extraerReferencia` lee las primeras 3 páginas del PDF y solo saca metadatos bibliográficos; los números viven en Métodos y Resultados. Con `pdf.js` ya en el cliente, el camino es ampliar el rango de páginas y segmentar por secciones.
  3. Una tabla de variables persistida en el estado (no solo texto), exportable a CSV, que sea el insumo de la MDE. Ahí la MDE pasa de parafrasear a agregar: rangos, medianas, conteo de estudios por condición.
  4. Solo entonces tiene sentido medir si la MDE mejora, con la métrica ya escrita en `docs/decisions.md` (2026-07-25): cantidad de valores cuantitativos distintos en los criterios adoptados.
  Ver `reference/Plan_Trabajo_Kamila_Ago-Dic2026.pdf` (octubre-noviembre) y `docs/vision-app.md`.
- [x] Primer paso de la extensión estratégica: insumo de "tus propios resultados" y auditoría de defendibilidad anclada a evidencia. **Desplegado a producción el 2026-07-25**, con la garantía anti-alucinación reverificada contra producción real (cero señales ancladas a resultados propios cuando no se envían).
- [x] Interoperabilidad y búsqueda auditable (2026-07-25): exportación del corpus a BibTeX/RIS/CSV, guardar y cargar el proyecto como archivo, consulta visible y editable con filtros de año y tipo, registro de búsquedas con párrafo de métodos, y Crossref como tercera base. Todo en producción.

### Largo plazo (1–3 años)

- [ ] Biblioteca Viva como compañero de defendibilidad longitudinal completo: bucle que reexamina la pregunta a medida que crecen el corpus y los resultados.
- [ ] Acceso institucional legítimo a bases pagadas (Scopus, Web of Science) vía colaboración formal con el Sistema de Bibliotecas de la UPR.
- [ ] Escalar la herramienta más allá del caso de química a otras disciplinas.
- [ ] Publicación metodológica sobre desarrollo de apps de IA para la investigación científica (la presentación viva en `presentation/` es su base).

---

## Líneas de trabajo activas

| Línea | Descripción | Estado |
|-------|-------------|--------|
| Motor bibliométrico y MDE | Búsqueda multi-fuente real, señales de calidad, Matriz de Decisión, síntesis, informe. | Fases A y B completas y en producción; Fase C avanzada, en producción. Motor ampliado a 3 bases (OpenAlex, Europe PMC, Crossref), 12 resultados y abstracts completos el 2026-07-25. **Falta la extracción cuantitativa de variables**, que es lo que convertiría la MDE en un instrumento sobre datos y no sobre prosa. |
| Herramienta de investigador | Modo investigador, entrada rápida, lenguaje de investigador. | Modo investigador desplegado; pulido de lenguaje (Fase D) con primera pasada hecha el 2026-07-18. |
| Incorporar fuentes propias | Subir PDF propio y extraer su referencia; señal de acceso cerrado. | Desplegado (2026-07-13). |
| Documentación viva | Ponencia sobre el desarrollo de la app, como base de publicación. | Dos versiones de tema visual (`presentation/`, botánico y químico), cerradas para imprenta el 2026-07-24 sin la prueba en frío de Kamila, que no llegó a tiempo. |
| Interoperabilidad | Que el corpus y el proyecto salgan de la app, y que la búsqueda sea auditable y repetible. | Desplegado (2026-07-25): BibTeX/RIS/CSV, exportar/importar proyecto, registro de búsqueda con párrafo de métodos. |

---

## Líneas futuras o en exploración

- **Compañero de defendibilidad (dirección estratégica, 2026-07-13).** Extender la app más allá de encontrar evidencia hacia mantener viva la validez de la pregunta y auditar la defendibilidad del trabajo. **Primer paso construido y verificado el 2026-07-18, pendiente de aprobación visual y despliegue:** (1) los resultados propios del investigador como insumo de primera clase (paso "Tus resultados", 100% manual); (2) una auditoría por dimensiones (teórica, metodológica, ética, novedad, reproducibilidad, alineación pregunta-evidencia), con cada señal anclada a evidencia real o a una ausencia declarada, nunca inventada, y lo ético como preguntas a considerar y no veredictos, verificado con pruebas anti-alucinación contra la API real. Falta: (3) el bucle longitudinal que reexamina la pregunta a medida que crecen corpus y resultados (fuera de alcance de este primer paso). Detalle en `docs/vision-app.md` y `docs/current-status.md`.
- Acceso institucional a bases pagadas vía Bibliotecas UPR (gestión, no código).

---

## Última revisión del roadmap

**Fecha:** 2026-07-25
**Notas:** Se cerró el primer paso del compañero de defendibilidad (desplegado) y se añadió la línea de interoperabilidad. Lo más importante de esta revisión: la extracción cuantitativa de variables experimentales quedó descrita como un plan de 4 pasos con su riesgo principal identificado (alucinación de números, más peligrosa que la de texto), en vez de una sola línea de intención. Es el trabajo de fondo para después del congreso. Revisión previa: 2026-07-13, cuando se llenó el roadmap por primera vez y se incorporó la dirección estratégica de "compañero de defendibilidad" frente a herramientas de descubrimiento tipo Elicit.
