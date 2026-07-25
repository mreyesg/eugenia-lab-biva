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

## [2026-07-12]: Aprobar la ruta B+ para la demostración del congreso
**Contexto:** La evaluación del producto encontró que la MDE y el motor de fuentes ya aportaban valor real, pero permanecían dentro de un recorrido pedagógico largo y no producían todavía un artefacto final reutilizable.
**Decisión:** Manuel aprobó continuar con entrada rápida para investigadores, síntesis trazable de consenso/contradicción/brecha e informe de evidencia exportable. El recorrido guiado se conserva como opción. La pertinencia de una fuente para un componente se separa conceptualmente de su calidad metodológica.
**Razón:** El valor que debe brillar en el congreso es el paso de literatura real a comprensión comparativa, decisiones científicas y material utilizable, no el QR ni la organización de pasos.
**Impacto:** Se implementaron localmente la tarea y etapa `sintesis`, el modo investigador y un informe imprimible/descargable. Los chips antes llamados "Evidencia fuerte/media" ahora dicen "Ajuste directo/parcial" para evitar una interpretación metodológica incorrecta.

## [2026-07-13] — Validar primero con una prueba en frío de Kamila, y fortalecer el motor de evidencia antes de dársela

**Contexto:** Con B+ ya en producción, Manuel pidió una evaluación honesta de si la app aporta valor real o es "otra app de IA sin sustancia". La respuesta: el núcleo (nunca inventar citas, ser honesto sobre brechas de evidencia) es un aporte genuino y verificado en vivo hoy, pero la app nunca se ha probado con un usuario real que no sea el propio Manuel. Antes de esa prueba, Manuel identificó dos limitaciones reales del motor de evidencia: (1) los artículos de acceso cerrado (Scopus/WoS no están integrados) quedaban invisibles en la práctica aunque la app ya tenía sus datos; (2) un investigador que ya trae artículos propios (por ejemplo de una base pagada a la que tiene acceso institucional) no podía incorporarlos al análisis con el mismo peso que los encontrados por búsqueda, porque el formulario manual no capturaba resumen.

**Decisión:** (1) Kamila usará la app sola, sin guía, como la prueba de validación real ("¿le sirve a alguien que no sea Manuel?"). (2) Antes de esa prueba, se construyeron dos mejoras: una señal explícita de "Acceso cerrado" con recomendación de búsqueda manual (Sistema de Bibliotecas UPR), y la posibilidad de subir un PDF propio para que EugenIA extraiga título/autores/año/resumen y esa referencia participe en la MDE y la Síntesis igual que una encontrada por búsqueda. Ambas implementadas, probadas de punta a punta y desplegadas a producción el mismo día. Detalle técnico en `docs/current-status.md`.

**Razón:** Diferentes investigadores ya suelen tener varios artículos propios que quieren usar en su investigación; tratarlos como ciudadanos de segunda categoría del análisis (solo título + una línea de justificación) desperdicia evidencia que el investigador ya validó por su cuenta. La extracción de PDF además es un paso concreto hacia el objetivo formal del semestre de Kamila: integrar la extracción estructurada de literatura directamente al pipeline de EugenIA. Se limitó explícitamente el alcance a metadatos bibliográficos (no a variables experimentales cuantitativas como TPC o % de solvente), que es una fase posterior y más grande del plan de trabajo.

**Impacto:** `generate.js` gana la tarea `extraerReferencia` (9 tareas en total). El paso de Bibliografía gana el input de PDF y el campo de resumen en el formulario manual. Sigue pendiente, sin cambios: la extracción cuantitativa de variables experimentales prevista para octubre-noviembre en el plan de Kamila, y la gestión con Bibliotecas UPR para acceso institucional real a bases pagadas (ver entrada 2026-07-12 arriba).

## [2026-07-13] — Documentar el desarrollo de la app con una ponencia viva, base de una posible publicación

**Contexto:** Manuel propuso ir creando, en paralelo al desarrollo, una presentación sobre la propia app: su desarrollo, validación, usos, alcance, limitaciones iniciales y fortalezas finalmente integradas. La idea es que quede documentada a lo largo del proceso, no reconstruida al final, para tener lista una ponencia cuando la app cierre su ciclo, y como posible base de una publicación sobre desarrollo de apps de IA para la investigación científica.

