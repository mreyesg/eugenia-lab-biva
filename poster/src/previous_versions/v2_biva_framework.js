const pptxgen = require("pptxgenjs");

let pres = new pptxgen();

pres.defineLayout({ name: "POSTER", width: 36, height: 48 });
pres.layout = "POSTER";
pres.author = "Kamila López Díaz";
pres.title = "BIVA: Biblioteca Viva de Investigación";

const W = 36, H = 48;

const FOREST = "1F4620";
const MOSS = "5B8C3E";
const MOSS_LIGHT = "BFD9A8";
const CREAM = "FBFAF6";
const TEXT_DARK = "24301F";
const CARD_BG = "FFFFFF";
const ACCENT = "8A5A2B";
const STEP_BG = "E8F0DF";

let slide = pres.addSlide();
slide.background = { color: CREAM };

// ---------- HEADER ----------
const headerH = 6.8;
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: W, h: headerH,
  fill: { color: FOREST }, line: { type: "none" }
});

slide.addText("BIVA: Biblioteca Viva de Investigación", {
  x: 1, y: 0.4, w: W - 2, h: 1.6,
  fontFace: "Cambria", fontSize: 52, bold: true, color: "FFFFFF",
  align: "center", valign: "middle", margin: 0
});

slide.addText("Un framework agentic para organizar y divulgar la investigación científica", {
  x: 1, y: 2.05, w: W - 2, h: 0.9,
  fontFace: "Cambria", fontSize: 26, italic: true, color: MOSS_LIGHT,
  align: "center", valign: "middle", margin: 0
});

slide.addText("Caso ilustrativo: optimización de solventes en estudios analgésicos de Plectranthus amboinicus", {
  x: 1, y: 3.05, w: W - 2, h: 0.9,
  fontFace: "Calibri", fontSize: 22, bold: true, color: "FFFFFF",
  align: "center", valign: "middle", margin: 0
});

slide.addText([
  { text: "Kamila López Díaz", options: { bold: true, breakLine: true } },
  { text: "Mentor: Manuel Reyes Guzmán, Ph.D.  |  Departamento de Ciencias Físicas, Facultad de Estudios Generales", options: {} }
], {
  x: 1, y: 4.1, w: W - 2, h: 1.2,
  fontFace: "Calibri", fontSize: 20, color: MOSS_LIGHT,
  align: "center", valign: "middle", margin: 0
});

slide.addText("Universidad de Puerto Rico, Recinto de Río Piedras", {
  x: 1, y: 5.5, w: W - 2, h: 0.8,
  fontFace: "Calibri", fontSize: 17, italic: true, color: "FFFFFF",
  align: "center", valign: "middle", margin: 0
});

// ---------- PIPELINE BAND ----------
const pipeTop = headerH + 0.5;
slide.addText("ETAPAS DEL FRAMEWORK", {
  x: 1, y: pipeTop, w: W - 2, h: 0.6,
  fontFace: "Cambria", fontSize: 22, bold: true, color: FOREST,
  align: "left", valign: "middle", margin: 0, charSpacing: 1
});

const stepsY = pipeTop + 0.65;
const stepsH = 1.9;
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
  const isHighlighted = (i === 3 || i === 4); // mapa bibliográfico / bibliografía viva: core of this case
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: sx, y: stepsY, w: stepBoxW, h: stepsH, rectRadius: 0.08,
    fill: { color: isHighlighted ? MOSS : STEP_BG },
    line: { type: "none" }
  });
  slide.addText(label, {
    x: sx, y: stepsY, w: stepBoxW, h: stepsH,
    fontFace: "Calibri", fontSize: 14, bold: true,
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

// ---------- LAYOUT GRID FOR 3 COLUMNS ----------
const top = stepsY + stepsH + 0.7;
const footerTop = H - 1.6;
const colGap = 0.6;
const colW = (W - marginX * 2 - colGap * 2) / 3;
const col1X = marginX;
const col2X = marginX + colW + colGap;
const col3X = marginX + 2 * (colW + colGap);

const usableH = footerTop - top;
const sectionGap = 0.5;
const headerH2 = 0.9;
const cardH = (usableH - 2 * headerH2 - sectionGap) / 2;

function sectionHeader(text, x, y, w) {
  slide.addText(text.toUpperCase(), {
    x, y, w, h: headerH2,
    fontFace: "Cambria", fontSize: 26, bold: true, color: FOREST,
    align: "left", valign: "middle", margin: 0, charSpacing: 1
  });
}

function card(x, y, w, h) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.1,
    fill: { color: CARD_BG },
    shadow: { type: "outer", color: "000000", blur: 8, offset: 3, angle: 90, opacity: 0.12 },
    line: { type: "none" }
  });
}

