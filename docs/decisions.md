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

## [2026-07-18] — Estilos de cita como formateo puro en el cliente, no generados por IA

**Contexto:** La Fase C pedía salidas orientadas a publicación, entre ellas la lista de referencias en estilos de cita estándar (APA / ACS / Vancouver). La opción fácil habría sido pedirle a la IA que "formatee las citas", pero eso arriesga justo el principio no negociable del proyecto: nunca inventar ni alterar datos de una cita real.

**Decisión:** El selector de estilo de cita se resuelve 100% en el cliente con `formatCitation(r, i, estilo)`, una función pura que reordena y puntúa los metadatos que la fuente ya trae (autores, año, título, revista, DOI), sin ninguna llamada a la IA. Los borradores de párrafo (esos sí generados por IA) usan marcadores `[n]` numéricos entre corchetes en los tres estilos, como localizador hacia la lista numerada de referencias aceptadas, en vez de imitar la cita en-texto de cada estilo. Se documenta explícitamente en la interfaz que los estilos salen aproximados porque faltan metadatos (volumen, páginas) que las fuentes gratuitas no siempre traen.

**Razón:** Formatear metadatos ya existentes es determinista y auditable; delegarlo a la IA introduciría el riesgo de que "complete" un volumen o una página que no tiene, contradiciendo el principio de nunca inventar citas. Mantener el marcador `[n]` uniforme evita además tener que resolver la cita en-texto real de cada estilo (autor-fecha en APA, superíndice en ACS) con metadatos incompletos, y es coherente con cómo la MDE y la síntesis ya referencian las fuentes.

**Impacto:** Patrón a mantener para cualquier salida de publicación futura: lo que sea formateo de datos existentes se hace en código, no con la IA; la IA solo redacta prosa y siempre ancla sus afirmaciones a fuentes reales por `[n]`. Si más adelante se integran bases con metadatos completos (por ejemplo vía la colaboración con Bibliotecas UPR), `formatCitation` puede enriquecerse para dar citas completas sin cambiar esta división de responsabilidades.

## [2026-07-18] — El json_schema de Anthropic no soporta minItems/maxItems mayores a 1

**Contexto:** Al disenar el schema de la tarea `auditoria` (`web/api/generate.js`), se queria forzar "exactamente 6 dimensiones" en el array `cobertura` usando `minItems: 6, maxItems: 6`, como mecanismo estructural para evitar que el modelo omitiera dimensiones sin evidencia en vez de declararlas explicitamente.

**Decision:** Se probo primero con una llamada real minima a la API antes de construir el resto de la tarea sobre ese supuesto (siguiendo el plan de implementacion). La API devolvio `400 invalid_request_error`: "For 'array' type, 'minItems' values other than 0 or 1 are not supported". Se quito `minItems`/`maxItems` del schema y se movio la instruccion de "exactamente 6, una por dimension" al texto del prompt; verificado empiricamente que el modelo la respeta de forma consistente en multiples corridas.

**Razon:** Es una limitacion real y no documentada previamente en el repo del `json_schema` de la API de Anthropic para arrays. Descubrirla temprano, con una prueba aislada antes de construir el resto, evito reescribir el schema completo despues.

**Impacto:** Ningun schema en `generate.js` puede usar `minItems`/`maxItems` mayores a 1 para forzar cardinalidad exacta o un rango; hay que instruirlo en el prompt y, si hace falta una garantia dura, validar el conteo en el cliente despues de recibir la respuesta. Documentado tambien en `docs/current-status.md`.

## [2026-07-18] — Una senal de auditoria puede anclarse legitimamente a un resultado propio Y a una fuente bibliografica a la vez

**Contexto:** El schema de la tarea `auditoria` definio `ancla_tipo` como un enum de un solo valor (`fuente_bibliografica`, `ausencia_en_corpus`, `resultado_propio`, `diseno_propio`), y la primera prueba de contrato asumio que una senal anclada a un resultado propio nunca deberia traer numeros de fuentes bibliograficas en el campo `fuentes`. La prueba fallo: el modelo genero una senal legitima que compara el TPC obtenido en un resultado propio (R1) contra el TPC reportado en una fuente real de la literatura ([1]), citando ambos en `ancla_detalle` y referenciando la fuente en `fuentes`.

