// ============================================================================
// build_presentation.js
// ----------------------------------------------------------------------------
// Presentación (ponencia) sobre el desarrollo de "Biblioteca Viva", la app
// agentic de IA de EugenIA Lab para la investigación científica.
//
// Enfoque metodológico: pensada como documento vivo que se actualiza a lo largo
// del desarrollo, para tener lista una ponencia (y base de una publicación sobre
// desarrollo de apps de IA para la investigación) cuando la app cierre su ciclo.
//
// La presentación es CÓDIGO, igual que el póster (poster/src/build_poster.js).
// Para regenerarla:
//   cd presentation/src
//   npm install pptxgenjs
//   node build_presentation.js
// El .pptx se escribe en presentation/Presentacion_Biblioteca_Viva.pptx
//
// Reglas de pptx aplicadas a mano (el skill "pptx" no está disponible en esta
// máquina): nunca "#" en colores hex, nunca reutilizar el mismo objeto de
// opciones entre llamadas, usar bullet:true en vez de viñetas unicode. Regla de
// estilo del proyecto: nunca usar guiones largos (em-dash) en ningún texto.
//
// Verificación visual: en esta máquina no hay LibreOffice, pero sí PowerPoint.
// Las slides se exportaron a PNG vía automatización COM de PowerPoint y se
// revisaron una a una (sin desbordes ni traslapes). Si se edita este script,
// repetir esa revisión visual antes de darlo por bueno.
// ============================================================================

const pptxgen = require("pptxgenjs");
const path = require("path");

const pres = new pptxgen();
pres.defineLayout({ name: "WIDE", width: 13.333, height: 7.5 });
pres.layout = "WIDE";
pres.author = "EugenIA Lab";
pres.company = "EugenIA Lab, Departamento de Ciencias Físicas, UPR-Río Piedras";
pres.title = "Biblioteca Viva: desarrollo de una herramienta agentic de IA para la investigación científica";

const W = 13.333, H = 7.5;

// ---- Paleta (misma identidad visual del póster y de la app) ----
const FOREST = "1F4620";
const MOSS = "5B8C3E";
const MOSS_LIGHT = "BFD9A8";
const CREAM = "FBFAF6";
const TEXT_DARK = "24301F";
const ACCENT = "8A5A2B";
const ACCENT_LIGHT = "F0E4D3";
const ACCENT_TEXT = "5A4326";
const STEP_BG = "E8F0DF";
const SOFT_BG = "F1F6EC";
const WHITE = "FFFFFF";

const DISPLAY = "Cambria";
const BODY = "Calibri";

const MX = 0.9; // margen izquierdo/derecho

let pageNum = 0;

function newSlide(bg) {
  const s = pres.addSlide();
  s.background = { color: bg || CREAM };
  pageNum++;
  return s;
}

function footer(slide) {
  slide.addText("Biblioteca Viva  ·  EugenIA Lab", {
    x: MX, y: H - 0.5, w: 8, h: 0.3,
    fontFace: BODY, fontSize: 9, color: MOSS,
    align: "left", valign: "middle", margin: 0
  });
  slide.addText(String(pageNum), {
    x: W - 1.4, y: H - 0.5, w: 0.5, h: 0.3,
    fontFace: BODY, fontSize: 9, color: MOSS,
    align: "right", valign: "middle", margin: 0
  });
}

function header(slide, kicker, title) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.26, h: H,
    fill: { color: MOSS }, line: { type: "none" }
  });
  if (kicker) {
    slide.addText(kicker.toUpperCase(), {
      x: MX, y: 0.5, w: W - MX * 2, h: 0.4,
      fontFace: BODY, fontSize: 13, bold: true, color: MOSS,
      align: "left", valign: "middle", margin: 0, charSpacing: 2
    });
  }
  slide.addText(title, {
    x: MX, y: 0.9, w: W - MX * 2, h: 1.05,
    fontFace: DISPLAY, fontSize: 30, bold: true, color: FOREST,
    align: "left", valign: "middle", margin: 0
  });
  slide.addShape(pres.shapes.LINE, {
    x: MX, y: 2.02, w: W - MX * 2, h: 0,
    line: { color: MOSS_LIGHT, width: 1.5 }
  });
}

