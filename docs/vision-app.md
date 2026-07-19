# Visión de producto: de app pedagógica a herramienta de investigador

**Estado:** dirección aprobada por Manuel (2026-07-12), con Fases A y B implementadas. La salida inicial de Fase C y el modo investigador inicial de Fase D también están implementados localmente, pendientes de validación visual y despliegue.

## El problema que estamos corrigiendo

Hoy `web/` se lee como un tutorial para que un subgraduado aprenda a organizar una investigación. Manuel quiere que se sienta como una herramienta que un investigador graduado abre a mitad de un proyecto y percibe como una ventaja real. Meta: presentarla en el congreso del Colegio de Químicos de Puerto Rico a fin de julio 2026.

Lo fundamental, y lo que debe brillar, no es el acceso por QR: es la **obtención de las mejores fuentes bibliográficas para cada parte de una investigación en curso**, y el salto de esa evidencia curada a criterios concretos de metodología, comparación y discusión.

## Decisiones tomadas (Manuel, 2026-07-12)

1. **Función estrella para la demo:** la Matriz de Decisión (evidencia curada a criterios operativos). Pero las otras dos capacidades (evidencia evaluada por sección del manuscrito, y síntesis de consenso/contradicción/brecha) también deben lograrse en la app, no solo la MDE.
2. **Alcance:** reestructurar alrededor del motor bibliométrico, no solo re-nivelar.
3. **Audiencia:** ambos, subgraduado e investigador, pero con el modo de investigador al frente (la cara que se presenta y demuestra).

## El eje nuevo

El motor bibliométrico deja de ser el paso 5 de 8 y pasa a ser la columna vertebral. Todo lo demás lo alimenta o consume su salida.

Flujo propuesto (nombres de trabajo, sujetos a ajuste):

1. **Foco de investigación.** En modo investigador: pegar una pregunta o abstract existente y arrancar rápido. En modo guiado: el flujo actual de idea, fricción, pregunta (se conserva como andamiaje para quien lo necesita). Fricción y pregunta dejan de ser protagonistas y pasan a ser insumos.
2. **Componentes de la investigación.** Reemplaza el "mapa bibliográfico" abstracto (Conceptual, Contextual, Empírica, Metodológica, Crítica) por las partes reales de un trabajo publicable. Propuesta inicial de taxonomía, a confirmar con Manuel:
   - Justificación y brecha (Introducción)
   - Métodos (para elegir y defender la metodología propia)
   - Comparación de resultados (contra qué se mide el hallazgo)
   - Discusión y contraste (dónde la literatura concuerda o discrepa, para posicionar el aporte)
   - (opcional) Marco conceptual
3. **Motor bibliométrico evaluado.** Para cada componente, busca fuentes reales directamente en OpenAlex y Europe PMC, enriquecidas con señales que un investigador respeta: tipo de estudio (revisión / primario / metodológico), citas, año, revista, acceso abierto, procedencia y una evaluación de Claude de qué tan directamente la fuente apoya el componente. Nunca inventa citas. Esta es la capacidad de "evidencia por sección".
4. **Síntesis de evidencia.** Agrega las fuentes aceptadas y revela consenso, contradicción y brecha. Alimenta la justificación y la discusión. Esta es la capacidad de "síntesis".
5. **Matriz de Decisión (clímax de la demo).** Traduce la evidencia curada en criterios operativos. Claude propone, de forma adaptable al dominio, las dimensiones de decisión relevantes para ESTE trabajo (para química: solvente, método de extracción, rangos; para otro campo, otras dimensiones), cada celda sostenida por las fuentes reales aceptadas y enlazada a su DOI. La innovación es una matriz de decisión fundamentada en evidencia, adaptable a cualquier campo, sin citas inventadas.
6. **Salida para publicar.** Convierte todo lo anterior en material citado y listo para usar según el formato (póster, presentación, paper): borrador de párrafo de métodos, tabla comparativa, andamiaje de discusión, todo anclado a las fuentes reales.

