// Función serverless: motor de búsqueda bibliométrica real.
// 1) Claude convierte el contexto + una perspectiva del mapa en una consulta académica (en inglés).
// 2) Se busca en OpenAlex y Europe PMC (ambas gratis, sin llave). Se combinan y deduplican.
//    Si sale poco o nada, se reintenta con una consulta más amplia. Artículos REALES, con DOI.
// 3) Claude anota cada artículo con su aporte y la fuerza con que sostiene el componente.
// Nunca se inventan citas: los artículos vienen siempre de las bases, nunca del modelo.

const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-5";
const MAILTO = process.env.OPENALEX_MAILTO || "eugenia.lab@upr.edu";
const MAX_RESULTS = 8;

function s(v) {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}
function truncar(str, n) {
  str = s(str);
  return str.length > n ? str.slice(0, n).trim() + "…" : str;
}

// ---- Llamada a Claude con salida estructurada ----
async function callClaude(system, user, schema) {
  const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1600,
      thinking: { type: "disabled" },
      system,
      output_config: { format: { type: "json_schema", schema } },
      messages: [{ role: "user", content: user }]
    })
  });
  const data = await apiRes.json();
  if (!apiRes.ok || data.type === "error") {
    throw new Error("claude_error");
  }
  if (data.stop_reason === "refusal") {
    throw new Error("claude_refusal");
  }
  const text = (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");
  try {
    return JSON.parse(text);
  } catch {
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  }
}

// Normaliza un DOI a su forma desnuda en minúsculas, para comparar entre fuentes.
function normDoi(d) {
  return s(d).toLowerCase().replace(/^https?:\/\/(dx\.)?doi\.org\//, "").trim();
}

// Intercala dos listas (round-robin) conservando el orden de relevancia de cada
// fuente. Así ambas quedan representadas al recortar, en vez de que una domine.
function interleave(a, b) {
  const out = [];
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) {
    if (i < a.length) out.push(a[i]);
    if (i < b.length) out.push(b[i]);
  }
  return out;
}

// Combina resultados de varias fuentes y elimina duplicados por DOI o, si no hay
// DOI, por título normalizado.
function dedup(items) {
  const seen = new Set();
  const out = [];
  for (const it of items) {
    const key =
      normDoi(it.doi) ||
      s(it.titulo).toLowerCase().replace(/\s+/g, " ").trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(it);
  }
  return out;
}

// ---- OpenAlex ----
function reconstructAbstract(inv) {
  if (!inv || typeof inv !== "object") return "";
  const positions = [];
  for (const [word, idxs] of Object.entries(inv)) {
    if (Array.isArray(idxs)) {
      for (const i of idxs) positions.push([i, word]);
    }
  }
  positions.sort((a, b) => a[0] - b[0]);
  return positions.map((p) => p[1]).join(" ");
}

// Mapea el tipo de documento de OpenAlex a una etiqueta corta en espanol.
function tipoDoc(t) {
  const m = {
    review: "Revisión",
    article: "Artículo",
    "book-chapter": "Capítulo",
    book: "Libro",
    preprint: "Preprint",
    dataset: "Datos",
    dissertation: "Tesis",
    report: "Informe"
  };
  return m[s(t)] || "";
}

function formatAuthors(authorships) {
  if (!Array.isArray(authorships) || authorships.length === 0) return "";
  const names = authorships
    .map((a) => a && a.author && a.author.display_name)
    .filter(Boolean);
  if (names.length === 0) return "";
  if (names.length <= 4) return names.join(", ");
  return names.slice(0, 4).join(", ") + ", et al.";
}