// Viñetas simples. items = arreglo de strings (o de {text, sub}).
function bullets(slide, items, o) {
  o = o || {};
  const runs = [];
  items.forEach((it, i) => {
    const isLast = i === items.length - 1;
    if (typeof it === "string") {
      runs.push({ text: it, options: { bullet: true, breakLine: true, paraSpaceAfter: isLast ? 0 : 12 } });
    } else {
      runs.push({ text: it.text, options: { bullet: true, breakLine: true, bold: true, color: FOREST, paraSpaceAfter: 3 } });
      runs.push({ text: it.sub, options: { indentLevel: 1, breakLine: true, color: TEXT_DARK, paraSpaceAfter: isLast ? 0 : 12 } });
    }
  });
  slide.addText(runs, {
    x: o.x || MX, y: o.y || 2.4, w: o.w || (W - MX * 2), h: o.h || 4.1,
    fontFace: BODY, fontSize: o.fontSize || 17, color: TEXT_DARK,
    align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.14
  });
}

function paragraph(slide, text, o) {
  o = o || {};
  slide.addText(text, {
    x: o.x || MX, y: o.y || 2.4, w: o.w || (W - MX * 2), h: o.h || 1.0,
    fontFace: BODY, fontSize: o.fontSize || 17, color: o.color || TEXT_DARK,
    italic: o.italic || false, bold: o.bold || false,
    align: o.align || "left", valign: o.valign || "top", margin: 0, lineSpacingMultiple: 1.18
  });
}

function noteBox(slide, label, text, o) {
  o = o || {};
  const y = o.y || 5.9;
  const h = o.h || 1.0;
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: y, w: W - MX * 2, h: h, rectRadius: 0.06,
    fill: { color: o.bg || SOFT_BG }, line: { type: "none" }
  });
  slide.addText([
    { text: label + "   ", options: { bold: true, color: o.labelColor || MOSS } },
    { text: text, options: { color: o.textColor || TEXT_DARK } }
  ], {
    x: MX + 0.25, y: y, w: W - MX * 2 - 0.5, h: h,
    fontFace: BODY, fontSize: o.fontSize || 13.5,
    align: "left", valign: "middle", margin: 0, lineSpacingMultiple: 1.12
  });
}

function pendiente(slide, text, o) {
  o = o || {};
  noteBox(slide, "PENDIENTE", text, {
    y: o.y || 5.9, h: o.h || 1.0,
    bg: ACCENT_LIGHT, labelColor: ACCENT, textColor: ACCENT_TEXT,
    fontSize: o.fontSize || 13.5
  });
}

// Fila de cajas conectadas por flechas (diagrama de flujo simple).
function flowRow(slide, labels, o) {
  o = o || {};
  const y = o.y || 2.7;
  const h = o.h || 1.35;
  const n = labels.length;
  const gap = 0.35;
  const boxW = (W - MX * 2 - gap * (n - 1)) / n;
  labels.forEach((label, i) => {
    const x = MX + i * (boxW + gap);
    const hi = o.highlight === i;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: y, w: boxW, h: h, rectRadius: 0.08,
      fill: { color: hi ? ACCENT : STEP_BG }, line: { type: "none" }
    });
    slide.addText(label, {
      x: x, y: y, w: boxW, h: h,
      fontFace: BODY, fontSize: 13.5, bold: true, color: hi ? WHITE : FOREST,
      align: "center", valign: "middle", margin: 5, lineSpacingMultiple: 1.05
    });
    if (i < n - 1) {
      slide.addText("→", {
        x: x + boxW - 0.02, y: y, w: gap + 0.3, h: h,
        fontFace: "Arial", fontSize: 20, bold: true, color: MOSS,
        align: "center", valign: "middle", margin: 0
      });
    }
  });
}

