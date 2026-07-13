const pptxgen = require("pptxgenjs");

let pres = new pptxgen();

// Larger canvas to hold four thematic columns at readable poster scale
pres.defineLayout({ name: "POSTER", width: 44, height: 60 });
pres.layout = "POSTER";
pres.author = "Kamila López Díaz";
pres.title = "BIVA: Biblioteca Viva de Investigación";

const W = 44, H = 60;

const FOREST = "1F4620";
const MOSS = "5B8C3E";
const MOSS_LIGHT = "BFD9A8";
const CREAM = "FBFAF6";
const TEXT_DARK = "24301F";
const CARD_BG = "FFFFFF";
const ACCENT = "8A5A2B";
const STEP_BG = "E8F0DF";
const PHASE_BG = "2E5C33";

let slide = pres.addSlide();
slide.background = { color: CREAM };

// ---------- HEADER ----------
const headerH = 8.6;
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: W, h: headerH,
  fill: { color: FOREST }, line: { type: "none" }
});

slide.addText("BIVA: Biblioteca Viva de Investigación", {
  x: 1, y: 0.35, w: W - 2, h: 1.5,
  fontFace: "Cambria", fontSize: 50, bold: true, color: "FFFFFF",
  align: "center", valign: "middle", margin: 0
});

slide.addText("De un agente bibliométrico a una app de investigación: prototipado con el caso de Plectranthus amboinicus", {
  x: 1.5, y: 1.9, w: W - 3, h: 1.0,
  fontFace: "Cambria", fontSize: 23, italic: true, color: MOSS_LIGHT,
  align: "center", valign: "middle", margin: 0
});

// Three-phase research program strip
const phaseY = 3.05;
const phaseH = 1.1;
const phaseLabels = ["FASE I\nExploración", "FASE II\nValidación (UMET)", "FASE III\nAplicación (este trabajo)"];
const phaseW = (W - 2 - 0.3 * 2) / 3;
phaseLabels.forEach((label, i) => {
  const px = 1 + i * (phaseW + 0.3);
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: px, y: phaseY, w: phaseW, h: phaseH, rectRadius: 0.06,
    fill: { color: i === 2 ? MOSS : PHASE_BG }, line: { type: "none" }
  });
  slide.addText(label, {
    x: px, y: phaseY, w: phaseW, h: phaseH,
    fontFace: "Calibri", fontSize: 15, bold: true, color: "FFFFFF",
    align: "center", valign: "middle", margin: 4
  });
  if (i < phaseLabels.length - 1) {
    slide.addText("→", {
      x: px + phaseW, y: phaseY, w: 0.3, h: phaseH,
      fontFace: "Arial", fontSize: 16, bold: true, color: MOSS_LIGHT,
      align: "center", valign: "middle", margin: 0
    });
  }
});

slide.addText([
  { text: "Kamila López Díaz  |  Manuel Reyes Guzmán, Ph.D. (mentor)", options: { bold: true, breakLine: true } },
  { text: "Departamento de Ciencias Físicas, Facultad de Estudios Generales, Universidad de Puerto Rico, Recinto de Río Piedras", options: {} }
], {
  x: 1, y: 4.35, w: W - 2, h: 1.1,
  fontFace: "Calibri", fontSize: 18, color: MOSS_LIGHT,
  align: "center", valign: "middle", margin: 0
});

slide.addText("Trabajo presentado originalmente en la Reunión de la Sección de Puerto Rico de la American Chemical Society (ACS)", {
  x: 1, y: 5.5, w: W - 2, h: 0.6,
  fontFace: "Calibri", fontSize: 14, italic: true, color: "FFFFFF",
  align: "center", valign: "middle", margin: 0
});

// ---------- PIPELINE BAND ----------
const pipeTop = headerH + 0.45;
slide.addText("ETAPAS DEL FRAMEWORK BIVA", {
  x: 1, y: pipeTop, w: W - 2, h: 0.55,
  fontFace: "Cambria", fontSize: 20, bold: true, color: FOREST,
  align: "left", valign: "middle", margin: 0, charSpacing: 1
});

