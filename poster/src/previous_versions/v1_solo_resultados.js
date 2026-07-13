const pptxgen = require("pptxgenjs");

let pres = new pptxgen();

// Custom poster layout: 36" x 48" portrait (standard academic poster board size)
pres.defineLayout({ name: "POSTER", width: 36, height: 48 });
pres.layout = "POSTER";
pres.author = "Kamila López Díaz";
pres.title = "Análisis de Literatura Asistido por IA para el Diseño Experimental de Optimización de Solventes";

const W = 36, H = 48;

// Palette: Forest & Moss (plant / phytochemical theme)
const FOREST = "1F4620";
const MOSS = "5B8C3E";
const MOSS_LIGHT = "BFD9A8";
const CREAM = "FBFAF6";
const TEXT_DARK = "24301F";
const CARD_BG = "FFFFFF";
const ACCENT = "8A5A2B";

let slide = pres.addSlide();
slide.background = { color: CREAM };

// ---------- HEADER BAND ----------
const headerH = 6.6;
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: W, h: headerH,
  fill: { color: FOREST }, line: { type: "none" }
});

slide.addText("Análisis de Literatura Asistido por IA para el Diseño Experimental de Optimización de Solventes en Estudios Analgésicos de Plectranthus amboinicus", {
  x: 1, y: 0.4, w: W - 2, h: 3.6,
  fontFace: "Cambria", fontSize: 46, bold: true, color: "FFFFFF",
  align: "center", valign: "middle", margin: 0
});

slide.addText([
  { text: "Kamila López Díaz", options: { bold: true, breakLine: true } },
  { text: "Mentor: Manuel Reyes Guzmán, Ph.D.  |  Departamento de Ciencias Físicas, Facultad de Estudios Generales", options: {} }
], {
  x: 1, y: 4.1, w: W - 2, h: 1.5,
  fontFace: "Calibri", fontSize: 24, color: MOSS_LIGHT,
  align: "center", valign: "middle", margin: 0
});

slide.addText("Universidad de Puerto Rico, Recinto de Río Piedras", {
  x: 1, y: 5.6, w: W - 2, h: 0.8,
  fontFace: "Calibri", fontSize: 20, italic: true, color: "FFFFFF",
  align: "center", valign: "middle", margin: 0
});

// ---------- LAYOUT GRID ----------
const top = headerH + 0.6;          // 7.2
const footerTop = H - 1.6;          // 46.4
const marginX = 1;
const colGap = 0.6;
const colW = (W - marginX * 2 - colGap * 2) / 3;
const col1X = marginX;
const col2X = marginX + colW + colGap;
const col3X = marginX + 2 * (colW + colGap);

const usableH = footerTop - top;    // ~39.2
const sectionGap = 0.5;
const headerH2 = 0.9;
const cardH = (usableH - 2 * headerH2 - sectionGap) / 2;   // ~18.15