// Slide de contenido estándar: kicker + título + viñetas + nota/pendiente opcional.
function contentSlide(spec) {
  const s = newSlide();
  header(s, spec.kicker, spec.title);
  let y = 2.4;
  if (spec.intro) {
    const ih = spec.introH || 0.95;
    paragraph(s, spec.intro, { y: y, h: ih, fontSize: spec.introSize || 16.5, italic: spec.introItalic });
    y += ih + 0.2;
  }
  if (spec.bullets) {
    const bh = spec.bulletsH || (spec.note || spec.pend ? 3.2 : 4.1);
    bullets(s, spec.bullets, { y: y, h: bh, fontSize: spec.bulletsSize || 17 });
  }
  if (spec.note) noteBox(s, spec.note.label, spec.note.text, { y: spec.noteY || 5.9, h: spec.noteH || 1.0, bg: spec.note.bg, labelColor: spec.note.labelColor });
  if (spec.pend) pendiente(s, spec.pend, { y: spec.pendY || 5.9, h: spec.pendH || 1.0 });
  footer(s);
  return s;
}

// Slide divisor de sección.
function sectionDivider(num, title, subtitle) {
  const s = newSlide(FOREST);
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: H / 2 - 0.02, w: W, h: 0.04,
    fill: { color: MOSS }, line: { type: "none" }
  });
  s.addText(num, {
    x: MX, y: 2.3, w: 3, h: 1.2,
    fontFace: DISPLAY, fontSize: 40, bold: true, color: MOSS_LIGHT,
    align: "left", valign: "middle", margin: 0
  });
  s.addText(title, {
    x: MX, y: 3.35, w: W - MX * 2, h: 1.3,
    fontFace: DISPLAY, fontSize: 34, bold: true, color: WHITE,
    align: "left", valign: "middle", margin: 0
  });
  if (subtitle) {
    s.addText(subtitle, {
      x: MX, y: 4.75, w: W - MX * 2, h: 0.9,
      fontFace: BODY, fontSize: 16, italic: true, color: MOSS_LIGHT,
      align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.15
    });
  }
  footer(s);
  return s;
}

// ============================================================================
// SLIDE 1: PORTADA
// ============================================================================
(function titleSlide() {
  const s = newSlide(FOREST);
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 0.35, fill: { color: MOSS }, line: { type: "none" } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H - 0.35, w: W, h: 0.35, fill: { color: MOSS }, line: { type: "none" } });

  s.addText("BIBLIOTECA VIVA", {
    x: 1, y: 1.35, w: W - 2, h: 1.0,
    fontFace: DISPLAY, fontSize: 48, bold: true, color: WHITE,
    align: "center", valign: "middle", margin: 0, charSpacing: 1
  });
  s.addText("Desarrollo de una herramienta agentic de IA para la investigación científica", {
    x: 1.5, y: 2.5, w: W - 3, h: 1.0,
    fontFace: DISPLAY, fontSize: 21, italic: true, color: MOSS_LIGHT,
    align: "center", valign: "middle", margin: 0, lineSpacingMultiple: 1.15
  });

  s.addShape(pres.shapes.LINE, { x: W / 2 - 1.5, y: 3.9, w: 3, h: 0, line: { color: MOSS, width: 1.5 } });

  s.addText("Del corpus bibliográfico a la decisión experimental: motor de evidencia, Matriz de Decisión y validación", {
    x: 1.5, y: 4.1, w: W - 3, h: 0.7,
    fontFace: BODY, fontSize: 14.5, color: WHITE,
    align: "center", valign: "middle", margin: 0
  });

  s.addText([
    { text: "Manuel Reyes Guzmán, Ph.D. (investigador principal)  ·  Kamila López Díaz", options: { bold: true, breakLine: true, paraSpaceAfter: 4 } },
    { text: "EugenIA Lab, Departamento de Ciencias Físicas (CIFI 4996), Facultad de Estudios Generales, UPR-Río Piedras", options: {} }
  ], {
    x: 1, y: 5.1, w: W - 2, h: 0.9,
    fontFace: BODY, fontSize: 13.5, color: MOSS_LIGHT,
    align: "center", valign: "middle", margin: 0, lineSpacingMultiple: 1.15
  });

  s.addText("Documento vivo del proceso de desarrollo  ·  versión de trabajo, julio 2026", {
    x: 1, y: 6.2, w: W - 2, h: 0.5,
    fontFace: BODY, fontSize: 11.5, italic: true, color: WHITE,
    align: "center", valign: "middle", margin: 0
  });
})();

