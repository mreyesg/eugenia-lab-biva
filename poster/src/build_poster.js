const pptxgen = require("pptxgenjs");

let pres = new pptxgen();

pres.defineLayout({ name: "POSTER", width: 44, height: 60 });
pres.layout = "POSTER";
pres.author = "Kamila López Díaz";
pres.title = "EugenIA Lab";

const W = 44, H = 60;

const FOREST = "1F4620";
const MOSS = "5B8C3E";
const MOSS_LIGHT = "BFD9A8";
const CREAM = "FBFAF6";
const TEXT_DARK = "24301F";
const CARD_BG = "FFFFFF";
const ACCENT = "8A5A2B";
const ACCENT_LIGHT = "F0E4D3";
const STEP_BG = "E8F0DF";
const PHASE_BG = "2E5C33";

let slide = pres.addSlide();
slide.background = { color: CREAM };

// ---------- HEADER ----------
const headerH = 8.9;
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: W, h: headerH,
  fill: { color: FOREST }, line: { type: "none" }
});

slide.addText("EugenIA Lab", {
  x: 1, y: 0.35, w: W - 2, h: 1.5,
  fontFace: "Cambria", fontSize: 54, bold: true, color: "FFFFFF",
  align: "center", valign: "middle", margin: 0
});

slide.addText("Un agente bibliométrico asistido por IA que transforma la literatura científica en una infraestructura operativa de decisión experimental", {
  x: 2, y: 1.9, w: W - 4, h: 1.15,
  fontFace: "Cambria", fontSize: 21, italic: true, color: MOSS_LIGHT,
  align: "center", valign: "middle", margin: 0
});

slide.addText("Caso: optimización de solventes en estudios analgésicos de Plectranthus amboinicus (orégano brujo)", {
  x: 1, y: 3.15, w: W - 2, h: 0.7,
  fontFace: "Calibri", fontSize: 19, bold: true, color: "FFFFFF",
  align: "center", valign: "middle", margin: 0
});

// Three-phase research program strip
const phaseY = 3.95,
      phaseH = 1.15;
const phaseLabels = [
  "FASE I\nACS Senior Technical Meeting (PUCPR, Ponce)",
  "FASE II\nCongreso de Investigación Estudiantil (UAGM)",
  "FASE III\nACS Junior Technical Meeting (UPR-Río Piedras)"
];
const phaseW = (W - 2 - 0.3 * 2) / 3;
phaseLabels.forEach((label, i) => {
  const px = 1 + i * (phaseW + 0.3);
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: px, y: phaseY, w: phaseW, h: phaseH, rectRadius: 0.06,
    fill: { color: i === 2 ? MOSS : PHASE_BG }, line: { type: "none" }
  });
  slide.addText(label, {
    x: px, y: phaseY, w: phaseW, h: phaseH,
    fontFace: "Calibri", fontSize: 14, bold: true, color: "FFFFFF",
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
  { text: "Kamila López Díaz  |  Manuel Reyes Guzmán, Ph.D. (investigador principal)", options: { bold: true, breakLine: true } },
  { text: "EugenIA Lab, Departamento de Ciencias Físicas (CIFI 4996), Facultad de Estudios Generales, UPR-Río Piedras", options: {} }
], {
  x: 1, y: 5.35, w: W - 2, h: 1.0,
  fontFace: "Calibri", fontSize: 17, color: MOSS_LIGHT,
  align: "center", valign: "middle", margin: 0
});

slide.addText("El nombre honra a Eugene Garfield, fundador de la bibliometría moderna", {
  x: 1, y: 6.35, w: W - 2, h: 0.55,
  fontFace: "Calibri", fontSize: 13.5, italic: true, color: "FFFFFF",
  align: "center", valign: "middle", margin: 0
});

// ---------- MDE PIPELINE BAND ----------
const pipeTop = headerH + 0.45;
slide.addText("DE LA LITERATURA A LA DECISIÓN EXPERIMENTAL", {
  x: 1, y: pipeTop, w: W - 2, h: 0.55,
  fontFace: "Cambria", fontSize: 20, bold: true, color: FOREST,
  align: "left", valign: "middle", margin: 0, charSpacing: 1
});