const sec1Y = top;
const card1Y = sec1Y + headerH2 + 0.2;
const card1H = cardH;
const sec2Y = card1Y + card1H + sectionGap;
const card2Y = sec2Y + headerH2 + 0.2;
const card2H = footerTop - card2Y - 0.2;

// ================= COLUMN 1: FUNDAMENTO CONCEPTUAL =================
sectionHeader("Principio del framework", col1X, sec1Y, colW);
card(col1X, card1Y, colW, card1H);
slide.addText(
  "BIVA parte de un principio central: cada investigación debe convertirse en un espacio de trabajo vivo y estructurado, donde la inteligencia artificial acompaña el proceso completo, desde la idea inicial hasta la comunicación pública, en lugar de usarse como un atajo superficial para buscar literatura.\n\nEsto significa que la IA no reemplaza el juicio del investigador: lo acompaña en cada decisión (qué aceptar, qué rechazar, por qué), y documenta esas decisiones como parte del proyecto.",
  { x: col1X + 0.4, y: card1Y + 0.4, w: colW - 0.8, h: card1H - 0.8, fontFace: "Calibri", fontSize: 20, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.25 }
);

sectionHeader("Diferenciación", col1X, sec2Y, colW);
card(col1X, card2Y, colW, card2H);
slide.addText([
  { text: "Herramientas como Elicit o Semantic Scholar encuentran y analizan literatura de forma puntual.", options: { bullet: true, breakLine: true, paraSpaceAfter: 16 } },
  { text: "BIVA organiza el ciclo completo de investigación: formular el problema, construir una arquitectura bibliográfica, curar referencias con juicio experto, documentar decisiones y producir materiales de divulgación.", options: { bullet: true, breakLine: true, paraSpaceAfter: 16 } },
  { text: "El valor no está en la búsqueda en sí, sino en sostener una bibliografía viva vinculada a cada etapa y decisión del proyecto.", options: { bullet: true } }
], { x: col1X + 0.4, y: card2Y + 0.4, w: colW - 0.8, h: card2H - 0.8, fontFace: "Calibri", fontSize: 20, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.2 });

// ================= COLUMN 2: APLICACIÓN AL CASO =================
sectionHeader("El caso P. amboinicus", col2X, sec1Y, colW);
card(col2X, card1Y, colW, card1H);
slide.addText([
  { text: "Idea inicial: uso etnobotánico extendido de P. amboinicus en Puerto Rico y el Caribe, con posibles propiedades antioxidantes y analgésicas.", options: { bullet: true, breakLine: true, paraSpaceAfter: 14 } },
  { text: "Fricción conceptual: una práctica tradicional ampliamente documentada frente a una literatura científica dispersa sobre las condiciones óptimas de extracción de sus compuestos bioactivos.", options: { bullet: true, breakLine: true, paraSpaceAfter: 14 } },
  { text: "Mapa bibliográfico: se definieron las perspectivas necesarias (conceptual, metodológica, empírica) sobre solventes, métodos y rendimientos de extracción.", options: { bullet: true, breakLine: true, paraSpaceAfter: 14 } },
  { text: "Bibliografía viva: el agente EugenIA curó un corpus de 47 artículos, clasificando solvente, concentración, método de extracción y rendimiento fenólico (TPC) reportados en cada uno.", options: { bullet: true } }
], { x: col2X + 0.4, y: card1Y + 0.4, w: colW - 0.8, h: card1H - 0.8, fontFace: "Calibri", fontSize: 19, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.18 });

sectionHeader("Validación de la curaduría", col2X, sec2Y, colW);
card(col2X, card2Y, colW, card2H);
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: col2X + 0.4, y: card2Y + 0.4, w: colW - 0.8, h: 2.6, rectRadius: 0.08,
  fill: { color: "F1F6EC" }, line: { type: "none" }
});
slide.addText("91.3%", {
  x: col2X + 0.4, y: card2Y + 0.55, w: colW - 0.8, h: 1.4,
  fontFace: "Cambria", fontSize: 46, bold: true, color: ACCENT,
  align: "center", valign: "middle", margin: 0
});
slide.addText("coincidencia entre EugenIA y la extracción manual de variables", {
  x: col2X + 0.6, y: card2Y + 1.9, w: colW - 1.2, h: 0.9,
  fontFace: "Calibri", fontSize: 15, color: TEXT_DARK,
  align: "center", valign: "top", margin: 0
});
slide.addText(
  "Los errores del agente se concentraron en la conversión de unidades entre estudios (por ejemplo, mg GAE/g frente a µg GAE/mg) y en la interpretación de rangos reportados como valores puntuales.\n\nEstos patrones corresponden a la dimensión de curaduría crítica del framework: no basta con automatizar la búsqueda, hay que justificar y verificar cada decisión.",
  { x: col2X + 0.4, y: card2Y + 3.2, w: colW - 0.8, h: card2H - 3.6, fontFace: "Calibri", fontSize: 19, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.2 }
);