// ============================================================================
// SLIDE 2: RESUMEN DE LA PONENCIA
// ============================================================================
contentSlide({
  kicker: "Resumen",
  title: "De qué trata esta ponencia",
  intro: "Biblioteca Viva es una aplicación web agentic que ayuda a un investigador a encontrar la evidencia que mejor sostiene cada parte de su trabajo y a traducirla en criterios de decisión concretos. Esta ponencia documenta su desarrollo, no solo su producto final.",
  introH: 1.25,
  bullets: [
    "Qué es y qué problema resuelve en el flujo real de la investigación.",
    "Cómo está construida: arquitectura, principios de diseño y el uso responsable de IA.",
    "Cómo se desarrolló, de forma iterativa, y cómo se validó en cada paso.",
    "Qué limitaciones iniciales tenía y qué fortalezas se lograron integrar.",
    "Qué lecciones deja para desarrollar herramientas de IA para la investigación científica."
  ],
  bulletsSize: 16.5
});

// ============================================================================
// SECCIÓN 1
// ============================================================================
sectionDivider("01", "El problema y la motivación", "Por qué hace falta una herramienta como esta, y en qué contexto nace.");

// SLIDE 4: El problema
contentSlide({
  kicker: "Motivación",
  title: "Mucha literatura, pocas decisiones",
  intro: "El punto de partida es un problema real de EugenIA Lab, programa de experiencias investigativas subgraduadas (CIFI 4996) cuyo proyecto fundacional estudia Plectranthus amboinicus, el orégano brujo.",
  introH: 1.05,
  bullets: [
    "La literatura científica está dispersa y usa metodologías heterogéneas entre estudios.",
    "Una búsqueda puntual encuentra artículos, pero no los convierte en criterios para el próximo experimento.",
    "El vínculo entre composición, bioactividad y aplicación suele quedar débil en la literatura existente.",
    "Falta un instrumento que sostenga el ciclo completo: de la literatura a la decisión experimental."
  ],
  note: { label: "Idea central", text: "La bibliometría no como fin descriptivo, sino como instrumento de decisión. El nombre EugenIA honra a Eugene Garfield, fundador de la bibliometría moderna." }
});

// ============================================================================
// SECCIÓN 2
// ============================================================================
sectionDivider("02", "Qué es Biblioteca Viva", "El motor de evidencia, la Matriz de Decisión y el principio que gobierna el uso de IA.");

// SLIDE 6: Visión y propósito
contentSlide({
  kicker: "Visión",
  title: "Una herramienta, dos formas de entrar",
  intro: "Sirve igual para empezar un proyecto o para reforzar uno en curso. El investigador escoge según lo que ya tiene, y ambos caminos llegan al mismo motor de evidencia.",
  introH: 1.0,
  bullets: [
    { text: "Modo investigador", sub: "Para quien ya tiene una pregunta, propuesta o abstract. Entra con su material y va directo a la evidencia y las decisiones." },
    { text: "Modo guiado", sub: "Para quien todavía define su investigación. La IA ayuda a construir la fricción conceptual, la pregunta y los objetivos." }
  ],
  bulletsSize: 16.5,
  note: { label: "Acceso", text: "App web que corre en el navegador del teléfono, accesible por un código QR. No requiere instalar nada ni crear cuenta; el progreso se guarda en el propio dispositivo." }
});