const stepsY = pipeTop + 0.6;
const stepsH = 1.9;
const marginX = 1;
const nSteps = 5;
const stepGapX = 0.25;
const stepBoxW = (W - marginX * 2 - stepGapX * (nSteps - 1)) / nSteps;
const pipeSteps5 = [
  "Literatura\ncientífica (PDFs)",
  "Búsqueda y\ndescarga automatizada",
  "Extracción\nestructurada de variables",
  "Matriz de Decisión\nExperimental (MDE)",
  "Criterios de\ndiseño experimental"
];
pipeSteps5.forEach((label, i) => {
  const sx = marginX + i * (stepBoxW + stepGapX);
  const isMDE = (i === 3);
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: sx, y: stepsY, w: stepBoxW, h: stepsH, rectRadius: 0.09,
    fill: { color: isMDE ? ACCENT : STEP_BG },
    shadow: isMDE ? { type: "outer", color: "000000", blur: 8, offset: 3, angle: 90, opacity: 0.25 } : undefined,
    line: { type: "none" }
  });
  slide.addText(label, {
    x: sx, y: stepsY, w: stepBoxW, h: stepsH,
    fontFace: "Calibri", fontSize: isMDE ? 18 : 16, bold: true,
    color: isMDE ? "FFFFFF" : FOREST,
    align: "center", valign: "middle", margin: 6
  });
  if (i < pipeSteps5.length - 1) {
    slide.addText("→", {
      x: sx + stepBoxW - 0.03, y: stepsY, w: stepGapX + 0.4, h: stepsH,
      fontFace: "Arial", fontSize: 20, bold: true, color: MOSS,
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

const BODY = 16;
const TIGHT = 15;

// ================= COLUMN 1: EL PROGRAMA + PROBLEMA/PROPUESTA =================
sectionHeader("El programa EugenIA Lab", col1X, sec1Y, colW);
card(col1X, card1Y, colW, card1H);
slide.addText(
  "EugenIA Lab es un programa de experiencias investigativas subgraduadas del Departamento de Ciencias Físicas (curso CIFI 4996), fundado por el Prof. Manuel Reyes Guzmán. Su nombre honra a Eugene Garfield, fundador de la bibliometría moderna.\n\nSu proyecto fundacional estudia las propiedades fitoquímicas y el potencial biológico de Plectranthus amboinicus, documentado en tres presentaciones estudiantiles sucesivas (Fases I a III, ver franja superior). La matrícula de Kamila para agosto-diciembre 2026 es continuación directa de esa trayectoria.",
  { x: col1X + 0.35, y: card1Y + 0.35, w: colW - 0.7, h: card1H - 0.7, fontFace: "Calibri", fontSize: BODY, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.2 }
);

sectionHeader("Problema y propuesta", col1X, sec2Y, colW);
card(col1X, card2Y, colW, card2H);
slide.addText([
  { text: "Demasiada literatura dispersa sobre P. amboinicus, con metodologías heterogéneas entre estudios.", options: { bullet: true, breakLine: true, paraSpaceAfter: 14 } },
  { text: "Sin un instrumento que las oriente, las decisiones experimentales carecen de dirección clara.", options: { bullet: true, breakLine: true, paraSpaceAfter: 14 } },
  { text: "Propuesta: la bibliometría como instrumento de decisión, siguiendo la lógica literatura, estrategia, experimento.", options: { bullet: true, breakLine: true, paraSpaceAfter: 14 } },
  { text: "A diferencia de una búsqueda puntual de literatura, EugenIA sostiene el ciclo completo hasta un artefacto operativo: la Matriz de Decisión Experimental (MDE).", options: { bullet: true } }
], { x: col1X + 0.35, y: card2Y + 0.35, w: colW - 0.7, h: card2H - 0.7, fontFace: "Calibri", fontSize: BODY, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.18 });

// ================= COLUMN 2: EL AGENTE EUGENIA =================
sectionHeader("Capacidades actuales del pipeline", col2X, sec1Y, colW);
card(col2X, card1Y, colW, card1H);
slide.addText([
  { text: "Búsqueda simultánea en múltiples bases: PubMed, OpenAlex, CrossRef, Scopus y Web of Science.", options: { bullet: true, breakLine: true, paraSpaceAfter: 13 } },
  { text: "Deduplicación de registros por DOI y título normalizado.", options: { bullet: true, breakLine: true, paraSpaceAfter: 13 } },
  { text: "Enriquecimiento con enlaces de acceso abierto vía Unpaywall.", options: { bullet: true, breakLine: true, paraSpaceAfter: 13 } },
  { text: "Descarga y validación rigurosa de PDFs mediante PyMuPDF.", options: { bullet: true, breakLine: true, paraSpaceAfter: 13 } },
  { text: "Generación de archivos CSV de metadatos organizados por proyecto.", options: { bullet: true } }
], { x: col2X + 0.35, y: card1Y + 0.35, w: colW - 0.7, h: card1H - 0.7, fontFace: "Calibri", fontSize: BODY, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.15 });

sectionHeader("La brecha que cierra este semestre", col2X, sec2Y, colW);
card(col2X, card2Y, colW, card2H);
slide.addText(
  "La extracción estructurada de variables experimentales (solvente, método, rendimiento, TPC, IC\u2085\u2080/DPPH, condiciones) reside hoy en un asistente GPT separado, no integrado al pipeline principal.\n\nEl objetivo del semestre agosto-diciembre 2026 es incorporar esa función directamente a EugenIA, completando el ciclo hasta la MDE. Kamila participa en el diseño de prompts, pruebas, documentación y validación del nuevo módulo; la integración técnica de mayor complejidad la supervisa el investigador principal.",
  { x: col2X + 0.35, y: card2Y + 0.35, w: colW - 0.7, h: card2H - 2.6, fontFace: "Calibri", fontSize: BODY, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.18 }

);
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: col2X + 0.35, y: card2Y + card2H - 1.9, w: colW - 0.7, h: 1.55, rectRadius: 0.07,
  fill: { color: ACCENT_LIGHT }, line: { type: "none" }
});
slide.addText("Meta: EugenIA v2.0, con el módulo de análisis integrado", {
  x: col2X + 0.55, y: card2Y + card2H - 1.9, w: colW - 1.1, h: 1.55,
  fontFace: "Calibri", fontSize: 16.5, bold: true, italic: true, color: ACCENT,
  align: "center", valign: "middle", margin: 0, lineSpacingMultiple: 1.1
});

// ================= COLUMN 3: LA MDE (PROTAGONISTA) =================
sectionHeader("Qué es la MDE", col3X, sec1Y, colW);
card(col3X, card1Y, colW, card1H);
slide.addText(
  "La Matriz de Decisión Experimental (MDE) es el artefacto central del proyecto: traduce evidencia bibliométrica curada en criterios operativos concretos para el diseño experimental del laboratorio docente.\n\nNo es una tabla descriptiva: es un instrumento de decisión. Cada fila resume qué dice la literatura y qué implica eso para el próximo experimento.",
  { x: col3X + 0.35, y: card1Y + 0.35, w: colW - 0.7, h: 3.4, fontFace: "Calibri", fontSize: BODY, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.2 }
);

// Mini MDE example table
const mdeRows = [
  ["Variable", "Evidencia curada", "Criterio adoptado"],
  ["Solvente", "Etanol 20-40% v/v y metanol, más reportados", "Etanol 50-70% v/v"],
  ["TPC", "20-80 mg GAE/g en solventes polares", "Meta de referencia"],
  ["Método", "Soxhlet y maceración dominantes", "Maceración (viabilidad de lab)"]
];
slide.addTable(mdeRows, {
  x: col3X + 0.35, y: card1Y + 3.95, w: colW - 0.7, h: card1H - 4.3,
  fontFace: "Calibri", fontSize: 12.5, color: TEXT_DARK,
  border: { pt: 0.5, color: "D8E3D1" },
  fill: { color: "F7FAF4" },
  autoPage: false,
  rowH: (card1H - 4.3) / 4,
  colW: [colW * 0.22, colW * 0.44, colW * 0.34].map(v => v * 0.98),
});
// restyle header row
slide.addShape(pres.shapes.RECTANGLE, {
  x: col3X + 0.35, y: card1Y + 3.95, w: colW - 0.7, h: (card1H - 4.3) / 4,
  fill: { color: MOSS }, line: { type: "none" }
});
slide.addText([
  { text: "Variable", options: {} }
], { x: col3X + 0.4, y: card1Y + 3.95, w: (colW - 0.7) * 0.22, h: (card1H - 4.3) / 4, fontFace: "Calibri", fontSize: 12.5, bold: true, color: "FFFFFF", align: "left", valign: "middle", margin: 2 });
slide.addText("Evidencia curada", { x: col3X + 0.4 + (colW - 0.7) * 0.22, y: card1Y + 3.95, w: (colW - 0.7) * 0.44, h: (card1H - 4.3) / 4, fontFace: "Calibri", fontSize: 12.5, bold: true, color: "FFFFFF", align: "left", valign: "middle", margin: 2 });
slide.addText("Criterio adoptado", { x: col3X + 0.4 + (colW - 0.7) * 0.66, y: card1Y + 3.95, w: (colW - 0.7) * 0.34, h: (card1H - 4.3) / 4, fontFace: "Calibri", fontSize: 12.5, bold: true, color: "FFFFFF", align: "left", valign: "middle", margin: 2 });

sectionHeader("Validación de la curaduría", col3X, sec2Y, colW);
card(col3X, card2Y, colW, card2H);
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: col3X + 0.35, y: card2Y + 0.35, w: colW - 0.7, h: 2.1, rectRadius: 0.07,
  fill: { color: "F1F6EC" }, line: { type: "none" }
});
slide.addText("91.3%", {
  x: col3X + 0.35, y: card2Y + 0.42, w: colW - 0.7, h: 1.1,
  fontFace: "Cambria", fontSize: 36, bold: true, color: ACCENT, align: "center", valign: "middle", margin: 0
});
slide.addText("coincidencia entre EugenIA y la extracción manual de variables", {
  x: col3X + 0.5, y: card2Y + 1.48, w: colW - 1.0, h: 0.85, fontFace: "Calibri", fontSize: 13, color: TEXT_DARK, align: "center", valign: "top", margin: 0
});
slide.addText(
  "Los errores se concentraron en la conversión de unidades entre estudios y en la interpretación de rangos reportados como valores puntuales.\n\nNo basta con automatizar la búsqueda: hay que justificar y verificar cada dato que alimenta la MDE antes de convertirlo en criterio de diseño.",
  { x: col3X + 0.35, y: card2Y + 2.75, w: colW - 0.7, h: card2H - 3.1, fontFace: "Calibri", fontSize: BODY, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.2 }
);