**Decision:** No se cambio el schema ni el prompt. Se corrigio la prueba: en vez de exigir que `fuentes` este vacio cuando `ancla_tipo` es `resultado_propio`/`diseno_propio`, se valida que CUALQUIER numero de fuente que aparezca en `fuentes` (sin importar el `ancla_tipo`) este dentro del rango valido de referencias aceptadas. Es exactamente el tipo de senal mas valiosa que la auditoria deberia producir: compara lo que el investigador encontro contra lo que ya reporta la literatura curada.

**Razon:** El hallazgo era comportamiento correcto y bien fundamentado del modelo, no una alucinacion ni un defecto de diseno. Cambiar el schema para prohibirlo habria degradado la calidad de la auditoria para evitar un falso positivo de la prueba, no un problema real.

**Impacto:** Documentado para que una sesion futura no reabra esta pregunta ni la trate como un bug. El chequeo de consistencia real que si importa (y que las pruebas si verifican de forma estricta) es que ninguna senal se ancle a un resultado propio cuando `resultadosPropios` esta vacio: eso si se probo como aserción dura y paso limpio.

## [2026-07-25] — De tres bases candidatas, solo Crossref sobrevivio a la medicion

**Contexto:** Se aprobo ampliar el recall del motor bibliometrico anadiendo Crossref, PubMed y Semantic Scholar como endpoints reales, ademas de OpenAlex y Europe PMC. Antes de escribir codigo se midio empiricamente cada candidata con la consulta real del caso Plectranthus.

**Decision:** Se anadio **solo Crossref**, con los filtros `has-abstract:true` y `type:journal-article` (no son opcionales: sin ellos devuelve registros sin resumen y piezas que no son articulos, como pies de tabla). Se descartaron las otras dos, y tambien DOAJ que se evaluo de paso:
- **PubMed (E-utilities):** devolvio 1 resultado y **0** que no estuvieran ya en Europe PMC, porque Europe PMC ya indexa MEDLINE/PubMed. Costaba 2 viajes HTTP y parseo de XML para cero ganancia medible.
- **Semantic Scholar:** HTTP 429 en 5 intentos espaciados a lo largo de ~20 segundos. Sin llave el cupo es compartido globalmente, asi que no es fiable para una app publica por QR.
- **DOAJ:** 0 resultados en la consulta especifica de Plectranthus (7 en una consulta amplia). Al cubrir solo revistas de acceso abierto, falla justo en las busquedas precisas.

**Razon:** Crossref si aporto: 7 de 8 resultados eran nuevos frente a la linea base, incluyendo un articulo **en espanol** de 2024 que ni OpenAlex ni Europe PMC devolvieron, lo cual es especialmente pertinente para el angulo regional del lab (el hallazgo de Fase III de que ~70% de la produccion se concentra en Indo-Malaya y Brasil, "donde esta el Caribe?"). Anadir fuentes que no aportan solo agrega latencia y modos de fallo.

**Impacto:** El motor consulta 3 bases en paralelo. `interleave` se generalizo a N listas. `por_base` distingue `null` (la base no respondio) de `0` (respondio sin resultados), porque en un registro de busqueda no es lo mismo. La medicion queda anotada en el encabezado de `web/api/search.js` para que una sesion futura no vuelva a proponer PubMed o Semantic Scholar sin datos nuevos.

## [2026-07-25] — Los autores se guardan como lista estructurada, no como cadena que haya que partir

**Contexto:** Al construir los exportadores a BibTeX y RIS hacia falta la lista de autores individuales. La primera version partia el campo `autores` (una cadena) por comas y punto y coma. Una prueba con datos reales la tumbo.

**Decision:** Las tres bases devuelven ahora `autores_lista`, un arreglo con un elemento por autor, construido de los datos estructurados de cada fuente (`authorships[].author.display_name` en OpenAlex, `authorList.author[]` con `lastName`/`firstName` en Europe PMC, `author[].family`/`.given` en Crossref). Los exportadores usan `autoresDeRef(r)`, que prefiere esa lista y solo cae a un heuristico cuando la referencia se escribio a mano.

