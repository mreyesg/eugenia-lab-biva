// Recorre la app REAL en produccion con viewport de celular y captura las pantallas
// que van al poster de ACS. El contenido es el caso real de Plectranthus, asi que lo
// que se ve en las figuras es salida genuina del sistema, no una maqueta.

import { chromium, devices } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const URL = "https://web-beta-hazel-49.vercel.app";
const CHROME = "C:/Users/manue/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe";
const SALIDA = "capturas";
mkdirSync(SALIDA, { recursive: true });

const nav = await chromium.launch({ executablePath: CHROME });
const ctx = await nav.newContext({ ...devices["iPhone 13"], deviceScaleFactor: 3 });
const pg = await ctx.newPage();
const errores = [];
pg.on("pageerror", (e) => errores.push(String(e)));

let n = 0;
async function tirar(nombre) {
  n++;
  const ruta = `${SALIDA}/${String(n).padStart(2, "0")}-${nombre}.png`;
  await pg.screenshot({ path: ruta });
  console.log("  captura -> " + ruta);
  return ruta;
}
async function estado(etiqueta) {
  const i = await pg.evaluate(() => {
    const vis = (el) => {
      const r = el.getBoundingClientRect(), s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden";
    };
    return {
      t: [...document.querySelectorAll("h1,h2,h3")].filter(vis).map((e) => e.textContent.trim()).slice(0, 4),
      b: [...document.querySelectorAll("button")].filter(vis)
        .map((x) => (x.id ? "#" + x.id : "") + "'" + x.textContent.trim().slice(0, 26) + "'" + (x.disabled ? "[off]" : "")).slice(0, 12)
    };
  });
  console.log(`\n== ${etiqueta} ==\n  ${i.t.join(" | ")}\n  ${i.b.join("  ")}`);
}
async function esperarBoton(sel, ms = 120000) {
  await pg.waitForFunction(
    (s) => { const b = document.querySelector(s); return b && !b.disabled; },
    sel, { timeout: ms }
  );
}
// La app muestra "EugenIA esta pensando..." / "Buscando..." mientras trabaja. Esperar al
// boton no sirve: ya esta habilitado. Hay que esperar a que el indicador desaparezca.
async function esperarCarga(ms = 180000) {
  await pg.waitForFunction(
    () => !/est[aá] pensando|Buscando|Generando|Analizando/i.test(document.body.innerText),
    null, { timeout: ms }
  );
  await pg.waitForTimeout(1200);
}

await pg.goto(URL, { waitUntil: "domcontentloaded" });
await pg.waitForTimeout(1000);
await estado("Portada");
await tirar("portada");

// --- Paso 1: entrada rapida del investigador ---
await pg.click("#btnResearcher");
await pg.waitForTimeout(600);
await pg.fill("#f_tema", "Solvent optimization for phenolic extraction from Plectranthus amboinicus");
await pg.fill("#f_abstract", "Aqueous ethanol and methanol are the most reported solvents for recovering total phenolic content from Plectranthus amboinicus, but reported yields vary widely across studies with heterogeneous methods, which makes it hard to choose operating conditions for a teaching laboratory.");
await pg.fill("#fast_pregunta", "Which aqueous ethanol concentration maximizes total phenolic content in Plectranthus amboinicus extracts?");
await pg.fill("#fast_objetivo", "Translate curated bibliometric evidence into concrete operating criteria for solvent selection.");
await pg.waitForTimeout(400);
await estado("Entrada rapida llena");
await tirar("entrada-investigador");

await esperarBoton("#btnNext", 20000);
await pg.click("#btnNext");
await pg.waitForTimeout(1200);
await estado("Siguiente paso");
await tirar("paso-siguiente");

// --- Paso 2: componentes del trabajo (llamada real al modelo) ---
await pg.click("#btnGenerarMapa");
console.log("  generando componentes, puede tardar...");
await pg.waitForTimeout(2500);
await esperarCarga();
await estado("Componentes generados");
await tirar("componentes");

await pg.click("#btnNext");
await pg.waitForTimeout(1500);
await esperarCarga(30000).catch(() => {});
await estado("Paso de evidencia");
await tirar("evidencia-inicio");

// --- Paso 3: buscar evidencia real para el primer componente ---
const botonesBuscar = await pg.evaluate(() =>
  [...document.querySelectorAll("button")]
    .filter((b) => /buscar/i.test(b.textContent) && b.offsetParent)
    .map((b, i) => ({ i, txt: b.textContent.trim().slice(0, 40) }))
);
console.log("  botones de busqueda: " + JSON.stringify(botonesBuscar));
if (botonesBuscar.length) {
  await pg.evaluate(() => {
    const b = [...document.querySelectorAll("button")].filter((x) => /buscar/i.test(x.textContent) && x.offsetParent)[0];
    b.scrollIntoView({ block: "center" }); b.click();
  });
  console.log("  buscando en las 3 bases, puede tardar...");
  await pg.waitForTimeout(3000);
  await esperarCarga();
  await estado("Resultados de busqueda");
  await tirar("busqueda-resultados");
}