**Decisión:** Se creó `presentation/`, con el mismo patrón que `poster/`: la presentación es código, un script de `pptxgenjs` (`presentation/src/build_presentation.js`) que genera `presentation/Presentacion_Biblioteca_Viva.pptx` (24 slides, 16:9, misma identidad visual verde bosque). Enfoque metodológico (desarrollo de IA para investigación), no el caso químico ni el pedagógico, para que sirva de base a la publicación. Es un documento vivo: los slides con contenido futuro que aún no existe llevan un marcador visible PENDIENTE (resultados de la prueba en frío con Kamila, estado de las fases C y D, sede de la publicación). Detalle de mantenimiento en `presentation/README.md`.

**Razón:** Documentar mientras ocurre es más fiel que reconstruir al cierre, y el registro del proceso iterativo es en sí mismo material publicable. Mantenerla como código (y no como un `.pptx` editado a mano) la hace versionable y reproducible, coherente con cómo ya se maneja el póster.

**Impacto:** Nuevo artefacto en el repo, a mantener a lo largo del desarrollo revisando los marcadores PENDIENTE en cada hito. Verificación visual hecha exportando las slides a PNG con automatización COM de PowerPoint (en esta máquina no hay LibreOffice); repetir esa revisión al editar el script. Regla de estilo del proyecto (sin guiones largos) y reglas de pptx aplicadas.

## [2026-07-13] — Confirmar la taxonomía de componentes y la generación por IA de las dimensiones de la MDE

**Contexto:** Eran las dos preguntas abiertas que la Fase A había dejado registradas en `docs/vision-app.md`. La implementación ya había asumido una respuesta provisional; faltaba que Manuel la confirmara para cerrarlas.

**Decisión:** (1) Mantener la taxonomía actual de 4 componentes del trabajo (Justificación y brecha, Métodos, Comparación de resultados, Discusión y contraste), y solo ajustarla si en el uso muestra ser insuficiente. (2) Las dimensiones de la Matriz de Decisión se generan siempre por IA según el campo del trabajo, no con un conjunto fijo pensado para química.

**Razón:** La taxonomía actual ya funcionó bien en las pruebas y no hay evidencia de que falte algo; cambiarla sin necesidad solo agregaría complejidad. Generar las dimensiones de la MDE por IA según el campo es justamente lo que hace a la herramienta útil más allá de la química: un conjunto fijo la ataría a una sola disciplina y contradiría la meta de que sirva a cualquier investigación.

**Impacto:** Cierra las dos preguntas abiertas de Fase A (ver `docs/vision-app.md`, sección marcada ahora como resuelta). No implica cambio de código: confirma lo ya implementado y evita que una sesión futura reabra la discusión.

## [2026-07-24] — Cerrar la ponencia para imprenta sin la prueba en frío de Kamila

**Contexto:** La ponencia (`presentation/`) llevaba desde el 2026-07-13 marcada como documento vivo con cuatro PENDIENTE activos. El más importante, la prueba en frío con Kamila usando la app sola (decidida el 2026-07-13, ver entrada de esa fecha), nunca llegó a completarse, y Manuel ya no tiene margen de tiempo antes de tener que imprimir la presentación para el congreso.

**Decisión:** Cerrar esta ronda de la ponencia sin esperar más. Se ataron los cabos que sí tenían información real disponible: el estado de Fases C y D (Fase C ya en producción desde el 2026-07-18, Fase D con primera pasada verificada pero sin desplegar) y el avance del "compañero de defendibilidad" (paso "Tus resultados" y auditoría de defendibilidad, construidos y verificados el 2026-07-18, pendientes de aprobación visual y despliegue). Los dos cabos que no se podían atar con información real (la prueba en frío de Kamila y la sede o revista de la publicación metodológica) se reformularon en el script de honestos "en construcción" a explícitamente diferidos al próximo ciclo, en vez de dejarlos como una promesa abierta sobre resultados que no existen.

**Razón:** Una ponencia que va a imprenta no puede seguir prometiendo un resultado que no llegó a tiempo; es más defendible decir con claridad que la validación con Kamila no se completó en este ciclo, que dejar un marcador PENDIENTE ambiguo que sugiere que el resultado podría aparecer antes de la impresión. Los otros dos pendientes sí tenían actualizaciones reales disponibles en `docs/current-status.md` y era información concreta que no había motivo para no incorporar antes de cerrar.