// SLIDE 7: El motor de evidencia
contentSlide({
  kicker: "Núcleo",
  title: "El motor de evidencia y la MDE",
  bullets: [
    "Búsqueda de artículos reales por cada componente del trabajo, en bases bibliográficas abiertas.",
    "Cada fuente se anota con su aporte a la investigación y su ajuste al componente (directo, parcial o tangencial).",
    "Matriz de Decisión (MDE): traduce la evidencia aceptada en dimensiones de decisión con criterios concretos.",
    "Síntesis trazable: consensos, contradicciones y brechas del corpus, cada hallazgo ligado a sus fuentes.",
    "Informe de evidencia exportable, que reúne foco, síntesis, MDE y bibliografía."
  ],
  bulletsSize: 16,
  note: { label: "Principio de confianza", text: "La app nunca inventa citas. Todos los artículos provienen siempre de las bases de datos, nunca del modelo; la IA solo comenta fuentes que existen de verdad." }
});

// SLIDE 8: Principio de diseño
contentSlide({
  kicker: "Ética de diseño",
  title: "La IA propone, el investigador decide",
  intro: "La curaduría crítica y las decisiones científicas no se delegan a un atajo automático. La IA genera borradores; el investigador los revisa, edita y confirma. Nada se guarda de forma silenciosa.",
  introH: 1.2,
  bullets: [
    "Reenfoque: la IA propone un foco reformulado desde los artículos aceptados; el investigador lo adopta o conserva el original.",
    "Notas de lectura: sugerencia editable a partir del resumen real, nunca una ficha cerrada guardada sola.",
    "Subir un PDF propio: la extracción prellena los campos, pero la referencia solo se añade cuando el investigador confirma."
  ],
  bulletsSize: 16,
  note: { label: "Por qué importa", text: "Este principio es tanto metodológico como ético: mantiene el juicio científico en manos del investigador y hace auditable cada paso de la evidencia a la decisión." }
});

// ============================================================================
// SECCIÓN 3
// ============================================================================
sectionDivider("03", "Arquitectura técnica", "Cómo está construida, y por qué esas decisiones sostienen el uso responsable de IA.");

// SLIDE 10: Arquitectura (diagrama de flujo)
(function archSlide() {
  const s = newSlide();
  header(s, "Arquitectura", "Un frontend liviano y un backend seguro");
  paragraph(s, "La aplicación separa lo que ve el usuario de la clave de IA, que nunca llega al navegador. El backend actúa de proxy seguro y de motor de búsqueda.", { y: 2.35, h: 0.85, fontSize: 16 });
  flowRow(s, [
    "Navegador\n(HTML + JS, sin build)",
    "Funciones serverless\n/api/generate, /api/search",
    "Claude API\n(proxy seguro de la clave)",
    "Bases bibliográficas\nOpenAlex, Europe PMC"
  ], { y: 3.45, h: 1.5, highlight: 1 });
  bullets(s, [
    "Frontend vanilla JS de una sola página, con persistencia local; sin paso de compilación.",
    "Backend en Vercel: la clave de IA vive solo en el servidor, como variable de entorno.",
    "Salidas estructuradas (JSON por esquema) que garantizan respuestas válidas sin limpiar texto a mano."
  ], { y: 5.2, h: 1.6, fontSize: 15 });
  footer(s);
})();

// SLIDE 11: Tareas del agente
contentSlide({
  kicker: "El agente por dentro",
  title: "Tareas especializadas, no un chat abierto",
  intro: "El navegador no puede pedir cualquier cosa a la IA: solo puede invocar tareas definidas, con datos estructurados. Así la clave no queda expuesta como un chat libre para cualquiera que escanee el QR.",
  introH: 1.2,
  bullets: [
    "Formulación: fricción conceptual, pregunta y objetivos, componentes del trabajo.",
    "Evidencia: búsqueda anotada, Matriz de Decisión, síntesis, reenfoque.",
    "Lectura y salida: notas de lectura, extracción de referencia desde PDF, estructura de divulgación.",
    "Cada tarea entrega datos con un esquema fijo, con topes de tamaño y de costo por llamada."
  ],
  bulletsSize: 15.5,
  note: { label: "Modelo", text: "Por defecto Claude Sonnet, configurable por variable de entorno. Balance de calidad, costo y latencia para una app pública en el teléfono." }
});

