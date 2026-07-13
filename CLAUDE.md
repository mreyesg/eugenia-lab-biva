# CLAUDE.md — EugenIA Lab / Biblioteca Viva

Este archivo es el contexto de arranque para Claude Code sobre este proyecto. Léelo completo antes de tocar cualquier archivo.

## Quién es quién

- **Manuel Reyes Guzmán, Ph.D.** — Investigador principal. Catedrático, Departamento de Ciencias Físicas, Facultad de Estudios Generales, UPR-Río Piedras.
- **Kamila López Díaz** — Estudiante investigadora, concentración en Química, UPR-RP. Matriculada en CIFI 4996 (investigación dirigida), agosto-diciembre 2026.

## Preferencia de estilo, siempre aplicable

Nunca usar guiones largos (em-dashes, "—") en ningún texto generado, en ningún archivo de este proyecto. Usar comas, dos puntos o punto y aparte en su lugar.

## Qué es este proyecto

Este directorio junta tres piezas que forman parte de la misma línea de trabajo:

1. **Un póster académico** para un evento interno de la UPR, sobre el caso de investigación de Kamila (optimización de solventes en Plectranthus amboinicus, "orégano brujo").
2. **Una app web agentic** ("Biblioteca Viva") que implementa el framework de 8 etapas de EugenIA Lab, para que cualquier interesado que vea el póster pueda organizar su propia investigación desde su teléfono.
3. **Documentos de referencia** del programa EugenIA Lab que fundamentan tanto el póster como la app.

## Trasfondo del programa EugenIA Lab

EugenIA Lab es un programa de experiencias investigativas subgraduadas del Departamento de Ciencias Físicas (curso CIFI 4996), fundado por el Prof. Manuel Reyes Guzmán. El nombre honra a Eugene Garfield, fundador de la bibliometría moderna.

El proyecto fundacional estudia las propiedades fitoquímicas y el potencial biológico de Plectranthus amboinicus, documentado en tres presentaciones estudiantiles sucesivas:

- **Fase I**: ACS Senior Technical Meeting, PUCPR (Ponce)
- **Fase II**: Congreso de Investigación Estudiantil, Universidad Ana G. Méndez (UAGM)
- **Fase III**: ACS Junior Technical Meeting, UPR-Río Piedras

El plan de trabajo semestral de Kamila (agosto-diciembre 2026, ver `reference/Plan_Trabajo_Kamila_Ago-Dic2026.pdf`) es la continuación directa de esa trayectoria. Ver ese documento para el detalle completo, pero en resumen:

- El agente **EugenIA** ya tiene un pipeline operativo: búsqueda multi-base de datos (PubMed, OpenAlex, CrossRef, Scopus, Web of Science), deduplicación por DOI/título normalizado, enriquecimiento con Unpaywall, validación de PDFs con PyMuPDF, generación de CSV.
- Lo que falta y es el objetivo del semestre: integrar la extracción estructurada de variables experimentales (hoy en un asistente GPT separado, no integrado al pipeline) directamente a EugenIA, completando el ciclo:

  **Literatura científica (PDFs) → búsqueda y descarga automatizada → extracción estructurada de variables → Matriz de Decisión Experimental (MDE) → criterios de diseño experimental**

- La **MDE (Matriz de Decisión Experimental)** es el concepto central del proyecto: traduce evidencia bibliométrica curada en criterios operativos concretos para el diseño experimental del laboratorio docente. No es una tabla descriptiva, es un instrumento de decisión.
- Meta de este semestre: **EugenIA v2.0**, con el módulo de análisis integrado.

## El caso de estudio (contenido factual ya validado)

- Corpus curado por EugenIA: **47 artículos científicos**.
- Solventes más reportados: **etanol acuoso 20-40% v/v** y **metanol**.
- Rango de TPC (contenido fenólico total) en solventes polares: **20-80 mg GAE/g**.
- Métodos de extracción dominantes: **Soxhlet y maceración**.
- Constante dieléctrica de los solventes de mejor rendimiento: **0.7-0.9**.
- Diseño experimental adoptado: **etanol 50-70% v/v** (balance entre evidencia curada y viabilidad del laboratorio docente).
- Validación de la curaduría automatizada: **91.3% de coincidencia** entre EugenIA y la extracción manual de variables. Los errores se concentraron en conversión de unidades entre estudios y en interpretación de rangos reportados como valores puntuales.
- Resultados bibliométricos más amplios (de la Fase III, ver `reference/Plectranthus_PhaseIII_PresentationJulio.pptx`): crecimiento acelerado con punto de inflexión ~2016; ~70% de la producción científica concentrada en la región Indo-Malaya y Brasil ("¿dónde está el Caribe?"); dominios temáticos principales: fitoquímica, antimicrobiano/antiinflamatorio, usos biomédicos; insight clave: conexión débil entre Composición → Bioactividad → Aplicación en la literatura existente; el proyecto se redirigió de un enfoque antipruritico inicial hacia múltiples rutas bioactivas emergentes.