async function searchOpenAlex(query) {
  const url =
    "https://api.openalex.org/works" +
    "?search=" + encodeURIComponent(query) +
    "&filter=has_abstract:true" +
    "&per-page=" + MAX_RESULTS +
    "&select=id,title,authorships,publication_year,doi,cited_by_count,abstract_inverted_index,open_access,primary_location,type" +
    "&mailto=" + encodeURIComponent(MAILTO);

  const res = await fetch(url, { headers: { "User-Agent": "BibliotecaViva/1.0 (mailto:" + MAILTO + ")" } });
  if (!res.ok) throw new Error("openalex_error");
  const data = await res.json();
  const works = Array.isArray(data.results) ? data.results : [];

  return works
    .filter((w) => w && w.title)
    .map((w) => {
      const oa = w.open_access || {};
      const loc = w.primary_location || {};
      const source = loc.source || {};
      const doi = w.doi || "";
      const url =
        (oa.is_oa && oa.oa_url) ||
        doi ||
        loc.landing_page_url ||
        w.id ||
        "";
      return {
        titulo: s(w.title),
        autores: formatAuthors(w.authorships),
        anio: w.publication_year || "",
        revista: s(source.display_name),
        doi: doi,
        url: url,
        oa: !!oa.is_oa,
        citas: typeof w.cited_by_count === "number" ? w.cited_by_count : null,
        tipo_doc: tipoDoc(w.type),
        resumen: truncar(reconstructAbstract(w.abstract_inverted_index), 900),
        fuente: "OpenAlex"
      };
    });
}

// ---- Europe PMC (gratis, sin llave; fuerte en química y biomedicina) ----
async function searchEuropePMC(query) {
  const url =
    "https://www.ebi.ac.uk/europepmc/webservices/rest/search" +
    "?query=" + encodeURIComponent(query + " AND HAS_ABSTRACT:Y") +
    "&format=json&resultType=core&pageSize=" + MAX_RESULTS;

  const res = await fetch(url, { headers: { "User-Agent": "BibliotecaViva/1.0 (mailto:" + MAILTO + ")" } });
  if (!res.ok) throw new Error("epmc_error");
  const data = await res.json();
  const works =
    data && data.resultList && Array.isArray(data.resultList.result)
      ? data.resultList.result
      : [];

  return works
    .filter((w) => w && w.title)
    .map((w) => {
      const doiBare = s(w.doi);
      const doiUrl = doiBare ? "https://doi.org/" + doiBare : "";
      const link =
        doiUrl ||
        (w.id && w.source ? "https://europepmc.org/article/" + w.source + "/" + w.id : "");
      const pts =
        w.pubTypeList && Array.isArray(w.pubTypeList.pubType) ? w.pubTypeList.pubType : [];
      const tipo = pts.some((t) => /review/i.test(s(t))) ? "Revisión" : "Artículo";
      return {
        titulo: s(w.title),
        autores: truncar(s(w.authorString), 120),
        anio: w.pubYear || "",
        revista: s(w.journalTitle),
        doi: doiUrl,
        url: link,
        oa: s(w.isOpenAccess) === "Y",
        citas: typeof w.citedByCount === "number" ? w.citedByCount : null,
        tipo_doc: tipo,
        resumen: truncar(s(w.abstractText), 900),
        fuente: "Europe PMC"
      };
    });
}

// Busca en ambas bases en paralelo y devuelve la union deduplicada. Solo falla
// (para que el handler responda error) si ambas fuentes caen.
async function buscarCombinado(query) {
  const [oa, ep] = await Promise.all([
    searchOpenAlex(query).catch(() => null),
    searchEuropePMC(query).catch(() => null)
  ]);
  if (oa === null && ep === null) throw new Error("openalex_error");
  return dedup(interleave(oa || [], ep || []));
}