function sectionHeader(text, x, y, w) {
  slide.addText(text.toUpperCase(), {
    x, y, w, h: headerH2,
    fontFace: "Cambria", fontSize: 30, bold: true, color: FOREST,
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

// ================= COLUMN 1: INTRODUCCIÓN + OBJETIVOS =================
sectionHeader("Introducción", col1X, sec1Y, colW);
card(col1X, card1Y, colW, card1H);
slide.addText(
  "Plectranthus amboinicus es una planta de uso tradicional en Puerto Rico y el Caribe, reconocida por posibles propiedades antioxidantes y analgésicas. A pesar de su uso etnobotánico extendido, la literatura científica sobre condiciones óptimas de extracción de sus compuestos bioactivos se encuentra dispersa entre decenas de estudios independientes, publicados en distintos idiomas y con metodologías heterogéneas, lo que dificulta su síntesis manual.\n\nSistematizar esta evidencia de forma manual requeriría semanas de trabajo. Este proyecto explora el uso de un agente de inteligencia artificial especializado, EugenIA, para acelerar y estandarizar ese proceso de revisión bibliográfica sin sacrificar rigor metodológico.",
  { x: col1X + 0.4, y: card1Y + 0.4, w: colW - 0.8, h: card1H - 0.8, fontFace: "Calibri", fontSize: 21, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.25 }
);

sectionHeader("Objetivos", col1X, sec2Y, colW);
card(col1X, card2Y, colW, card2H);
slide.addText([
  { text: "Sistematizar la literatura existente sobre extracción de compuestos fenólicos de P. amboinicus mediante un agente de inteligencia artificial (EugenIA).", options: { bullet: true, breakLine: true, paraSpaceAfter: 18 } },
  { text: "Identificar los solventes, métodos de extracción y rendimientos (TPC) más frecuentemente reportados en la literatura para orientar el diseño experimental.", options: { bullet: true, breakLine: true, paraSpaceAfter: 18 } },
  { text: "Explorar indirectamente el potencial antiprurítico y analgésico de los extractos mediante marcadores antioxidantes y revisión bibliográfica sistemática.", options: { bullet: true, breakLine: true, paraSpaceAfter: 18 } },
  { text: "Validar el desempeño del agente de IA frente a la extracción manual de variables, como criterio de confiabilidad metodológica.", options: { bullet: true } }
], { x: col1X + 0.4, y: card2Y + 0.4, w: colW - 0.8, h: card2H - 0.8, fontFace: "Calibri", fontSize: 21, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.2 });

// ================= COLUMN 2: METODOLOGÍA + DISEÑO EXPERIMENTAL =================
sectionHeader("Metodología", col2X, sec1Y, colW);
card(col2X, card1Y, colW, card1H);
slide.addText(
  "EugenIA, un agente de análisis de literatura asistido por IA, procesó un corpus de 47 artículos científicos indexados para extraer variables de interés: solvente utilizado, concentración, método de extracción y rendimiento de compuestos fenólicos totales (TPC).",
  { x: col2X + 0.4, y: card1Y + 0.4, w: colW - 0.8, h: 3.0, fontFace: "Calibri", fontSize: 21, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.2 }
);

// Pipeline diagram: 3 steps stacked vertically (fits tall card better)
const stepH = 1.7;
const stepGap = 0.5;
const stepsY0 = card1Y + 3.7;
const steps = [
  "Corpus de 47 artículos científicos indexados",
  "Extracción automatizada de variables por EugenIA",
  "Validación cruzada contra extracción manual"
];
steps.forEach((label, i) => {
  const sy = stepsY0 + i * (stepH + stepGap + 0.5);
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: col2X + 0.4, y: sy, w: colW - 0.8, h: stepH, rectRadius: 0.08,
    fill: { color: MOSS_LIGHT }, line: { type: "none" }
  });
  slide.addText(label, {
    x: col2X + 0.4, y: sy, w: colW - 0.8, h: stepH,
    fontFace: "Calibri", fontSize: 18, bold: true, color: FOREST,
    align: "center", valign: "middle", margin: 8
  });
  if (i < steps.length - 1) {
    slide.addText("↓", {
      x: col2X + 0.4, y: sy + stepH, w: colW - 0.8, h: 0.5,
      fontFace: "Arial", fontSize: 24, bold: true, color: MOSS,
      align: "center", valign: "middle", margin: 0
    });
  }
});

const methodEndY = stepsY0 + 3 * stepH + 2 * (stepGap + 0.5);
slide.addText(
  "Las variables extraídas automáticamente fueron comparadas contra una extracción manual realizada por la investigadora sobre el mismo corpus, estableciendo una tasa de coincidencia como medida de confiabilidad del agente.",
  { x: col2X + 0.4, y: methodEndY + 0.2, w: colW - 0.8, h: card1Y + card1H - methodEndY - 0.6, fontFace: "Calibri", fontSize: 21, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.2 }
);

sectionHeader("Diseño experimental", col2X, sec2Y, colW);
card(col2X, card2Y, colW, card2H);
slide.addText(
  "Con base en los hallazgos de la revisión, las concentraciones de etanol adoptadas para la fase experimental actual del proyecto (50–70% v/v) reflejan el balance entre los datos reportados en la literatura y la viabilidad operativa del laboratorio docente.\n\nEste rango ajusta el diseño hacia valores con mejor rendimiento documentado en estudios posteriores incorporados al corpus de EugenIA, priorizando condiciones reproducibles con el equipo disponible.\n\nLos errores del agente se concentraron en la conversión de unidades entre estudios (por ejemplo, mg GAE/g frente a µg GAE/mg) y en la interpretación de rangos reportados como valores puntuales, patrones que se documentaron como criterio de refinamiento para iteraciones futuras.",
  { x: col2X + 0.4, y: card2Y + 0.4, w: colW - 0.8, h: card2H - 0.8, fontFace: "Calibri", fontSize: 21, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.25 }
);

// ================= COLUMN 3: RESULTADOS + CONCLUSIONES =================
sectionHeader("Resultados", col3X, sec1Y, colW);
card(col3X, card1Y, colW, card1H);

const statW = (colW - 0.8 - 0.4) / 2;
const statH = 3.2;
const stats = [
  { num: "47", label: "artículos científicos analizados" },
  { num: "91.3%", label: "coincidencia EugenIA vs. extracción humana" },
  { num: "20–40%", label: "etanol v/v, solvente más reportado" },
  { num: "20–80", label: "mg GAE/g, rango de TPC en solventes polares" }
];
stats.forEach((s, i) => {
  const rx = col3X + 0.4 + (i % 2) * (statW + 0.4);
  const ry = card1Y + 0.4 + Math.floor(i / 2) * (statH + 0.4);
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: rx, y: ry, w: statW, h: statH, rectRadius: 0.08,
    fill: { color: "F1F6EC" }, line: { type: "none" }
  });
  slide.addText(s.num, {
    x: rx, y: ry + 0.2, w: statW, h: 1.5,
    fontFace: "Cambria", fontSize: 38, bold: true, color: ACCENT,
    align: "center", valign: "middle", margin: 0
  });
  slide.addText(s.label, {
    x: rx + 0.2, y: ry + 1.7, w: statW - 0.4, h: 1.4,
    fontFace: "Calibri", fontSize: 15, color: TEXT_DARK,
    align: "center", valign: "top", margin: 0
  });
});