const stepsY = pipeTop + 0.6;
const stepsH = 1.6;
const marginX = 1;
const nSteps = 8;
const stepGapX = 0.15;
const stepBoxW = (W - marginX * 2 - stepGapX * (nSteps - 1)) / nSteps;
const pipelineSteps = [
  "1. Idea\ninicial",
  "2. Fricción\nconceptual",
  "3. Pregunta y\nobjetivos",
  "4. Mapa\nbibliográfico",
  "5. Bibliografía\nviva",
  "6. Notas de\nlectura",
  "7. Divulgación",
  "8. Reflexión"
];
pipelineSteps.forEach((label, i) => {
  const sx = marginX + i * (stepBoxW + stepGapX);
  const isHighlighted = (i === 3 || i === 4);
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: sx, y: stepsY, w: stepBoxW, h: stepsH, rectRadius: 0.08,
    fill: { color: isHighlighted ? MOSS : STEP_BG },
    line: { type: "none" }
  });
  slide.addText(label, {
    x: sx, y: stepsY, w: stepBoxW, h: stepsH,
    fontFace: "Calibri", fontSize: 15, bold: true,
    color: isHighlighted ? "FFFFFF" : FOREST,
    align: "center", valign: "middle", margin: 4
  });
  if (i < pipelineSteps.length - 1) {
    slide.addText("→", {
      x: sx + stepBoxW - 0.02, y: stepsY, w: stepGapX + 0.3, h: stepsH,
      fontFace: "Arial", fontSize: 16, bold: true, color: MOSS,
      align: "center", valign: "middle", margin: 0
    });
  }
});

// ---------- LAYOUT GRID FOR 4 COLUMNS ----------
const top = stepsY + stepsH + 0.65;
const footerTop = H - 1.5;
const colGap = 0.5;
const colW = (W - marginX * 2 - colGap * 3) / 4;
const col1X = marginX;
const col2X = marginX + colW + colGap;
const col3X = marginX + 2 * (colW + colGap);
const col4X = marginX + 3 * (colW + colGap);

const usableH = footerTop - top;
const sectionGap = 0.45;
const headerH2 = 0.85;
const cardH = (usableH - 2 * headerH2 - sectionGap) / 2;

function sectionHeader(text, x, y, w, size) {
  slide.addText(text.toUpperCase(), {
    x, y, w, h: headerH2,
    fontFace: "Cambria", fontSize: size || 19, bold: true, color: FOREST,
    align: "left", valign: "middle", margin: 0, charSpacing: 0.5
  });
}

function card(x, y, w, h) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.09,
    fill: { color: CARD_BG },
    shadow: { type: "outer", color: "000000", blur: 7, offset: 2.5, angle: 90, opacity: 0.12 },
    line: { type: "none" }
  });
}

const sec1Y = top;
const card1Y = sec1Y + headerH2 + 0.15;
const card1H = cardH;
const sec2Y = card1Y + card1H + sectionGap;
const card2Y = sec2Y + headerH2 + 0.15;
const card2H = footerTop - card2Y - 0.2;

const BODY = 16.5;
const TIGHT = 15.5;

// ================= COLUMN 1: PROBLEMA Y PROPUESTA =================
sectionHeader("Problema central", col1X, sec1Y, colW);
card(col1X, card1Y, colW, card1H);
slide.addText([
  { text: "Demasiada literatura dispersa sobre P. amboinicus.", options: { bullet: true, breakLine: true, paraSpaceAfter: 12 } },
  { text: "Datos fragmentados entre estudios con metodologías heterogéneas.", options: { bullet: true, breakLine: true, paraSpaceAfter: 12 } },
  { text: "Las decisiones experimentales carecen de dirección clara.", options: { bullet: true, breakLine: true, paraSpaceAfter: 12 } },
  { text: "Pregunta motora: ¿cómo convertir la literatura en un instrumento de decisión?", options: { bullet: true } }
], { x: col1X + 0.35, y: card1Y + 0.35, w: colW - 0.7, h: 3.6, fontFace: "Calibri", fontSize: BODY, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.15 });

slide.addText("Propuesta: la bibliometría como instrumento de decisión.", {
  x: col1X + 0.35, y: card1Y + 4.1, w: colW - 0.7, h: 0.9,
  fontFace: "Calibri", fontSize: BODY, bold: true, color: FOREST, align: "left", valign: "top", margin: 0
});
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: col1X + 0.35, y: card1Y + 5.05, w: colW - 0.7, h: 1.3, rectRadius: 0.07,
  fill: { color: STEP_BG }, line: { type: "none" }
});
slide.addText("Literatura  →  Estrategia  →  Experimento", {
  x: col1X + 0.35, y: card1Y + 5.05, w: colW - 0.7, h: 1.3,
  fontFace: "Calibri", fontSize: 15.5, bold: true, color: FOREST, align: "center", valign: "middle", margin: 4
});
slide.addText(
  "BIVA parte de un principio central: cada investigación debe convertirse en un espacio de trabajo vivo, donde la IA acompaña el proceso completo en lugar de usarse como atajo superficial. Este programa de tres fases sobre P. amboinicus es el terreno donde ese principio se puso a prueba.",
  { x: col1X + 0.35, y: card1Y + 6.55, w: colW - 0.7, h: card1H - 6.9, fontFace: "Calibri", fontSize: TIGHT, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.18 }
);