**Razon:** Partir la cadena es ambiguo y **corrompia datos**. Caso real medido en Crossref: un articulo de un solo autor, `{family:"Abbey", given:"Lord"}`, se muestra como "Abbey, Lord" y al partir por comas se convertia en dos personas inexistentes en el archivo `.bib` o `.ris` exportado. Es exactamente el tipo de error que un gestor de referencias propaga silenciosamente a una bibliografia publicada. El heuristico de respaldo, para referencias manuales, resuelve el caso de una sola coma con ambos lados cortos a favor de un unico autor.

**Impacto:** `formatAuthors` se sustituyo por `listaAutoresOpenAlex` + `autoresParaMostrar` (la cadena de visualizacion se deriva de la lista, no al contrario). Cualquier fuente nueva que se integre debe entregar `autores_lista`, no solo la cadena. Principio general: cuando la fuente da datos estructurados, guardarlos estructurados; reconstruirlos despues por parsing es una via directa a inventar datos.

## [2026-07-25] — Subir el recorte de abstract a 2500, con una afirmacion corregida

**Contexto:** `search.js` guardaba los abstracts recortados a 900 caracteres. Al ampliarlo se justifico el cambio afirmando que la Matriz de Decision produciria criterios mas cuantitativos, porque los articulos de quimica reportan los numeros al final del abstract.

**Decision:** Se subio el limite a 2500, pero **se corrigio la justificacion escrita en el codigo**, porque la prueba no sostuvo la afirmacion causal. Lo que si se midio, de forma determinista, sobre 36 abstracts reales de las tres bases: el limite de 900 truncaba el **81%** de ellos y descartaba en promedio el **43%** del texto; en el **41%** de los truncados habia valores numericos (concentraciones, rendimientos, unidades) que aparecian **solo despues** del caracter 900, asi que no llegaban ni al modelo ni a la pantalla. Lo que **no** se pudo demostrar: una corrida pareada de la tarea `mde` con la misma evidencia recortada a 900 y a 2500 dio la misma cantidad de valores cuantitativos en los criterios (6 y 6).

**Razon:** El beneficio real y verificable es que el dato deja de llegar mutilado a media oracion, lo cual afecta tambien a la ficha de lectura (tarea `notas`) y a la sintesis, que se construyen sobre ese mismo campo. Afirmar una mejora de la MDE que una sola corrida pareada no respalda habria dejado en el codigo una justificacion falsa que una sesion futura tomaria como hecho establecido.

**Impacto:** Efecto colateral que hubo que atender: con abstracts de 2500 caracteres, 15 referencias aceptadas superaban el `MAX_PAYLOAD_CHARS` de 40000 de `generate.js` y habrian recibido un 413 justo el investigador que mas evidencia curo. Se subio a 150000 (~50 referencias, ~37000 tokens de entrada en el peor caso) y se verifico en produccion con un payload de 58033 caracteres que el tope viejo habria rechazado. Leccion de metodo: al ampliar cuanto dato entra al pipeline, revisar los topes de todo el camino, no solo el del punto que se cambio.

## [2026-07-25] Contencion de costo en los endpoints publicos: origen, ritmo y tope de cuerpo

**Contexto.** Manuel pregunto como haria para que, si comparte la app con el mundo, cada usuario pague su propio gasto de IA. Al revisar el backend para responder aparecio un problema mas urgente que el cobro: `/api/generate` y `/api/search` estaban **abiertos**, sin autenticacion, sin verificacion de origen y sin limite de peticiones. Cualquiera con la URL podia llamarlos desde una terminal, sin pasar por la app, y el gasto lo pagaba la clave del proyecto. Los esquemas JSON y los prompts fijos impedian usarlo como un "Claude gratis" generico, pero no impedian gastar dinero ajeno de forma automatizada. Ningun esquema de cobro arregla eso, asi que la contencion iba primero.

**Decision.** Un modulo compartido nuevo, `web/lib/contencion.js`, con tres defensas aplicadas antes de cualquier gasto en los dos endpoints:

1. **Verificacion de origen.** Se rechaza con 403 toda peticion cuyo `Origin` (o `Referer` como respaldo) no este en la lista permitida. La lista incluye el alias oficial, las URLs que Vercel inyecta en tiempo de ejecucion (`VERCEL_URL`, `VERCEL_PROJECT_PRODUCTION_URL`), localhost, y lo que se anada por `ORIGENES_PERMITIDOS`.
2. **Limite de peticiones** por prefijo de red, 60 por minuto y 600 por hora por defecto, configurables por variable de entorno.
3. **Tope de cuerpo.** En `generate.js` se bajo `MAX_PAYLOAD_CHARS` de 150000 a 80000. En `search.js` se **anadio** un tope de 20000 que nunca habia existido.