const statsBottomY = card1Y + 0.4 + 2 * (statH + 0.4);
slide.addText(
  "Etanol (20–40% v/v) y metanol fueron los solventes más frecuentemente reportados en la literatura, con Soxhlet y maceración como métodos dominantes de extracción, y valores de TPC concentrados principalmente en sistemas de solventes polares.",
  { x: col3X + 0.4, y: statsBottomY + 0.3, w: colW - 0.8, h: card1Y + card1H - statsBottomY - 0.7, fontFace: "Calibri", fontSize: 21, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.25 }
);

sectionHeader("Conclusiones", col3X, sec2Y, colW);
card(col3X, card2Y, colW, card2H);
slide.addText([
  { text: "Un agente de IA especializado puede sistematizar revisiones de literatura extensas con una alta fidelidad frente a la extracción manual (91.3% de coincidencia).", options: { bullet: true, breakLine: true, paraSpaceAfter: 18 } },
  { text: "Los hallazgos de la revisión bibliográfica orientan un diseño experimental fundamentado en evidencia para la siguiente fase de laboratorio.", options: { bullet: true, breakLine: true, paraSpaceAfter: 18 } },
  { text: "Los patrones de error identificados permiten refinar futuras iteraciones del agente de literatura.", options: { bullet: true } }
], { x: col3X + 0.4, y: card2Y + 0.4, w: colW - 0.8, h: card2H - 0.8, fontFace: "Calibri", fontSize: 21, color: TEXT_DARK, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.25 });

// ---------- FOOTER ----------
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: H - 1.4, w: W, h: 1.4,
  fill: { color: FOREST }, line: { type: "none" }
});
slide.addText("Proyecto de investigación estudiantil  |  Departamento de Ciencias Físicas, Facultad de Estudios Generales, UPR-Río Piedras", {
  x: 1, y: H - 1.4, w: W - 2, h: 1.4,
  fontFace: "Calibri", fontSize: 17, color: MOSS_LIGHT,
  align: "center", valign: "middle", margin: 0
});

pres.writeFile({ fileName: "/home/claude/poster/Poster_Plectranthus_Kamila.pptx" }).then(() => console.log("done"));