sectionHeader("Qué lo hace diferente", col1X, sec2Y, colW);
card(col1X, card2Y, colW, card2H);
slide.addText([
  { text: "No es solo contar artículos.", options: { bullet: true, breakLine: true, paraSpaceAfter: 12 } },
  { text: "No es solo mapear redes de coocurrencia.", options: { bullet: true, breakLine: true, paraSpaceAfter: 12 } },
  { text: "Alinea la literatura con decisiones experimentales concretas.", options: { bullet: true, breakLine: true, paraSpaceAfter: 12 } },
  { text: "A diferencia de Elicit o Semantic Scholar, que encuentran y analizan literatura de forma puntual, BIVA organiza el ciclo completo: problema, arquitectura bibliográfica, curaduría justificada, decisiones documentadas y divulgación.", options: { bullet: true } }
], { x: col1X + 0.35, y: card2Y + 0.35, w: colW - 0.7, h: card2H - 0.7, fontFace: "Calibri", fontSize: BODY, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.18 });

// ================= COLUMN 2: DE AGENTE A APP =================
sectionHeader("De agente a app", col2X, sec1Y, colW);
card(col2X, card1Y, colW, card1H);
slide.addText(
  "Durante la Fase III se desarrolló un agente GPT especializado (EugenIA) para extraer datos de solventes desde PDFs, normalizar terminología entre estudios y generar datasets estructurados a partir de Scopus, PubMed y Google Scholar.",
  { x: col2X + 0.35, y: card1Y + 0.35, w: colW - 0.7, h: 2.9, fontFace: "Calibri", fontSize: BODY, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.18 }
);
slide.addText(
  "Ese agente puntual es, en esencia, un prototipo del módulo Bibliography Curator de BIVA: la etapa de bibliografía viva del framework, aplicada a un caso real antes de generalizarse como app.",
  { x: col2X + 0.35, y: card1Y + 3.4, w: colW - 0.7, h: 2.3, fontFace: "Calibri", fontSize: BODY, bold: true, color: FOREST, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.18 }
);
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: col2X + 0.35, y: card1Y + 5.9, w: colW - 0.7, h: 2.1, rectRadius: 0.07,
  fill: { color: "F1F6EC" }, line: { type: "none" }
});
slide.addText("91.3%", {
  x: col2X + 0.35, y: card1Y + 5.98, w: colW - 0.7, h: 1.1,
  fontFace: "Cambria", fontSize: 36, bold: true, color: ACCENT, align: "center", valign: "middle", margin: 0
});
slide.addText("coincidencia EugenIA vs. extracción manual: prueba de concepto para el módulo curador", {
  x: col2X + 0.5, y: card1Y + 7.05, w: colW - 1.0, h: 0.85, fontFace: "Calibri", fontSize: 13, color: TEXT_DARK, align: "center", valign: "top", margin: 0
});
slide.addText(
  "Este resultado piloto valida que un agente de curaduría automatizada es viable como componente central de una app de investigación, no solo como script aislado.",
  { x: col2X + 0.35, y: card1Y + 8.2, w: colW - 0.7, h: card1H - 8.5, fontFace: "Calibri", fontSize: TIGHT, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.15 }
);

sectionHeader("Arquitectura de la app", col2X, sec2Y, colW);
card(col2X, card2Y, colW, card2H);
slide.addText([
  { text: "Student Web App: interfaz guiada y simple, sin YAML, Git ni VS Code visibles.", options: { bullet: true, breakLine: true, paraSpaceAfter: 12 } },
  { text: "Researcher Workspace: biblioteca viva de investigación para uso avanzado.", options: { bullet: true, breakLine: true, paraSpaceAfter: 12 } },
  { text: "Developer Mode: proyecto completo en VS Code, con carpetas, agentes y configuración exportable.", options: { bullet: true, breakLine: true, paraSpaceAfter: 12 } },
  { text: "Los tres niveles comparten el mismo núcleo estructurado: el caso P. amboinicus corrió, en la práctica, sobre ese núcleo antes de que existiera la interfaz.", options: { bullet: true } }
], { x: col2X + 0.35, y: card2Y + 0.35, w: colW - 0.7, h: card2H - 0.7, fontFace: "Calibri", fontSize: BODY, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.15 });