// Reencuadrar la captura de busqueda para que empiece en "Consulta usada", que es el
// argumento visual de la busqueda auditable, y no a media oracion.
await pg.evaluate(() => {
  const n = [...document.querySelectorAll("*")].find((e) => /^Consulta usada/.test(e.textContent) && e.children.length < 3);
  if (n) n.scrollIntoView({ block: "start" });
  window.scrollBy(0, -90);
});
await pg.waitForTimeout(700);
await tirar("busqueda-auditable");

// --- Paso 4: aceptar referencias reales ---
// Uno a uno, volviendo a consultar el DOM cada vez: la app se redibuja tras cada clic,
// asi que una lista capturada de antemano queda con nodos desprendidos.
let aceptadas = 0;
for (let k = 0; k < 6; k++) {
  const hizo = await pg.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find((x) => /Añadir a mi bibliograf/i.test(x.textContent) && x.offsetParent);
    if (!b) return false;
    b.scrollIntoView({ block: "center" });
    b.click();
    return true;
  });
  if (!hizo) break;
  aceptadas++;
  await pg.waitForTimeout(900);
}
const enBiblio = await pg.evaluate(() => {
  const m = document.body.innerText.match(/(\d+)\s+referencias?\s+(en tu bibliograf|aceptad)/i);
  return m ? m[1] : "?";
});
console.log("  referencias aceptadas: " + aceptadas + " (la app reporta: " + enBiblio + ")");
await pg.waitForTimeout(1500);
await tirar("bibliografia");

// Guardar el estado para poder retomar sin repetir todo el recorrido ni volver a
// gastar llamadas al modelo en los intentos siguientes.
const estadoGuardado = await pg.evaluate(() => {
  const o = {};
  for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); }
  return o;
});
writeFileSync("estado.json", JSON.stringify(estadoGuardado));
console.log("  estado guardado en estado.json (" + Object.keys(estadoGuardado).join(",") + ")");

// --- Paso 5: avanzar hasta la MDE ---
for (let i = 0; i < 6; i++) {
  if (await pg.locator("#btnGenerarMDE").count()) { console.log("  boton de MDE encontrado"); break; }
  await pg.click("#btnNext");
  await pg.waitForTimeout(1500);
  await esperarCarga(60000).catch(() => {});
  const etapa = await pg.evaluate(() => (document.body.innerText.match(/Etapa \d+ de \d+ · [^\n]+/) || [""])[0]);
  const hayMde = await pg.locator("#btnGenerarMDE").count();
  console.log(`  -> ${etapa}   (btnGenerarMDE presente: ${hayMde ? "si" : "no"})`);
  if (/Matriz de Decisi/.test(etapa)) {
    const diag = await pg.evaluate(() => ({
      botones: [...document.querySelectorAll("button")].map(
        (b) => (b.id ? "#" + b.id : "(sin id)") + " '" + b.textContent.trim().slice(0, 40) + "'" +
               (b.disabled ? "[off]" : "") + (b.offsetParent ? "" : "[oculto]")),
      texto: document.body.innerText.replace(/\s+/g, " ").slice(0, 600)
    }));
    console.log("  --- DIAGNOSTICO de la etapa MDE ---");
    diag.botones.forEach((b) => console.log("     " + b));
    console.log("     TEXTO: " + diag.texto);
    await tirar("diag-etapa-mde");
  }
  if (hayMde) break;
}

if (await pg.locator("#btnGenerarMDE").count()) {
  await estado("Paso de la MDE");
  await pg.click("#btnGenerarMDE");
  console.log("  generando la MDE, puede tardar...");
  await pg.waitForTimeout(3000);
  await esperarCarga();
  await estado("MDE generada");
  await tirar("mde");
  // Y una segunda toma centrada en la tabla.
  await pg.evaluate(() => {
    const n = [...document.querySelectorAll("*")].find((e) => /Matriz de Decisi/i.test(e.textContent) && e.children.length < 3);
    if (n) n.scrollIntoView({ block: "start" });
    window.scrollBy(0, -60);
  });
  await pg.waitForTimeout(700);
  await tirar("mde-tabla");
} else {
  console.log("  NO se alcanzo el paso de la MDE");
  await estado("Donde quedo");
  await tirar("donde-quedo");
}

console.log("\nErrores de JS: " + (errores.length ? errores.join(" | ") : "ninguno"));
await nav.close();