// ================= COLUMN 4: RESULTADOS + CALENDARIO =================
sectionHeader("Resultados del corpus", col4X, sec1Y, colW);
card(col4X, card1Y, colW, card1H);

const statW4 = (colW - 0.7 - 0.35) / 2;
const statH4 = 2.15;
const stats4 = [
  { num: "47", label: "artículos científicos curados" },
  { num: "20-40%", label: "etanol v/v, solvente más reportado" },
  { num: "20-80", label: "mg GAE/g, rango de TPC en solventes polares" },
  { num: "Soxhlet +\nmaceración", label: "métodos de extracción dominantes", numSize: 20 }
];
stats4.forEach((s, i) => {
  const rx = col4X + 0.35 + (i % 2) * (statW4 + 0.35);
  const ry = card1Y + 0.35 + Math.floor(i / 2) * (statH4 + 0.3);
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: rx, y: ry, w: statW4, h: statH4, rectRadius: 0.07,
    fill: { color: "F1F6EC" }, line: { type: "none" }
  });
  slide.addText(s.num, {
    x: rx, y: ry + 0.12, w: statW4, h: 1.05,
    fontFace: "Cambria", fontSize: s.numSize || 26, bold: true, color: ACCENT,
    align: "center", valign: "middle", margin: 0
  });
  slide.addText(s.label, {
    x: rx + 0.12, y: ry + 1.15, w: statW4 - 0.24, h: 0.95,
    fontFace: "Calibri", fontSize: 11.5, color: TEXT_DARK,
    align: "center", valign: "top", margin: 0
  });
});
const statsBottomY4 = card1Y + 0.35 + 2 * (statH4 + 0.3);
slide.addText(
  "Etanol acuoso y metanol fueron los solventes polares más asociados a alto rendimiento antioxidante y fenólico, alimentando directamente la MDE del proyecto.",
  { x: col4X + 0.35, y: statsBottomY4 + 0.2, w: colW - 0.7, h: card1H - (statsBottomY4 - card1Y) - 0.55, fontFace: "Calibri", fontSize: TIGHT, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.15 }
);