// ================= COLUMN 3: RESULTADOS BIBLIOMÉTRICOS =================
sectionHeader("Crecimiento y geografía", col3X, sec1Y, colW);
card(col3X, card1Y, colW, card1H);
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: col3X + 0.35, y: card1Y + 0.35, w: colW - 0.7, h: 2.0, rectRadius: 0.07,
  fill: { color: "F1F6EC" }, line: { type: "none" }
});
slide.addText("Crecimiento acelerado", { x: col3X + 0.5, y: card1Y + 0.45, w: colW - 1.0, h: 0.6, fontFace: "Calibri", fontSize: 17, bold: true, color: ACCENT, align: "center", valign: "middle", margin: 0 });
slide.addText("Punto de inflexión alrededor de 2016 en la producción científica sobre P. amboinicus", { x: col3X + 0.5, y: card1Y + 1.05, w: colW - 1.0, h: 1.15, fontFace: "Calibri", fontSize: 14, color: TEXT_DARK, align: "center", valign: "top", margin: 0 });

slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: col3X + 0.35, y: card1Y + 2.6, w: colW - 0.7, h: 2.6, rectRadius: 0.07,
  fill: { color: "F1F6EC" }, line: { type: "none" }
});
slide.addText("~70%", { x: col3X + 0.35, y: card1Y + 2.7, w: colW - 0.7, h: 1.1, fontFace: "Cambria", fontSize: 34, bold: true, color: ACCENT, align: "center", valign: "middle", margin: 0 });
slide.addText("de la producción concentrada en la región Indo-Malaya y Brasil", { x: col3X + 0.5, y: card1Y + 3.75, w: colW - 1.0, h: 0.9, fontFace: "Calibri", fontSize: 14, color: TEXT_DARK, align: "center", valign: "top", margin: 0 });
slide.addText("¿Dónde está el Caribe?", { x: col3X + 0.5, y: card1Y + 4.6, w: colW - 1.0, h: 0.5, fontFace: "Calibri", fontSize: 14, italic: true, bold: true, color: FOREST, align: "center", valign: "middle", margin: 0 });

slide.addText(
  "Esta fuerte concentración geográfica evidencia un vacío de investigación regional que el trabajo de Kamila ayuda a llenar desde Puerto Rico.",
  { x: col3X + 0.35, y: card1Y + 5.5, w: colW - 0.7, h: card1H - 5.85, fontFace: "Calibri", fontSize: TIGHT, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.18 }
);

sectionHeader("Dominios e insight clave", col3X, sec2Y, colW);
card(col3X, card2Y, colW, card2H);
slide.addText([
  { text: "Fitoquímica", options: { bullet: true, breakLine: true, paraSpaceAfter: 8 } },
  { text: "Antimicrobiano / antiinflamatorio", options: { bullet: true, breakLine: true, paraSpaceAfter: 8 } },
  { text: "Usos biomédicos", options: { bullet: true } }
], { x: col3X + 0.35, y: card2Y + 0.35, w: colW - 0.7, h: 1.9, fontFace: "Calibri", fontSize: BODY, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.1 });

slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: col3X + 0.35, y: card2Y + 2.4, w: colW - 0.7, h: 1.9, rectRadius: 0.07,
  fill: { color: MOSS_LIGHT }, line: { type: "none" }
});
slide.addText("Insight clave: conexión débil entre Composición → Bioactividad → Aplicación en la literatura existente.", {
  x: col3X + 0.5, y: card2Y + 2.5, w: colW - 1.0, h: 1.7, fontFace: "Calibri", fontSize: 15, italic: true, bold: true, color: FOREST, align: "left", valign: "middle", margin: 0, lineSpacingMultiple: 1.15
});

slide.addText(
  "Redirección del proyecto: el enfoque inicial en actividad antiprurítica se amplió hacia múltiples rutas bioactivas emergentes. El método bibliométrico, más que describir, reorientó activamente el diseño de la investigación.",
  { x: col3X + 0.35, y: card2Y + 4.55, w: colW - 0.7, h: card2H - 4.9, fontFace: "Calibri", fontSize: TIGHT, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.18 }
);