Las notas de lectura (paso 6 actual, ya con sugerencia de IA opcional) se integran como anotación por fuente. La reflexión pasa a ser opcional en el modo investigador.

## Secuencia de construcción (cada fase deja algo demostrable)

- **Fase A, crítica para la demo:** reencuadrar componentes del manuscrito, enriquecer el motor con señales bibliométricas y evaluación de fuerza por componente, y construir el generador de la MDE que consume las referencias aceptadas. Al terminar esta fase, la demo del clímax ya funciona de punta a punta.
- **Fase B:** síntesis de evidencia (consenso, contradicción, brecha).
- **Fase C:** salidas para publicar por formato, con citas reales.
- **Fase D:** modo de entrada (investigador vs guiado) y pulido de lenguaje a tono de investigador en toda la app.

Orden pensado para que, si el tiempo aprieta antes del congreso, lo que sí esté listo sea justo el clímax (Fase A) y no las piezas de soporte.

### Progreso

- **Fase A, primera parte, HECHA y desplegada a producción (2026-07-12):**
  - Generador de la MDE (tarea `mde` en `generate.js`, etapa nueva en `index.html`). Dimensiones adaptables a cualquier disciplina, celdas enlazadas a fuentes reales por DOI, sin inventar datos. Probado en local y en producción.
  - Reencuadre de componentes del manuscrito (tarea `mapa` da los 4 componentes confirmados).
  - Decidido con Manuel: taxonomía de 4 componentes tal cual, y dimensiones de la MDE siempre generadas por IA según el campo (genérico, no fijo para química).
- **Fase A, segunda parte, HECHA y desplegada a producción (2026-07-12):** motor enriquecido. `search.js` ahora trae `tipo_doc` (tipo de documento desde OpenAlex: Revisión, Artículo, Capítulo, Preprint, etc.) y `fuerza` (alta / media / baja: qué tan directamente el artículo sostiene ESE componente, evaluado por Claude a partir de título y resumen). El frontend muestra estas señales como chips (`signalChips`) en las tarjetas de candidatos y en las referencias aceptadas, junto con revista, citas, año y acceso abierto. Probado en vivo: la evaluación de fuerza discrimina bien (una revisión botánica general salió "baja" para el componente de Métodos, artículos de extracción salieron alta/media). Con esto, **la Fase A está completa**.
- **Fase B, HECHA localmente (2026-07-12):** nueva tarea `sintesis` y etapa trazable con consenso, contradicción y brecha, implicación para el proyecto, confianza y enlaces a las fuentes aceptadas. Declara explícitamente que una brecha observada corresponde al corpus seleccionado.
- **Fase C, primera salida HECHA localmente:** informe de evidencia con foco, síntesis, MDE y referencias. Se puede imprimir o guardar como PDF y descargar como texto.
- **Fase C, segunda salida HECHA, verificada y DESPLEGADA A PRODUCCIÓN (2026-07-18):** el informe de evidencia gana la sección "Borradores para publicar". Nueva tarea `borradores` en `generate.js`: cuatro borradores de párrafo citados, uno por cada componente del trabajo (justificación y brecha, métodos, comparación de resultados, discusión y contraste), más una tabla comparativa de las fuentes (enfoque, hallazgo principal, limitación). Cada afirmación cita las referencias reales por marcadores `[n]`, sin inventar contenido no sostenido por los resúmenes. Se añadió además un selector de estilo de cita (APA / ACS / Vancouver) que reformatea la lista de referencias mediante formateo puro de los metadatos reales, sin llamada extra a la IA. Todo entra en la impresión/PDF y en la descarga de texto. Con esto, los "borradores citados por sección" y la "tabla comparativa" que pedía la Fase C están cubiertos; queda por decidir si se quieren estilos de cita más completos (hoy limitados por los metadatos disponibles: falta volumen/páginas) y si conviene una salida específica por formato de divulgación. Detalle técnico en `docs/current-status.md`.
- **Fase D, entrada inicial HECHA localmente:** la portada separa "Ya tengo una investigación" de "Estoy definiendo mi proyecto". El modo investigador recibe tema, pregunta, abstract y objetivo, y omite los pasos pedagógicos de fricción y formulación.
- **Fase D, pulido de lenguaje, primera pasada HECHA y verificada (2026-07-18):** se auditó el copy de toda la app buscando restos de tono/terminología obsoleta. Se encontró y corrigió un desfase real: el paso "Componentes del trabajo" (renombrado en Fase A) todavía tenía texto interno de la versión anterior ("mapa bibliográfico", "perspectivas") en el botón de generar, el de regenerar, y en el hint del paso de Bibliografía cuando aún no hay componentes generados. También se amplió la lista de formatos de divulgación (compartida por ambos modos) con dos opciones profesionales que faltaban, "Artículo científico" y "Ponencia de congreso", sin quitar las pedagógicas (Mini paper, Infografía, Video educativo) que sirven al modo guiado. Y se ajustó el subtítulo de la pantalla de resumen final para enfocarse en "foco, evidencia y decisiones" en vez de "tu recorrido". El resto de los pasos (Idea en modo investigador, Bibliografía, MDE, Síntesis, Notas, informe de evidencia) ya estaban en tono adecuado desde rondas anteriores; Fricción, Pregunta y Reflexión son exclusivos del modo guiado y mantienen deliberadamente tono pedagógico. Verificado con `node --check` y con pruebas del render real en un contexto `vm` (10/10 chequeos). Pendiente: no hay más restos obsoletos detectados, pero vale una relectura humana rápida antes del congreso.