// ============================================================================
// SECCIÓN 4
// ============================================================================
sectionDivider("04", "El proceso de desarrollo", "Un producto que no salió de una sola idea, sino de varias iteraciones sobre evidencia real de uso.");

// SLIDE 13: Iteraciones del concepto
contentSlide({
  kicker: "Iteración",
  title: "Cómo evolucionó el concepto",
  bullets: [
    "El póster pasó de mostrar solo resultados fitoquímicos a organizarse alrededor de un framework, y finalmente alrededor de EugenIA Lab y la MDE como protagonista.",
    "La app nació como artefacto de Claude.ai y luego se migró a hosting propio en Vercel, con backend seguro.",
    "El enfoque giró de pedagógico (ocho etapas guiadas) a herramienta de investigador, sin perder el recorrido guiado como opción.",
    "Cada giro respondió a algo observado usando la app, no a una decisión de escritorio."
  ],
  bulletsSize: 16,
  note: { label: "Lectura del proceso", text: "El carácter iterativo es parte del resultado: la herramienta mejoró escuchando su propio uso, y ese registro es material valioso para una publicación sobre el método." }
});

// SLIDE 14: Fases de construcción
contentSlide({
  kicker: "Hoja de ruta",
  title: "Fases de construcción",
  bullets: [
    { text: "Fase A, completa", sub: "Motor de búsqueda enriquecido con señales de calidad y ajuste, y la Matriz de Decisión como función estrella." },
    { text: "Fase B, completa", sub: "Síntesis trazable de consenso, contradicción y brecha, e informe de evidencia exportable." },
    { text: "Fase C, en curso", sub: "Salidas orientadas a publicación: tabla comparativa y borradores citados de justificación, métodos y discusión." },
    { text: "Fase D, pendiente", sub: "Pulido de lenguaje y consistencia en toda la app." }
  ],
  bulletsSize: 14.5,
  pend: "Actualizar el estado de las fases C y D a medida que avancen; hoy la versión desplegada llega hasta el informe de evidencia inicial."
});

// ============================================================================
// SECCIÓN 5
// ============================================================================
sectionDivider("05", "Validación", "No basta con que el código se vea bien: hay que ejercitar el flujo real y observar el resultado.");

// SLIDE 16: Estrategia de validación
contentSlide({
  kicker: "Cómo se valida",
  title: "Verificación en varios niveles",
  bullets: [
    "Sintaxis y contratos: revisión de cada función serverless y del JavaScript de la app antes de desplegar.",
    "Flujo real en navegador: recorrido completo del modo investigador con un navegador automatizado, con llamadas reales al backend.",
    "Endpoints: pruebas directas de las funciones, incluyendo sus errores esperados.",
    "Despliegue por etapas: primero a un entorno de vista previa, se valida, y solo entonces se promueve a producción."
  ],
  bulletsSize: 15.5,
  note: { label: "Dato de curaduría", text: "En el corpus del caso Plectranthus, la curaduría automatizada coincidió en 91.3% con la extracción manual de variables. Los errores se concentraron en conversión de unidades y en rangos leídos como valores puntuales." }
});

// SLIDE 17: Hallazgos de la validación
contentSlide({
  kicker: "Qué encontró la validación",
  title: "La validación que sí atrapa cosas",
  bullets: [
    "Un recorrido real en producción reveló que un paso podía truncar su respuesta y mostrar texto incompleto; se corrigió con un tope de tamaño adecuado y un control explícito, y se volvió a verificar.",
    "La síntesis demostró ser honesta sobre lo que el corpus no resuelve, en vez de sonar segura sin evidencia.",
    "La extracción desde PDF se probó con un artículo con texto real y con un PDF sin texto: el segundo se detiene limpio, sin gastar una llamada a la IA."
  ],
  bulletsSize: 15.5,
  pend: "Falta la validación más importante: una prueba en frío con una estudiante usando la app sola, sin guía, para ver qué logra y dónde se pierde. Incluir aquí esos resultados cuando existan."
});

