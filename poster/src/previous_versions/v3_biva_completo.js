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
  const isHighlighted = (i === 3 || i === 4);
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
    fontFace: "Cambria", fontSize: 25, bold: true, color: FOREST,
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

// ================= COLUMN 1: INTRODUCCIÓN/PRINCIPIO + OBJETIVOS/DIFERENCIACIÓN =================
sectionHeader("Introducción y principio", col1X, sec1Y, colW);
card(col1X, card1Y, colW, card1H);
slide.addText(
  "Plectranthus amboinicus es una planta de uso tradicional en Puerto Rico y el Caribe, reconocida por posibles propiedades antioxidantes y analgésicas. Su literatura científica sobre condiciones óptimas de extracción se encuentra dispersa entre decenas de estudios heterogéneos, lo que dificulta su síntesis manual.\n\nBIVA parte de un principio central: cada investigación debe convertirse en un espacio de trabajo vivo y estructurado, donde la inteligencia artificial acompaña el proceso completo (desde la idea inicial hasta la divulgación) en lugar de usarse como un atajo superficial para buscar literatura. Este caso ilustra ese principio aplicado a un estudio fitoquímico real.",
  { x: col1X + 0.4, y: card1Y + 0.4, w: colW - 0.8, h: card1H - 0.8, fontFace: "Calibri", fontSize: 20, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.25 }
);

sectionHeader("Objetivos y diferenciación", col1X, sec2Y, colW);
card(col1X, card2Y, colW, card2H);
slide.addText([
  { text: "Sistematizar la literatura sobre extracción de compuestos fenólicos de P. amboinicus mediante el agente EugenIA.", options: { bullet: true, breakLine: true, paraSpaceAfter: 14 } },
  { text: "Identificar solventes, métodos y rendimientos (TPC) más reportados para orientar el diseño experimental.", options: { bullet: true, breakLine: true, paraSpaceAfter: 14 } },
  { text: "Validar el desempeño del agente frente a la extracción manual, como criterio de confiabilidad metodológica.", options: { bullet: true, breakLine: true, paraSpaceAfter: 14 } },
  { text: "A diferencia de herramientas como Elicit, que encuentran y analizan literatura de forma puntual, BIVA organiza el ciclo completo: formular el problema, curar referencias con juicio experto, documentar decisiones y producir materiales de divulgación.", options: { bullet: true } }
], { x: col1X + 0.4, y: card2Y + 0.4, w: colW - 0.8, h: card2H - 0.8, fontFace: "Calibri", fontSize: 19, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.18 });

// ================= COLUMN 2: METODOLOGÍA + DISEÑO/VALIDACIÓN =================
sectionHeader("Metodología: EugenIA en BIVA", col2X, sec1Y, colW);
card(col2X, card1Y, colW, card1H);
slide.addText(
  "Dentro de las etapas de mapa bibliográfico y bibliografía viva, el agente EugenIA procesó un corpus de 47 artículos indexados para extraer variables de interés: solvente, concentración, método de extracción y rendimiento fenólico total (TPC).",
  { x: col2X + 0.4, y: card1Y + 0.4, w: colW - 0.8, h: 2.6, fontFace: "Calibri", fontSize: 19, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.2 }
);

const stepH = 1.6;
const stepGap = 0.45;
const stepsY0 = card1Y + 3.3;
const pipeSteps2 = [
  "Corpus de 47 artículos científicos indexados",
  "Extracción automatizada de variables por EugenIA",
  "Validación cruzada contra extracción manual"
];
pipeSteps2.forEach((label, i) => {
  const sy = stepsY0 + i * (stepH + stepGap + 0.45);
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: col2X + 0.4, y: sy, w: colW - 0.8, h: stepH, rectRadius: 0.08,
    fill: { color: MOSS_LIGHT }, line: { type: "none" }
  });
  slide.addText(label, {
    x: col2X + 0.4, y: sy, w: colW - 0.8, h: stepH,
    fontFace: "Calibri", fontSize: 17, bold: true, color: FOREST,
    align: "center", valign: "middle", margin: 8
  });
  if (i < pipeSteps2.length - 1) {
    slide.addText("↓", {
      x: col2X + 0.4, y: sy + stepH, w: colW - 0.8, h: 0.45,
      fontFace: "Arial", fontSize: 22, bold: true, color: MOSS,
      align: "center", valign: "middle", margin: 0
    });
  }
});

const methodEndY = stepsY0 + 3 * stepH + 2 * (stepGap + 0.45);
slide.addText(
  "Las variables extraídas automáticamente fueron comparadas contra una extracción manual sobre el mismo corpus, estableciendo una tasa de coincidencia como medida de confiabilidad del agente.",
  { x: col2X + 0.4, y: methodEndY + 0.15, w: colW - 0.8, h: card1Y + card1H - methodEndY - 0.55, fontFace: "Calibri", fontSize: 19, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.2 }
);