### Extensiones pedidas por Manuel (2026-07-12), fuera de la secuencia A-D

- **Reenfoque desde los artículos aceptados (HECHO y desplegado):** tarea `reenfoque` en `generate.js` + sección en el paso de Bibliografía. Cuando hay 2 o más referencias aceptadas, EugenIA puede proponer un foco reformulado (tema, problema, pregunta principal, objetivo general, objetivos específicos) que emerge de los artículos que el investigador realmente seleccionó, aunque implique un giro respecto al foco original. El investigador adopta (actualiza idea/pregunta y navega al paso Pregunta) o conserva el original. Nunca sobreescribe en silencio. Probado en vivo: con artículos tangenciales al foco original propuso un giro coherente hacia las propiedades farmacológicas, con la justificación del cambio y las fuentes que lo sostienen.
- **Recall del motor (HECHO):** consulta OpenAlex y Europe PMC directamente, intercala y deduplica resultados, y reintenta con una consulta más amplia cuando obtiene menos de tres artículos. Crossref y PubMed aportan metadatos a OpenAlex, pero no se consultan como endpoints separados. Scopus, Web of Science y Google Scholar no están integrados.
- **Acceso a bases institucionales (meta a mediano plazo, decisión de Manuel):** la restricción es que la app es pública vía QR, así que no se pueden embeber credenciales de una persona para todos. El camino que Manuel quiere seguir NO es un parche de "trae tu propia llave" individual, sino **una colaboración formal con el Sistema de Bibliotecas de la UPR** para que la universidad provea accesos oficiales a las bases que ya paga para estudiantes e investigadores (Scopus, Web of Science, etc.). Eso legitimaría el acceso institucional. Pendiente de gestionar esa colaboración; el diseño técnico (proxy institucional, o llaves provistas por la biblioteca) se define una vez haya acuerdo.

## Principios que no se negocian

- Nunca inventar citas: toda fuente sugerida viene de OpenAlex o Europe PMC y conserva su enlace o DOI real. Vale para la MDE y para las salidas de publicación.
- La curaduría crítica y la decisión final son del investigador. La IA propone y evalúa; el humano acepta, edita y decide. Mismo principio que ya rige el paso 6.
- Sin guiones largos en ningún texto (preferencia de estilo del proyecto).

## Preguntas abiertas antes de codificar Fase A (resueltas, 2026-07-13)

