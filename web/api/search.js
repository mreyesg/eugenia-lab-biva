// Función serverless: motor de búsqueda bibliométrica real.
// 1) Claude convierte el contexto + una perspectiva del mapa en una consulta académica (en inglés).
// 2) Se busca en OpenAlex (gratis, sin llave; agrega Crossref, PubMed, MAG y más). Artículos REALES, con DOI.
// 3) Claude anota cada artículo con su aporte específico a la investigación en curso.
// Nunca se inventan citas: los artículos vienen siempre de OpenAlex.

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

    // 2) Busqueda real en OpenAlex
    let resultados = await searchOpenAlex(query);

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
