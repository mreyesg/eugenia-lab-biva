// Retoma el proyecto ya construido (estado.json) e inyecta el estado antes de cargar la
// pagina, para no repetir busquedas ni volver a gastar llamadas al modelo. Luego acepta
// las referencias (la app las guarda como "pendiente" y exige un Aceptar explicito del
// investigador) y genera la Matriz de Decision, que es la figura estrella del poster.

import { chromium, devices } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";

const URL = "https://web-beta-hazel-49.vercel.app";
const CHROME = "C:/Users/manue/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe";
mkdirSync("capturas", { recursive: true });
const guardado = JSON.parse(readFileSync("estado.json", "utf8"));

const nav = await chromium.launch({ executablePath: CHROME });
const ctx = await nav.newContext({ ...devices["iPhone 13"], deviceScaleFactor: 3 });
await ctx.addInitScript((datos) => {
  for (const [k, v] of Object.entries(datos)) localStorage.setItem(k, v);
}, guardado);
const pg = await ctx.newPage();
const errores = [];
pg.on("pageerror", (e) => errores.push(String(e)));

let n = 10;
async function tirar(nombre) {
  n++;
  const ruta = `capturas/${n}-${nombre}.png`;
  await pg.screenshot({ path: ruta });
  console.log("  captura -> " + ruta);
}
async function esperarCarga(ms = 200000) {
  await pg.waitForFunction(
    () => !/est[aá] pensando|Buscando|Generando|Analizando/i.test(document.body.innerText),
    null, { timeout: ms });
  await pg.waitForTimeout(1200);
}
const etapa = () => pg.evaluate(() => (document.body.innerText.match(/Etapa \d+ de \d+ · [^\n]+/) || [""])[0]);

await pg.goto(URL, { waitUntil: "domcontentloaded" });
await pg.waitForTimeout(1500);
console.log("Al cargar: " + (await etapa()));

// Retroceder hasta Bibliografia viva, donde estan los botones "Aceptar".
for (let i = 0; i < 8; i++) {
  if (/Bibliograf/i.test(await etapa())) break;
  if (!(await pg.locator("#btnBack").count())) break;
  await pg.click("#btnBack");
  await pg.waitForTimeout(900);
}
console.log("Ahora en: " + (await etapa()));

// Aceptar una a una, volviendo a consultar el DOM tras cada clic.
let aceptadas = 0;
for (let k = 0; k < 8; k++) {
  const hizo = await pg.evaluate(() => {
    const b = [...document.querySelectorAll("button[data-estado='aceptada']")]
      .find((x) => !x.classList.contains("active-accepted"));
    if (!b) return false;
    b.scrollIntoView({ block: "center" });
    b.click();
    return true;
  });
  if (!hizo) break;
  aceptadas++;
  await pg.waitForTimeout(800);
}
const total = await pg.evaluate(() => {
  const st = JSON.parse(localStorage.getItem("biblioteca_viva_project") || "{}");
  return (st.bibliografia || []).filter((r) => r.estado === "aceptada").length;
});
console.log(`Aceptadas en esta pasada: ${aceptadas}. Total en estado: ${total}`);
await tirar("bibliografia-aceptadas");

// Avanzar a la Matriz de Decision.
for (let i = 0; i < 4; i++) {
  if (await pg.locator("#btnGenerarMDE").count()) break;
  await pg.click("#btnNext");
  await pg.waitForTimeout(1200);
  console.log("  -> " + (await etapa()));
}

if (await pg.locator("#btnGenerarMDE").count()) {
  await tirar("mde-antes");
  await pg.click("#btnGenerarMDE");
  console.log("Generando la MDE...");
  await pg.waitForTimeout(3000);
  await esperarCarga();
  await tirar("mde");
  await pg.evaluate(() => {
    const n = [...document.querySelectorAll("*")].find((e) => /Criterio adoptado|Evidencia/i.test(e.textContent) && e.children.length < 3);
    if (n) n.scrollIntoView({ block: "start" });
    window.scrollBy(0, -80);
  });
  await pg.waitForTimeout(700);
  await tirar("mde-tabla");
  const filas = await pg.evaluate(() => {
    const st = JSON.parse(localStorage.getItem("biblioteca_viva_project") || "{}");
    return (st.mde || []).map((d) => `${d.dimension} :: ${String(d.criterio_adoptado).slice(0, 80)}`);
  });
  console.log("Filas de la MDE generadas:");
  filas.forEach((f) => console.log("   " + f));
} else {
  console.log("Sigue sin aparecer el boton de la MDE");
  await tirar("sin-mde");
}

console.log("\nErrores de JS: " + (errores.length ? errores.join(" | ") : "ninguno"));
await nav.close();