## Historial de decisiones de diseño relevantes

1. El póster pasó por varias iteraciones: primero centrado solo en los resultados fitoquímicos, luego reenfocado alrededor de un framework pedagógico llamado "BIVA" (Biblioteca Viva de Investigación, un framework hipotético de 8 etapas para organizar cualquier investigación estudiantil), y finalmente **BIVA fue reemplazado por EugenIA Lab** como marco principal porque EugenIA Lab es real y tiene un plan de trabajo formal, mientras que BIVA nació de una conversación especulativa.
2. Las 8 etapas del framework (que sí se conservaron conceptualmente, ahora bajo el paraguas de EugenIA Lab) son:
   1. Idea inicial
   2. Fricción conceptual
   3. Pregunta y objetivos
   4. Mapa bibliográfico
   5. Bibliografía viva
   6. Notas de lectura
   7. Divulgación
   8. Reflexión
3. La MDE se estableció como concepto **protagonista** del póster final, con una franja de 5 pasos (literatura → búsqueda/descarga → extracción de variables → MDE → criterios de diseño experimental) y una mini-tabla de ejemplo mostrando cómo se traduce evidencia curada en criterios adoptados.
4. El póster final está en `poster/Poster_EugenIA_Lab_MDE.pptx`, tamaño 44x60 pulgadas, 4 columnas, paleta verde bosque/musgo (identidad visual que también se usa en la app).

### El póster es código, no solo un archivo final

El `.pptx` se genera con un script de Node.js (`pptxgenjs`), no se editó a mano en PowerPoint. El script fuente está en `poster/src/build_poster.js`. Para regenerar el póster después de editar el script:

```
cd poster/src
npm install pptxgenjs
node build_poster.js
```

Esto escribe el `.pptx` directamente en `poster/src/`, desde donde hay que copiarlo de vuelta a `poster/Poster_EugenIA_Lab_MDE.pptx`. El proyecto usa un skill de Anthropic (`pptx`) con reglas específicas para evitar archivos corruptos (nunca usar "#" en colores hex, nunca reutilizar objetos de opciones entre llamadas, usar `bullet: true` en vez de viñetas unicode, etc.) y para verificación visual (convertir a PDF con LibreOffice, luego a imágenes con `pdftoppm`, e inspeccionar antes de dar por bueno el resultado). Si Claude Code no tiene ese skill disponible, aplica esas mismas reglas manualmente y siempre verifica el resultado visualmente antes de darlo por terminado: los errores de traslape o desbordamiento de texto son comunes y no siempre obvios solo leyendo el código.

En `poster/src/previous_versions/` están las cuatro iteraciones anteriores del póster, guardadas por si hace falta recuperar contenido o comparar decisiones de diseño:

- `v1_solo_resultados.js`: solo los resultados del estudio fitoquímico (antes de introducir cualquier framework).
- `v2_biva_framework.js`: primera versión con el framework BIVA (8 etapas) como marco conceptual.
- `v3_biva_completo.js`: fusión de v1 y v2 en un solo póster de 3 columnas.
- `v4_biva_app_prototipo.js`: versión de 4 columnas que incorporó las Fases I-III del programa y el ángulo de "app prototipada", todavía bajo el nombre BIVA.

La versión vigente (`build_poster.js`) reemplazó BIVA por EugenIA Lab e introdujo la MDE como protagonista, según se explica arriba.

## La app "Biblioteca Viva" (`app/biblioteca_viva_app.html`)

Objetivo: para la fecha de presentación del póster (en 2-4 semanas desde que se pidió), cualquier persona interesada en el contenido del póster pueda escanear un QR y usar una app agentic que la ayude a organizar su propia investigación, siguiendo las mismas 8 etapas.

Decisiones de producto ya tomadas:

- **Acceso**: enlace/QR a una web app que corre en el navegador del teléfono (no requiere descarga ni instalación).
- **Completitud del MVP**: las 8 etapas completas, incluyendo divulgación.
- Es un artefacto HTML de una sola página (vanilla JS, sin build step), pensado para publicarse como artefacto de Claude.ai y compartirse como link público.
- Usa `window.storage` (API de persistencia de artefactos de Claude.ai) para guardar el progreso de cada usuario. **Nunca usa localStorage ni sessionStorage** (no funcionan en artefactos de Claude.ai).
- Es agentic de verdad: en los pasos de fricción conceptual, pregunta/objetivos, mapa bibliográfico y divulgación, hace fetch a `https://api.anthropic.com/v1/messages` (sin pasar API key, se maneja automáticamente dentro de artefactos de Claude.ai) para generar sugerencias adaptadas al tema específico de cada usuario. Modelo usado: `claude-sonnet-4-6`.
- Los pasos de bibliografía viva, notas de lectura y reflexión son deliberadamente manuales (sin IA), siguiendo el principio del framework de que la curaduría crítica y la reflexión no deben delegarse a un atajo automático.
- Identidad visual: paleta verde bosque (`#1F4620`), musgo (`#5B8C3E`), crema (`#FBFAF6`), acento tierra (`#8A5A2B`). Tipografía Fraunces (display) + Inter (cuerpo), vía Google Fonts. Motivo de "hojas" en el indicador de progreso, conectando con el concepto de "biblioteca viva".
- Se probó la navegación completa de las 8 etapas y la pantalla de resumen en un navegador headless (Playwright) sin errores de JavaScript. Las llamadas reales a la API de Claude solo funcionan dentro del entorno de artefactos de Claude.ai (no al abrir el HTML suelto en un navegador cualquiera), porque ahí es donde se inyecta la autenticación.