**Impacto:** `presentation/src/build_presentation.js` actualizado (slides 14, 17, 19, 22 y 23) y `presentation/README.md` con la lista de marcadores activos al día. `.pptx` regenerado (25 slides) y verificado visualmente vía PowerPoint COM, sin desbordes. La prueba en frío con Kamila y la sede de publicación quedan en `lab/roadmap.md` como trabajo futuro, fuera del alcance de esta ponencia impresa.

## [2026-07-24] — Segunda versión de tema visual para la ponencia: química en vez de botánica

**Contexto:** Manuel notó, ya con la ponencia lista para imprenta, que el tema visual (verde bosque, musgo, tierra, heredado del póster y la app) se lee como botánico, y pidió una segunda versión con un tema algo más químico para esta pieza específica.

**Decisión:** Se creó `presentation/src/build_presentation_quimico.js`, copia exacta de `build_presentation.js` en contenido y layout, con una paleta distinta: azul Prusia (`13293D`, un pigmento de origen químico) como primario, teal de laboratorio (`2E86AB`) como secundario, crema fría (`F4F8FA`) como fondo, y ámbar de mechero Bunsen (`C1560C`) como acento de nota/pendiente, en vez de verde bosque/musgo/crema/tierra. Genera `presentation/Presentacion_Biblioteca_Viva_Quimico.pptx` (25 slides) como archivo independiente, no reemplaza la versión botánica. No se tocó la identidad visual del póster ni de la app, que siguen siendo verde bosque, musgo, crema y tierra, ver `CLAUDE.md`.

**Razón:** El cambio pedido era de tema visual, no de contenido ni de estructura, así que duplicar el bloque de paleta y dejar toda la lógica de layout intacta era el camino más simple y de menor riesgo antes de imprimir, en vez de introducir un parámetro de tema en un único script bajo presión de tiempo.

**Impacto:** Dos scripts independientes que hoy solo difieren en el bloque "Paleta" (ver nota en `presentation/README.md`): cualquier cambio de contenido futuro hay que aplicarlo en los dos, o refactorizar a un parámetro de tema si el mantenimiento paralelo se vuelve costoso. Verificado visualmente vía PowerPoint COM (portada, divisor de sección, slide con PENDIENTE, tabla de limitaciones, diagrama de arquitectura, cierre), sin desbordes ni problemas de contraste.

## [2026-07-25] — Optimizar la app para investigación real: interoperabilidad, búsqueda auditable y una tercera base

**Contexto:** Manuel pidió optimizar el proyecto para que fuera mucho más útil para la investigación científica. La revisión del código (no de los documentos de estado) encontró que el techo no estaba en la calidad del análisis sino en tres fricciones de flujo de trabajo real: el corpus curado no podía salir de la app hacia un gestor de referencias, el proyecto vivía solo en `localStorage` y se perdía al cambiar de dispositivo, y la búsqueda era una caja negra que el investigador no podía ver, editar ni repetir. Se acordó hacer lo aditivo y de bajo riesgo antes del congreso, y dejar el trabajo profundo para después.

**Decisión:** Cuatro cosas, todas verificadas y desplegadas: (1) exportación del corpus a BibTeX, RIS y CSV; (2) guardar y cargar el proyecto completo como archivo `.json`; (3) búsqueda auditable, con la consulta visible y editable, filtros por año y tipo, resultados por base, y un registro persistente de cada búsqueda que alimenta un párrafo de métodos en el informe; (4) Crossref como tercera base de datos, tope de resultados de 8 a 12 y abstracts de 900 a 2500 caracteres. Se desplegó además lo que llevaba una semana construido y verificado sin subir (pulido de Fase D, "Tus resultados" y auditoría de defendibilidad).

**Razón:** Estas tres fricciones no se ven leyendo la lista de funciones de la app, pero son las que deciden si un investigador la usa una vez o la incorpora a su trabajo. Y la búsqueda auditable es coherente con la dirección estratégica del proyecto: una app que se presenta como "compañero de defendibilidad" no puede pedirle al investigador que confíe en una consulta que no puede ver ni repetir. El párrafo de métodos convierte ese registro en algo directamente utilizable en un manuscrito.

