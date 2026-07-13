# Project State: EugenIA Lab / Biblioteca Viva

**Última actualización:** 2026-07-08

---

## App "Biblioteca Viva"

**Fase actual:** Desplegada en producción (Vercel), en desarrollo activo hacia asistente bibliométrico completo.
**Meta:** App completamente funcional para fin de julio 2026, accesible por QR en la presentación del póster.

### Arquitectura
- Hosting propio en **Vercel** (ya no es artefacto de Claude.ai). Código en `web/`.
- `web/index.html`: app de 8 etapas, vanilla JS, persistencia con `localStorage`.
- `web/api/generate.js`: proxy seguro a Claude para las sugerencias (fricción, pregunta, mapa, divulgación).
- `web/api/search.js`: motor de búsqueda bibliométrica (OpenAlex + análisis de aporte por Claude). Artículos reales, sin citas inventadas.
- Modelo por defecto: `claude-sonnet-5` (configurable con env var `CLAUDE_MODEL`).
- URL pública: `https://web-beta-hazel-49.vercel.app`

### Funciona hoy
- Navegación completa de las 8 etapas con guardado automático.
- Bloqueo de "Continuar" hasta completar lo mínimo (Idea, Fricción, Pregunta).
- Sugerencias de IA en fricción, pregunta, mapa y divulgación.
- Paso 5: búsqueda de artículos reales por perspectiva del mapa, con aporte a la investigación, deduplicados por DOI, con enlace a la fuente.

### Falta (próxima ronda)
- Paso 6: fichas de lectura automáticas.
- Reformular pregunta/objetivos a la luz de la literatura.
- Regenerar perspectivas del mapa por separado.
- (Diferido) Ampliar bases de datos de búsqueda (Crossref, PubMed) y reintento con consulta amplia.

---

## Estado por estudiante

| Estudiante | Proyecto | Etapa | Próxima entrega |
|-----------|---------|-------|----------------|
| Kamila López Díaz | Optimización de solventes en Plectranthus amboinicus (CIFI 4996, ago-dic 2026) | Continuación de la trayectoria Fase I-III | Ver `reference/Plan_Trabajo_Kamila_Ago-Dic2026.pdf` |

---

## Bloqueos o pendientes críticos

- Rotar la `ANTHROPIC_API_KEY` (quedó visible en el historial de una sesión de Code).
- Definir límite de gasto mensual en Anthropic antes de exponer el QR ampliamente.