// ============================================================================
// SECCIÓN 6
// ============================================================================
sectionDivider("06", "Limitaciones y fortalezas", "Lo que no funcionaba al inicio, cómo se abordó, y lo que finalmente distingue a la herramienta.");

// SLIDE 19: Limitaciones iniciales (tabla)
(function limitSlide() {
  const s = newSlide();
  header(s, "Limitaciones iniciales", "De la limitación a la respuesta");
  const rows = [
    [
      { text: "Limitación inicial", options: { bold: true, color: WHITE, fill: { color: MOSS }, valign: "middle" } },
      { text: "Cómo se abordó", options: { bold: true, color: WHITE, fill: { color: MOSS }, valign: "middle" } }
    ],
    ["Bases pagadas (Scopus, Web of Science) no integradas", "Se prioriza cobertura abierta; y se gestiona colaboración con el Sistema de Bibliotecas UPR para acceso institucional"],
    ["Artículos de acceso cerrado quedaban invisibles en la práctica", "Señal explícita de acceso cerrado, con recomendación de conseguir el artículo manualmente"],
    ["Un PDF propio entraba mudo al análisis, sin resumen", "Subir el PDF y extraer título, autores, año y resumen para que participe igual que una fuente encontrada"],
    ["Respuestas de IA que podían truncarse", "Topes de tamaño por tarea y un control que falla limpio en vez de mostrar texto incompleto"],
    ["Sin validación con un usuario real todavía", "Prueba en frío con una estudiante, como validación pendiente y prioritaria"]
  ];
  s.addTable(rows, {
    x: MX, y: 2.35, w: W - MX * 2, h: 4.0,
    colW: [(W - MX * 2) * 0.42, (W - MX * 2) * 0.58],
    fontFace: BODY, fontSize: 13, color: TEXT_DARK,
    valign: "middle",
    border: { pt: 0.75, color: "D8E3D1" },
    fill: { color: "FFFFFF" },
    align: "left", autoPage: false
  });
  footer(s);
})();

// SLIDE 20: Fortalezas logradas
contentSlide({
  kicker: "Fortalezas",
  title: "Lo que finalmente distingue a la herramienta",
  bullets: [
    "Anclaje en evidencia real: nunca inventa citas, una falla común de otras herramientas de IA.",
    "Honestidad sobre las brechas: distingue lo que el corpus no resuelve de lo que no existe en la literatura.",
    "Trazabilidad: cada criterio y cada hallazgo enlazan a las fuentes reales que los sostienen.",
    "Juicio humano en el centro: la IA propone, el investigador decide y confirma.",
    "Accesible: corre en el teléfono, por un QR, sin instalar nada."
  ],
  bulletsSize: 16,
  note: { label: "Síntesis", text: "El núcleo de valor no es el QR ni la organización de pasos, sino el paso de literatura real a comprensión comparativa y decisiones científicas utilizables." }
});

// ============================================================================
// SECCIÓN 7
// ============================================================================
sectionDivider("07", "Hacia una publicación", "La diferenciación que sostiene el proyecto, el trabajo futuro y lo que deja como aporte generalizable.");

// SLIDE: Posicionamiento / diferenciación
contentSlide({
  kicker: "Diferenciación",
  title: "No es un buscador de papers",
  intro: "Las herramientas de descubrimiento (Elicit y similares) ayudan a encontrar y extraer literatura. Biblioteca Viva apunta a algo distinto y más duradero: mantener honesta tu pregunta de investigación a lo largo del tiempo.",
  introH: 1.0,
  bullets: [
    "Reexaminar la validez de la pregunta a medida que se acumula la literatura y a medida que llegan tus propios resultados.",
    "Más allá de encontrar fuentes: señalar posibles huecos teóricos, metodológicos y éticos que dificulten publicar. Fin último, un trabajo sólido y defendible.",
    "Cada señal anclada a evidencia real o a una ausencia declarada, nunca inventada; lo ético como preguntas a considerar, no veredictos."
  ],
  bulletsSize: 15.5,
  bulletsH: 2.1,
  pend: "El insumo de \"tus propios resultados\" y la auditoría de defendibilidad por dimensiones son la dirección en construcción; hoy existen sus semillas en la síntesis y el reenfoque."
});