Ambas quedaron confirmadas por Manuel el 2026-07-13, consistentes con lo que ya se había implementado en Fase A. Se dejan aquí como decisiones cerradas para que una sesión futura no las reabra.

1. **Taxonomía de componentes:** se mantiene la actual (Justificación y brecha, Métodos, Comparación de resultados, Discusión y contraste). Solo se ajustaría si en el uso muestra ser insuficiente.
2. **Dimensiones de la MDE:** se generan siempre por IA según el campo del trabajo, no un conjunto fijo pensado para química, para no limitar la herramienta a esa disciplina.

## Extensión estratégica: de herramienta de evidencia a compañero de defendibilidad (dirección aprobada por Manuel, 2026-07-13)

Esta es la dirección que, según Manuel, sostiene el proyecto en el tiempo y lo diferencia de las herramientas de descubrimiento existentes. Queda registrada como norte estratégico; todavía no está construida más allá de sus semillas.

### La diferenciación

Herramientas como Elicit, Consensus o Scite son de descubrimiento y extracción: encuentran papers y sacan datos. Ese terreno se comoditiza rápido. Biblioteca Viva apunta a otra categoría: un compañero de integridad y defendibilidad de la investigación, que mantiene honesta tu pregunta frente a dos espejos que cambian con el tiempo, la literatura que se acumula y tus propios resultados. Es trabajo de juicio, longitudinal, con el humano en el centro, y por eso más difícil de comoditizar. Coincide con el nombre "Biblioteca Viva": algo a lo que se regresa, no un flujo que se corre una vez.

El motor bibliométrico sigue siendo el corazón, pero la funcionalidad se extiende más allá de encontrar fuentes: la app debe ayudarte a detectar posibles huecos teóricos, metodológicos, éticos, de novedad y de reproducibilidad que puedan debilitar el trabajo y dificultar una publicación. Fin último: divulgar un trabajo científico sólido y defendible.

### Qué ya está sembrado, y qué es genuinamente nuevo

- Sembrado: la **síntesis** (consenso, contradicción, brecha) es el embrión de "validez a la luz de la literatura", pero hoy solo mira el corpus y no dispara alarmas de defendibilidad. El **reenfoque** ya revisa la pregunta a la luz de los artículos aceptados, pero es de un solo tiro y solo desde la literatura, nunca desde los datos propios.
- Nuevo, aún no construido:
  1. **Los resultados propios del investigador como insumo de primera clase.** Hoy la app solo ingiere literatura (búsqueda y PDFs propios). Falta un lugar donde el investigador declare qué está encontrando, para examinar la pregunta contra sus datos y no solo contra los de otros.
  2. **Una auditoría de defendibilidad por dimensiones** (teórica, metodológica, ética, de novedad, de reproducibilidad, de alineación pregunta-evidencia), donde cada señal se enmarca como algo que un revisor podría atacar y por qué podría dificultar la publicación.
  3. **El bucle longitudinal:** que la pregunta pueda reexaminarse una y otra vez a medida que crecen el corpus y los resultados, no solo al inicio.

### El principio que no se puede violar en esta extensión

Una auditoría de huecos es justo donde un modelo de lenguaje puede lucirse o perder toda su credibilidad, porque es fácil generar críticas plausibles pero inventadas. La misma disciplina que hoy gobierna las citas debe gobernar la auditoría: cada hueco señalado se ancla a una fuente concreta, a una ausencia declarada en el corpus, o a un elemento específico del diseño o los resultados del investigador, nunca a una intuición del modelo. Las señales éticas se plantean como preguntas a considerar, no como veredictos. Si eso se respeta, es un aporte real; si no, es ruido que desprestigia el resto de la app.

### Estado

Dirección registrada, no construida. Primer paso concreto cuando se decida abordarla: el insumo de "tus propios resultados" y una tarea de auditoría de defendibilidad anclada a evidencia (reutilizando el patrón de `generate.js` y el principio de "la IA propone, el investigador decide"). Ver `lab/roadmap.md`.