// ---- Esquemas ----
const QUERY_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["query"],
  properties: { query: { type: "string" } }
};
const APORTES_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["aportes"],
  properties: {
    aportes: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["indice", "aporte", "fuerza"],
        properties: {
          indice: { type: "integer" },
          aporte: { type: "string" },
          // Que tan directamente el articulo sostiene el componente indicado.
          fuerza: { type: "string", enum: ["alta", "media", "baja"] }
        }
      }
    }
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Metodo no permitido" });
    return;
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(500).json({ error: "El servidor no tiene configurada la clave de la API." });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { res.status(400).json({ error: "Cuerpo invalido" }); return; }
  }
  const perspectiva = s(body && body.perspectiva);
  const queNecesito = s(body && body.que_necesito);
  const ctx = (body && body.contexto) || {};
  if (!perspectiva) {
    res.status(400).json({ error: "Falta la perspectiva" });
    return;
  }
  if (!s(ctx.tema)) {
    res.status(400).json({ error: "Falta el tema de la investigacion." });
    return;
  }

  try {
    // 1) Consulta académica en inglés
    const querySystem =
      "Eres un asistente de investigacion bibliometrica. Conviertes el contexto de una investigacion y una perspectiva especifica en UNA consulta de busqueda academica efectiva, EN INGLES (la mayoria de la literatura cientifica esta en ingles). Usa terminos y nombres cientificos correctos (por ejemplo, nombres binomiales de especies en vez de nombres comunes). Devuelve solo la consulta, de 3 a 8 palabras clave, sin operadores booleanos.";
    const queryUser =
      `Tema: ${s(ctx.tema)}\n` +
      `Problema: ${s(ctx.problema)}\n` +
      `Pregunta principal: ${s(ctx.pregunta_principal)}\n` +
      `Perspectiva: ${perspectiva}\n` +
      `Que necesita cubrir esta perspectiva: ${queNecesito}\n\n` +
      "Genera la consulta de busqueda en ingles para encontrar articulos que apoyen esta perspectiva.";
    const q = await callClaude(querySystem, queryUser, QUERY_SCHEMA);
    const query = s(q && q.query) || s(ctx.tema);

    // 2) Busqueda real en OpenAlex + Europe PMC (combinadas y deduplicadas).
    let resultados = await buscarCombinado(query);

    // Reintento con una consulta mas amplia si salio poco o nada.
    if (resultados.length < 3) {
      const amplia = query.split(/\s+/).slice(0, 3).join(" ");
      if (amplia && amplia.toLowerCase() !== query.toLowerCase()) {
        try {
          const extra = await buscarCombinado(amplia);
          resultados = dedup(resultados.concat(extra));
        } catch {
          // Si el reintento falla, conservamos lo que ya teniamos.
        }
      }
    }

    // Limitar al tope para la anotacion, conservando el intercalado por fuente.
    resultados = resultados.slice(0, MAX_RESULTS);

    if (resultados.length === 0) {
      res.status(200).json({ resultados: [], query });
      return;
    }

    // 3) Anotar cada articulo con su aporte a la investigacion
    const aporteSystem =
      "Eres un asistente bibliometrico que ayuda a un investigador a ver como cada articulo real apoya su trabajo. Para cada articulo devuelves dos cosas: 'aporte', en 1 o 2 oraciones en espanol, que explica su contribucion concreta al componente indicado y a la pregunta de investigacion; y 'fuerza', que clasifica que tan directamente lo sostiene, en uno de: 'alta' (evidencia directa y central para ese componente), 'media' (relevante pero parcial o indirecta), 'baja' (tangencial). Basate solo en el titulo y el resumen. Se honesto: si el articulo es tangencial, dilo y clasifica fuerza baja. No inventes datos que no esten en el titulo o el resumen.";
    const lista = resultados
      .map((r, idx) => `#${idx}\nTitulo: ${r.titulo}\nResumen: ${truncar(r.resumen, 500)}`)
      .join("\n\n");
    const aporteUser =
      `Investigacion. Tema: ${s(ctx.tema)}. Pregunta principal: ${s(ctx.pregunta_principal)}.\n` +
      `Perspectiva a apoyar: ${perspectiva} (${queNecesito}).\n\n` +
      `Articulos encontrados:\n${lista}\n\n` +
      "Para cada articulo (por su indice), redacta el campo aporte.";
    try {
      const anot = await callClaude(aporteSystem, aporteUser, APORTES_SCHEMA);
      const mapa = {};
      if (anot && Array.isArray(anot.aportes)) {
        for (const a of anot.aportes) {
          if (a && Number.isInteger(a.indice)) {
            mapa[a.indice] = { aporte: s(a.aporte), fuerza: s(a.fuerza) };
          }
        }
      }
      resultados = resultados.map((r, idx) => ({
        ...r,
        aporte: (mapa[idx] && mapa[idx].aporte) || "",
        fuerza: (mapa[idx] && mapa[idx].fuerza) || ""
      }));
    } catch {
      // Si falla la anotacion, devolvemos igual los articulos reales sin aporte.
      resultados = resultados.map((r) => ({ ...r, aporte: "", fuerza: "" }));
    }

    res.status(200).json({ resultados, query });
  } catch (e) {
    console.error("Fallo en la busqueda:", e);
    if (e.message === "openalex_error") {
      res.status(502).json({ error: "No se pudo consultar la base de datos de articulos. Intenta de nuevo." });
    } else {
      res.status(500).json({ error: "Error interno al buscar articulos." });
    }
  }
}