sectionHeader("Calendario Ago-Dic 2026", col4X, sec2Y, colW, 17);
card(col4X, card2Y, colW, card2H);
slide.addText([
  { text: "Agosto: auditoría del pipeline actual de EugenIA.", options: { bullet: true, breakLine: true, paraSpaceAfter: 9 } },
  { text: "Agosto-septiembre: diseño del módulo de extracción de variables.", options: { bullet: true, breakLine: true, paraSpaceAfter: 9 } },
  { text: "Septiembre-octubre: implementación e integración al pipeline.", options: { bullet: true, breakLine: true, paraSpaceAfter: 9 } },
  { text: "Octubre-noviembre: generación y validación de la MDE.", options: { bullet: true, breakLine: true, paraSpaceAfter: 9 } },
  { text: "Noviembre: divulgación (congreso estudiantil, borrador de manuscrito).", options: { bullet: true, breakLine: true, paraSpaceAfter: 9 } },
  { text: "Diciembre: cierre semestral e informe de avance.", options: { bullet: true } }
], { x: col4X + 0.35, y: card2Y + 0.35, w: colW - 0.7, h: 5.0, fontFace: "Calibri", fontSize: TIGHT, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.1 });

slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: col4X + 0.35, y: card2Y + 5.5, w: colW - 0.7, h: card2H - 5.85, rectRadius: 0.07,
  fill: { color: STEP_BG }, line: { type: "none" }
});
slide.addText(
  "Productos esperados: EugenIA v2.0 integrado, documentación técnica, corpus ampliado, MDE actualizada, presentación en congreso estudiantil e informe semestral de avance.",
  { x: col4X + 0.55, y: card2Y + 5.6, w: colW - 1.1, h: card2H - 6.05, fontFace: "Calibri", fontSize: 13.5, bold: true, color: FOREST, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.15 }
);

// ---------- FOOTER ----------
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: H - 1.4, w: W, h: 1.4,
  fill: { color: FOREST }, line: { type: "none" }
});
slide.addText("Agradecimientos: Universidad de Puerto Rico, Recinto de Río Piedras, y Sección de Puerto Rico de la American Chemical Society (ACS)  |  EugenIA Lab, CIFI 4996  |  Departamento de Ciencias Físicas, Facultad de Estudios Generales", {
  x: 1, y: H - 1.4, w: W - 2, h: 1.4,
  fontFace: "Calibri", fontSize: 14, color: MOSS_LIGHT,
  align: "center", valign: "middle", margin: 0
});

pres.writeFile({ fileName: "/home/claude/poster/Poster_EugenIA_Lab_MDE.pptx" }).then(() => console.log("done"));