// SLIDE 22: Trabajo futuro
contentSlide({
  kicker: "Qué sigue",
  title: "Trabajo futuro",
  bullets: [
    "Extracción estructurada de variables experimentales cuantitativas (solvente, método, rendimiento), la meta central del semestre.",
    "Colaboración institucional con el Sistema de Bibliotecas UPR para acceso legítimo a bases pagadas.",
    "Salidas de publicación más completas: tabla comparativa y borradores citados por sección, en estilos de cita estándar.",
    "Escalar la herramienta a otras disciplinas más allá del caso de química."
  ],
  bulletsSize: 16,
  pend: "Definir la sede o revista de la publicación metodológica sobre desarrollo de apps de IA para la investigación, y ajustar el enfoque de esta ponencia a esa audiencia."
});

// SLIDE 23: Lecciones
contentSlide({
  kicker: "Aporte generalizable",
  title: "Lecciones para apps de IA en investigación",
  intro: "Más allá del caso, el proceso deja principios que podrían guiar otras herramientas de IA para la investigación científica.",
  introH: 0.95,
  bullets: [
    "Anclaje obligatorio: la IA comenta evidencia real, no la genera; esto se diseña, no se asume.",
    "Humano en el centro: la herramienta propone borradores auditables, el investigador decide.",
    "Validar con uso real: la prueba decisiva no es que el código pase, sino que a alguien le sirva sin guía.",
    "Documentar el proceso mientras ocurre: el registro del desarrollo es en sí mismo un resultado publicable."
  ],
  bulletsSize: 16
});

// ============================================================================
// SLIDE 24: CIERRE
// ============================================================================
(function closingSlide() {
  const s = newSlide(FOREST);
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 0.35, fill: { color: MOSS }, line: { type: "none" } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H - 0.35, w: W, h: 0.35, fill: { color: MOSS }, line: { type: "none" } });
  s.addText("Biblioteca Viva", {
    x: 1, y: 2.0, w: W - 2, h: 0.9,
    fontFace: DISPLAY, fontSize: 38, bold: true, color: WHITE,
    align: "center", valign: "middle", margin: 0
  });
  s.addText("De la literatura real a decisiones científicas trazables, con la IA como asistente y el investigador como autor.", {
    x: 1.5, y: 3.0, w: W - 3, h: 1.0,
    fontFace: BODY, fontSize: 16, italic: true, color: MOSS_LIGHT,
    align: "center", valign: "middle", margin: 0, lineSpacingMultiple: 1.15
  });
  s.addShape(pres.shapes.LINE, { x: W / 2 - 1.5, y: 4.2, w: 3, h: 0, line: { color: MOSS, width: 1.5 } });
  s.addText([
    { text: "EugenIA Lab  ·  CIFI 4996  ·  Departamento de Ciencias Físicas", options: { breakLine: true, bold: true, paraSpaceAfter: 4 } },
    { text: "Facultad de Estudios Generales, Universidad de Puerto Rico, Recinto de Río Piedras", options: { breakLine: true, paraSpaceAfter: 4 } },
    { text: "Agradecimientos: UPR-Río Piedras y Sección de Puerto Rico de la American Chemical Society (ACS)", options: {} }
  ], {
    x: 1, y: 4.5, w: W - 2, h: 1.5,
    fontFace: BODY, fontSize: 13.5, color: MOSS_LIGHT,
    align: "center", valign: "middle", margin: 0, lineSpacingMultiple: 1.2
  });
})();

// ============================================================================
const outPath = path.join(__dirname, "..", "Presentacion_Biblioteca_Viva.pptx");
pres.writeFile({ fileName: outPath }).then(() => {
  console.log("Presentacion generada: " + outPath);
  console.log("Slides totales: " + pageNum);
}).catch((e) => {
  console.error("Error generando la presentacion:", e);
  process.exit(1);
});