**Impacto:** De las tres bases de datos aprobadas solo se añadió una, porque la medición no justificó las otras dos: PubMed no aportó ningún resultado que Europe PMC no tuviera ya, y Semantic Scholar devuelve 429 sin llave. Crossref sí aportó, incluyendo literatura en español que las otras dos no devolvieron, lo cual conecta con el hallazgo de Fase III sobre la ausencia del Caribe en la producción científica del tema. Queda pendiente y planificado el trabajo profundo: la extracción estructurada de variables experimentales cuantitativas, que es la meta formal del semestre de Kamila y lo que convertiría la MDE en un instrumento construido sobre una tabla de números en vez de sobre abstracts parafraseados. Ver `lab/roadmap.md` y `docs/decisions.md` para el detalle técnico y las mediciones.

## [2026-07-25] Costo por modelo: discutido con números, sin decidir

**Contexto:** Manuel planteó, explícitamente como discusión y no como pedido de implementación, si se podría usar un modelo más avanzado solo en algunas secciones de la app sin encarecerla. Hoy `web/api/generate.js` y `web/api/search.js` usan una sola variable global: `process.env.CLAUDE_MODEL || "claude-sonnet-5"`.

**Decisión:** Ninguna todavía. Se dejó el análisis hecho para no repetirlo, y una recomendación de orden. No se tocó código.

**Razón (lo que arrojaron los números):** Con precios vigentes (Sonnet 5 en promoción a 2 y 10 dólares por millón hasta el 31 de agosto de 2026; Opus 5 a 5 y 25; Haiku 4.5 a 1 y 5), una sesión completa de un investigador cuesta hoy alrededor de 0.29 dólares. Subiendo a Opus 5 las cuatro tareas de más juicio y menos frecuencia (`auditoria`, `mde`, `sintesis`, `borradores`) sube a alrededor de 0.50. La forma del problema favorece el cambio: esas cuatro corren una vez por proyecto, mientras que la única tarea de alto volumen, la anotación de 12 artículos en cada búsqueda dentro de `search.js`, no necesita más capacidad y es donde subir de modelo saldría más caro que las otras cuatro juntas.

**Impacto y notas para quien lo implemente:**

1. **Se puede probar hoy sin tocar código:** poner `CLAUDE_MODEL=claude-opus-5` en Vercel cambia toda la app. Ese es el primer experimento; si la diferencia no se percibe en la MDE y en la auditoría, la discusión se cierra ahí.
2. **Por tarea es un cambio de tres líneas.** Los constructores de `generate.js` ya devuelven `{system, user, schemaKey, unwrap, maxTokens}`. Ese `maxTokens` opcional por tarea es exactamente el patrón que habría que repetir con `model`.
3. **Trampa real:** el código pone `thinking: { type: "disabled" }`. En Opus 5 el razonamiento viene encendido por defecto y desactivarlo tiene rugosidades documentadas; lo recomendado es bajar el esfuerzo (`output_config: {effort: "medium"}`) en vez de desactivarlo. Pero entonces los tokens de razonamiento cuentan contra `max_tokens`, y los topes actuales (1600 a 5000) están afinados para Sonnet sin thinking. Hay que subirlos, o el JSON se trunca y el guard de `stop_reason === "max_tokens"` devuelve un 502 al usuario.
4. **Palanca más barata que cambiar de modelo:** caché de prompt. La MDE, la síntesis, los borradores y la auditoría mandan la misma lista de referencias, y las lecturas de caché cuestan cerca del 10%. El pero honesto: el caché es coincidencia de prefijo y el prompt de sistema difiere por tarea, así que no habría acierto entre tareas distintas sin reestructurar los prompts para que la parte compartida vaya primero. Donde sí funcionaría sin refactor es en los botones de "Regenerar".
5. **Se puede medir en vez de opinar,** con métricas que ya existen en el proyecto: para la MDE, la cantidad de valores cuantitativos distintos en los criterios adoptados (`docs/decisions.md`, 2026-07-25); para la auditoría, la aserción dura de anclaje.
6. **Lo importante del asunto no es el modelo:** la elección de modelo es una decisión de unos veinte centavos por sesión, mientras que el QR es público y **sigue sin límite de gasto configurado** en la consola de Anthropic. Ese pendiente, que arrastra desde hace semanas, protege de un escenario sin techo. Es la acción de mayor valor de las dos.

Nota menor: el comentario en `web/api/generate.js` sugiere `claude-opus-4-8` para máxima calidad. Está desactualizado; Opus 5 cuesta lo mismo y es mejor.