// ================= COLUMN 4: SOLVENTES Y VALIDACIÓN EXPERIMENTAL =================
sectionHeader("Optimización de solventes", col4X, sec1Y, colW);
card(col4X, card1Y, colW, card1H);

const statW4 = (colW - 0.7 - 0.35) / 2;
const statH4 = 2.2;
const stats4 = [
  { num: "47", label: "artículos curados por EugenIA" },
  { num: "20-40%", label: "etanol v/v, solvente más reportado" },
  { num: "20-80", label: "mg GAE/g, rango de TPC en solventes polares" },
  { num: "0.7-0.9", label: "constante dieléctrica de solventes de mejor rendimiento" }
];
stats4.forEach((s, i) => {
  const rx = col4X + 0.35 + (i % 2) * (statW4 + 0.35);
  const ry = card1Y + 0.35 + Math.floor(i / 2) * (statH4 + 0.3);
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: rx, y: ry, w: statW4, h: statH4, rectRadius: 0.07,
    fill: { color: "F1F6EC" }, line: { type: "none" }
  });
  slide.addText(s.num, {
    x: rx, y: ry + 0.12, w: statW4, h: 1.1,
    fontFace: "Cambria", fontSize: 25, bold: true, color: ACCENT,
    align: "center", valign: "middle", margin: 0
  });
  slide.addText(s.label, {
    x: rx + 0.12, y: ry + 1.2, w: statW4 - 0.24, h: 0.95,
    fontFace: "Calibri", fontSize: 12, color: TEXT_DARK,
    align: "center", valign: "top", margin: 0
  });
});
const statsBottomY4 = card1Y + 0.35 + 2 * (statH4 + 0.3);
slide.addText(
  "Metanol y etanol acuoso fueron los solventes polares más asociados a alto rendimiento antioxidante y fenólico. El análisis de conglomerados vinculó la polaridad del solvente con mayor eficacia analgésica reportada.",
  { x: col4X + 0.35, y: statsBottomY4 + 0.2, w: colW - 0.7, h: card1H - (statsBottomY4 - card1Y) - 0.55, fontFace: "Calibri", fontSize: TIGHT, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.15 }
);

sectionHeader("Validación y conclusiones", col4X, sec2Y, colW);
card(col4X, card2Y, colW, card2H);
slide.addText(
  "El diseño experimental adoptó etanol 50-70% v/v, balanceando la evidencia curada con la viabilidad del laboratorio docente. La curaduría automatizada alcanzó 91.3% de coincidencia con la extracción manual; los errores se concentraron en conversión de unidades e interpretación de rangos como valores puntuales.",
  { x: col4X + 0.35, y: card2Y + 0.35, w: colW - 0.7, h: 3.6, fontFace: "Calibri", fontSize: TIGHT, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.15 }
);
slide.addText([
  { text: "El marco bibliométrico agiliza la exploración de variables de extracción y es extensible a optimización multi-objetivo.", options: { bullet: true, breakLine: true, paraSpaceAfter: 10 } },
  { text: "P. amboinicus muestra resultados consistentes con solventes polares.", options: { bullet: true, breakLine: true, paraSpaceAfter: 10 } },
  { text: "El framework, y la app BIVA que prototipa, es adaptable a otras plantas medicinales.", options: { bullet: true, breakLine: true, paraSpaceAfter: 10 } },
  { text: "Próximo paso: extender el piloto hacia el MVP estudiantil de BIVA usando este caso como plantilla.", options: { bullet: true } }
], { x: col4X + 0.35, y: card2Y + 4.1, w: colW - 0.7, h: card2H - 4.45, fontFace: "Calibri", fontSize: TIGHT, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.12 });

// ---------- FOOTER ----------
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: H - 1.5, w: W, h: 1.5,
  fill: { color: FOREST }, line: { type: "none" }
});
slide.addText("Agradecimientos: Universidad de Puerto Rico, Recinto de Río Piedras, y Sección de Puerto Rico de la American Chemical Society (ACS)  |  Framework BIVA (piloto conceptual)  |  Departamento de Ciencias Físicas, Facultad de Estudios Generales", {
  x: 1, y: H - 1.5, w: W - 2, h: 1.5,
  fontFace: "Calibri", fontSize: 14.5, color: MOSS_LIGHT,
  align: "center", valign: "middle", margin: 0
});

pres.writeFile({ fileName: "/home/claude/poster/Poster_BIVA_App_Completo.pptx" }).then(() => console.log("done"));