**Por que el orden y los numeros.**

El tope de `search.js` era el hueco mas grande de los dos y no estaba documentado en ninguna parte: el objeto `contexto` (tema, abstract, problema, pregunta principal) va casi entero al prompt de generacion de consulta, asi que sin tope se podian mandar megabytes de texto propio y hacerlos facturar. El caso real mas cargado ronda los 4000 caracteres, asi que 20000 es holgado.

Los 150000 de `generate.js` los habia puesto esta misma jornada, y en retrospectiva eran holgura muy por encima de lo necesario. Toda esa holgura es texto que controla quien llama al endpoint, o sea el amplificador que abarata montar un abuso. Con 80000 siguen cabiendo unas 28 referencias con abstract completo, casi el doble del caso real mas cargado medido.

**El hallazgo que cambio el diseno del limite de peticiones.** La primera version contaba por IP exacta y **no disparaba nunca en produccion**: 70 peticiones seguidas en 17 segundos, con limite de 60 por minuto, pasaron todas. Bajando el limite a 2 por minuto tampoco disparo. La hipotesis obvia, que en serverless cada invocacion arranca con memoria nueva, resulto **falsa**. Un diagnostico temporal (cabecera `x-diag-contencion`, que quedo en el codigo detras de `DIAG_CONTENCION=1`) mostro lo siguiente en seis peticiones consecutivas desde la misma computadora:

```
#1 arranque=619522 clave=72.50.4.0/24
#2 arranque=619522 clave=72.50.7.0/24
#3 arranque=619522 clave=72.50.7.0/24
...
```

El `arranque` es identico en las seis: **Vercel si reutiliza la instancia caliente y la memoria del modulo si se comparte.** Lo que cambiaba era la IP del cliente: `72.50.7.208`, `.238`, `.129`, `.129`, `.238`, `72.50.4.17`. El proveedor de internet saca el trafico por un pool de direcciones (CGNAT), asi que contar por IP exacta nunca acumula.

Por eso el contador se lleva **por prefijo** (`/24` en IPv4, `/64` en IPv6) y no por IP. Con ese cambio el limite dispara en produccion, verificado, y devuelve `Retry-After`.

**Lo que esto NO logra, dicho explicitamente para que nadie lo lea como resuelto.**

- El pool observado abarca **varios** `/24` (`72.50.4`, `.5`, `.7`), asi que alguien decidido desde una red con CGNAT evade el limite rotando prefijos. No se amplio a `/22` o `/16` porque el falso positivo crece mas rapido que el beneficio: en el congreso, un salon entero comparte prefijo, y un 429 durante una demo cuesta mas que el abuso que se evitaria.
- La cabecera `Origin` la puede falsificar cualquier cliente que no sea un navegador. Esto sube el costo de un abuso casual, no detiene a un atacante.
- Cuando Vercel escala a varias instancias en paralelo, cada una lleva su conteo y el limite efectivo se multiplica.
- **El unico limite duro sigue siendo el tope de gasto mensual en la consola de Anthropic, que a esta fecha sigue sin configurarse.** Esto es defensa en profundidad debajo de ese tope, no un sustituto.

**Verificacion.** 41 chequeos locales, 0 fallos, incluyendo las seis IPs reales del pool como caso de prueba del agrupamiento. Se comprobo con **Chromium real** que un navegador si manda `Origin` (y `Referer`) en un POST al mismo dominio, que era el unico supuesto capaz de romper la app entera al desplegar. Contra produccion real: 403 sin origen, 403 con origen ajeno, 403 desde `example.com`, 413 sobre los topes, 429 al pasar el limite con `Retry-After`, y recorrido en navegador real donde `/api/generate` y `/api/search` devuelven 200 con contenido y DOIs reales, sin errores de JavaScript.

**Aparte, dos correcciones de rastro:** el comentario de `generate.js` recomendaba `claude-opus-4-8` para maxima calidad; quedo desactualizado y se cambio a `claude-opus-5`, que cuesta lo mismo. Y `web/.env.example` documenta ahora las variables nuevas.