sectionHeader("Diseño experimental y validación", col2X, sec2Y, colW);
card(col2X, card2Y, colW, card2H);
slide.addText(
  "Con base en los hallazgos curados, el diseño experimental adoptó concentraciones de etanol de 50-70% v/v, balanceando la evidencia reportada con la viabilidad operativa del laboratorio docente.",
  { x: col2X + 0.4, y: card2Y + 0.4, w: colW - 0.8, h: 2.3, fontFace: "Calibri", fontSize: 19, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.2 }
);
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: col2X + 0.4, y: card2Y + 2.9, w: colW - 0.8, h: 2.4, rectRadius: 0.08,
  fill: { color: "F1F6EC" }, line: { type: "none" }
});
slide.addText("91.3%", {
  x: col2X + 0.4, y: card2Y + 3.0, w: colW - 0.8, h: 1.3,
  fontFace: "Cambria", fontSize: 42, bold: true, color: ACCENT,
  align: "center", valign: "middle", margin: 0
});
slide.addText("coincidencia entre EugenIA y la extracción manual de variables", {
  x: col2X + 0.6, y: card2Y + 4.2, w: colW - 1.2, h: 0.9,
  fontFace: "Calibri", fontSize: 14, color: TEXT_DARK,
  align: "center", valign: "top", margin: 0
});
slide.addText(
  "Los errores se concentraron en la conversión de unidades entre estudios (por ejemplo, mg GAE/g frente a µg GAE/mg) y en la interpretación de rangos reportados como valores puntuales: patrones que corresponden a la dimensión de curaduría crítica del framework. No basta con automatizar la búsqueda, hay que justificar y verificar cada decisión.",
  { x: col2X + 0.4, y: card2Y + 5.6, w: colW - 0.8, h: card2H - 6.0, fontFace: "Calibri", fontSize: 19, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.2 }
);

// ================= COLUMN 3: RESULTADOS + DIVULGACIÓN/CONCLUSIONES =================
sectionHeader("Resultados del corpus", col3X, sec1Y, colW);
card(col3X, card1Y, colW, card1H);

const statW = (colW - 0.8 - 0.4) / 2;
const statH = 2.5;
const stats = [
  { num: "47", label: "artículos científicos curados" },
  { num: "20-40%", label: "etanol v/v, solvente más reportado" },
  { num: "20-80", label: "mg GAE/g, rango de TPC en solventes polares" },
  { num: "Soxhlet +\nmaceración", label: "métodos de extracción dominantes en el corpus", numSize: 22 }
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
    fontFace: "Cambria", fontSize: s.numSize || 30, bold: true, color: ACCENT,
    align: "center", valign: "middle", margin: 0
  });
  slide.addText(s.label, {
    x: rx + 0.15, y: ry + 1.4, w: statW - 0.3, h: 1.0,
    fontFace: "Calibri", fontSize: 13, color: TEXT_DARK,
    align: "center", valign: "top", margin: 0
  });
});

const statsBottomY = card1Y + 0.4 + 2 * (statH + 0.35);
slide.addText(
  "Etanol y metanol fueron los solventes más frecuentemente reportados en la literatura curada. El mapa construido por EugenIA orientó directamente las concentraciones de etanol adoptadas para la fase experimental del proyecto.",
  { x: col3X + 0.4, y: statsBottomY + 0.2, w: colW - 0.8, h: card1Y + card1H - statsBottomY - 0.6, fontFace: "Calibri", fontSize: 18, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.2 }
);

sectionHeader("Divulgación y conclusiones", col3X, sec2Y, colW);
card(col3X, card2Y, colW, card2H);
slide.addText(
  "Este mismo póster es un producto del módulo de divulgación de BIVA: la investigación no culmina en un documento cerrado, sino en un material comunicable derivado del mismo proyecto vivo.",
  { x: col3X + 0.4, y: card2Y + 0.4, w: colW - 0.8, h: 2.0, fontFace: "Calibri", fontSize: 19, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.2 }
);
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: col3X + 0.4, y: card2Y + 2.6, w: colW - 0.8, h: 2.5, rectRadius: 0.08,
  fill: { color: MOSS_LIGHT }, line: { type: "none" }
});
slide.addText(
  "Hipótesis pedagógica: el framework puede favorecer la reorganización conceptual del estudiante al documentar las tensiones, decisiones y transformaciones que ocurren durante el proceso investigativo.",
  { x: col3X + 0.6, y: card2Y + 2.75, w: colW - 1.2, h: 2.2, fontFace: "Calibri", fontSize: 16, italic: true, color: FOREST, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.2 }
);
slide.addText([
  { text: "Un agente de IA especializado puede sistematizar revisiones extensas con alta fidelidad frente a la extracción manual (91.3%).", options: { bullet: true, breakLine: true, paraSpaceAfter: 14 } },
  { text: "Los hallazgos curados orientan un diseño experimental fundamentado en evidencia para la fase de laboratorio.", options: { bullet: true, breakLine: true, paraSpaceAfter: 14 } },
  { text: "Próximos pasos: extender el caso hacia el manuscrito final y refinar el agente con los patrones de error identificados.", options: { bullet: true } }
], { x: col3X + 0.4, y: card2Y + 5.4, w: colW - 0.8, h: card2H - 5.8, fontFace: "Calibri", fontSize: 17, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.15 });

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

pres.writeFile({ fileName: "/home/claude/poster/Poster_BIVA_Completo.pptx" }).then(() => console.log("done"));