**Nota (2026-07-12):** todo lo de arriba en esta sección describe `app/biblioteca_viva_app.html`, el artefacto legado (sigue siendo así ahí, sin cambios). La app en producción real es `web/` (ver `docs/module-map.md` y `docs/current-status.md` para el estado vigente), que ya se desvió de esta descripción: usa `localStorage` en vez de `window.storage`, llama a un backend propio (`/api/generate`, `/api/search`) en vez de la API de Claude directo, el paso 5 (bibliografía viva) ya tiene búsqueda asistida por IA vía OpenAlex, y el paso 6 (notas de lectura) desde hoy ofrece una sugerencia de IA opcional (ver `lab/decision_log.md`, entrada 2026-07-12). El principio de que "la curaduría crítica no se delega a un atajo automático" se mantiene, pero en `web/` se implementa dejando la sugerencia de IA como borrador editable que el estudiante debe revisar, no como automatización silenciosa.

## Limitación importante a tener presente

**Este HTML no se puede simplemente "correr" como una app de producción fuera de Claude.ai.** Para que el QR funcione en la presentación del póster, hay que:

1. Abrir el HTML como artefacto dentro de Claude.ai (subiéndolo a una conversación, o recreándolo ahí).
2. Usar la función de publicar/compartir del artefacto para generar un enlace público.
3. Convertir ese enlace en el QR code.

Si en esta sesión de Claude Code se decide llevar la app a una arquitectura fuera de Claude.ai (hosting propio, backend separado, etc.), hay que reemplazar las llamadas directas a `api.anthropic.com` por un backend propio que sí maneje la API key de forma segura, y sustituir `window.storage` por una solución de persistencia real (base de datos, o al menos localStorage si ya no corre dentro de un artefacto).

## Qué falta / próximos pasos sugeridos

- Definir si la app se queda como artefacto de Claude.ai o se migra a un hosting propio antes de la fecha del póster.
- Si se migra: decidir backend (persistencia de proyectos, manejo seguro de la API key) y hosting.
- Revisar si el calendario de `reference/Plan_Trabajo_Kamila_Ago-Dic2026.pdf` (agosto: auditoría, agosto-septiembre: diseño del módulo, septiembre-octubre: implementación, octubre-noviembre: MDE y validación, noviembre: divulgación, diciembre: cierre) debe reflejarse también como hitos dentro de este repositorio (por ejemplo, en `lab/roadmap.md`, que hoy está vacío).
- Los archivos en `lab/` (`decision_log.md`, `next_session.md`, `project_state.md`, `roadmap.md`) son plantillas de gobernanza de EugenIA Lab, casi vacías. Vale la pena llenarlas a medida que avance el trabajo en Code, en vez de dejarlas como plantilla suelta.

## Estructura de este directorio

```
eugenia_lab_biva/
├── CLAUDE.md                          (este archivo)
├── app/
│   └── biblioteca_viva_app.html       (la app de 8 etapas, lista para subir como artefacto)
├── poster/
│   ├── Poster_EugenIA_Lab_MDE.pptx    (póster final, 44x60", 4 columnas)
│   └── src/
│       ├── build_poster.js            (script que genera el .pptx, editar y correr esto para cambios)
│       └── previous_versions/         (4 iteraciones anteriores, ver CLAUDE.md arriba)
├── presentation/                      (ponencia sobre el desarrollo de la app; documento vivo, ver presentation/README.md)
│   ├── Presentacion_Biblioteca_Viva.pptx  (salida generada, 24 slides 16:9)
│   └── src/
│       └── build_presentation.js      (script pptxgenjs que genera el .pptx; la presentación es código, igual que el póster)
├── reference/
│   ├── AI_Assisted_Literature_Analysis_PlectranthusJulio.pdf   (abstract ACS original)
│   ├── Plectranthus_PhaseIII_PresentationJulio.pptx            (presentación Fase III)
│   └── Plan_Trabajo_Kamila_Ago-Dic2026.pdf                     (plan semestral oficial)
└── lab/
    ├── decision_log.md
    ├── next_session.md
    ├── project_state.md
    └── roadmap.md
```