// ================= COLUMN 3: RESULTADOS Y DIVULGACIÓN =================
sectionHeader("Resultados del corpus", col3X, sec1Y, colW);
card(col3X, card1Y, colW, card1H);

const statW = (colW - 0.8 - 0.4) / 2;
const statH = 2.6;
const stats = [
  { num: "47", label: "artículos científicos curados" },
  { num: "20-40%", label: "etanol v/v, solvente más reportado" },
  { num: "20-80", label: "mg GAE/g, rango de TPC en solventes polares" },
  { num: "50-70%", label: "etanol adoptado en el diseño experimental" }
];
stats.forEach((s, i) => {
  const rx = col3X + 0.4 + (i % 2) * (statW + 0.4);
  const ry = card1Y + 0.4 + Math.floor(i / 2) * (statH + 0.35);
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: rx, y: ry, w: statW, h: statH, rectRadius: 0.08,
    fill: { color: "F1F6EC" }, line: { type: "none" }
  });
  slide.addText(s.num, {
    x: rx, y: ry + 0.15, w: statW, h: 1.3,
    fontFace: "Cambria", fontSize: 30, bold: true, color: ACCENT,
    align: "center", valign: "middle", margin: 0
  });
  slide.addText(s.label, {
    x: rx + 0.15, y: ry + 1.35, w: statW - 0.3, h: 1.1,
    fontFace: "Calibri", fontSize: 13, color: TEXT_DARK,
    align: "center", valign: "top", margin: 0
  });
});

const statsBottomY = card1Y + 0.4 + 2 * (statH + 0.35);
slide.addText(
  "Soxhlet y maceración fueron los métodos de extracción dominantes en el corpus. El mapa curado por EugenIA orientó directamente las concentraciones de etanol adoptadas para la fase experimental del proyecto.",
  { x: col3X + 0.4, y: statsBottomY + 0.2, w: colW - 0.8, h: card1Y + card1H - statsBottomY - 0.6, fontFace: "Calibri", fontSize: 18, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.2 }
);

sectionHeader("Divulgación y próximos pasos", col3X, sec2Y, colW);
card(col3X, card2Y, colW, card2H);
slide.addText(
  "Este mismo póster es un producto del módulo de divulgación de BIVA: la investigación no culmina en un documento cerrado, sino en un material comunicable derivado del mismo proyecto vivo.",
  { x: col3X + 0.4, y: card2Y + 0.4, w: colW - 0.8, h: 2.4, fontFace: "Calibri", fontSize: 19, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.2 }
);
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: col3X + 0.4, y: card2Y + 3.0, w: colW - 0.8, h: 2.6, rectRadius: 0.08,
  fill: { color: MOSS_LIGHT }, line: { type: "none" }
});
slide.addText(
  "Hipótesis pedagógica: el framework puede favorecer la reorganización conceptual del estudiante al documentar las tensiones, decisiones y transformaciones que ocurren durante el proceso investigativo.",
  { x: col3X + 0.6, y: card2Y + 3.15, w: colW - 1.2, h: 2.3, fontFace: "Calibri", fontSize: 17, italic: true, color: FOREST, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.2 }
);
slide.addText([
  { text: "Extender el caso hacia el manuscrito final y la fase experimental de laboratorio.", options: { bullet: true, breakLine: true, paraSpaceAfter: 14 } },
  { text: "Refinar el agente de curaduría con los patrones de error identificados en esta validación.", options: { bullet: true } }
], { x: col3X + 0.4, y: card2Y + 5.9, w: colW - 0.8, h: card2H - 6.3, fontFace: "Calibri", fontSize: 18, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.15 });

// ---------- FOOTER ----------
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: H - 1.4, w: W, h: 1.4,
  fill: { color: FOREST }, line: { type: "none" }
});
slide.addText("Framework BIVA (piloto conceptual)  |  Departamento de Ciencias Físicas, Facultad de Estudios Generales, UPR-Río Piedras", {
  x: 1, y: H - 1.4, w: W - 2, h: 1.4,
  fontFace: "Calibri", fontSize: 16, color: MOSS_LIGHT,
  align: "center", valign: "middle", margin: 0
});

pres.writeFile({ fileName: "/home/claude/poster/Poster_BIVA_Plectranthus.pptx" }).then(() => console.log("done"));
