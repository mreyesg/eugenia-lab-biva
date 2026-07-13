// Función serverless (Vercel) que actúa de proxy seguro hacia la API de Claude.
// La clave ANTHROPIC_API_KEY vive solo en el servidor, nunca llega al navegador.
// El navegador solo puede pedir una de las 4 tareas definidas abajo, con datos
// estructurados: así la clave no queda expuesta como un "Claude gratis" para
// cualquiera que escanee el QR.

// Modelo configurable por variable de entorno. Por defecto Claude Sonnet 5:
// buen balance de calidad, costo y latencia para una app pública en el teléfono.
// Para máxima calidad, pon CLAUDE_MODEL=claude-opus-4-8 en Vercel.
const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-5";

const MAX_PAYLOAD_CHARS = 20000;

function s(v) {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

// ---- Esquemas de salida (Structured Outputs) ----
// Garantizan JSON válido sin tener que limpiar bloques markdown a mano.
const SCHEMAS = {
  friccion: {
    type: "object",
    additionalProperties: false,
    required: ["opciones"],
    properties: {
      opciones: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["titulo", "descripcion"],
          properties: {
            titulo: { type: "string" },
            descripcion: { type: "string" }
          }
        }
      }
    }
  },
  pregunta: {
    type: "object",
    additionalProperties: false,
    required: [
      "problema",
      "pregunta_principal",
      "preguntas_secundarias",
      "objetivo_general",
      "objetivos_especificos",
      "delimitaciones"
    ],
    properties: {
      problema: { type: "string" },
      pregunta_principal: { type: "string" },
      preguntas_secundarias: { type: "array", items: { type: "string" } },
      objetivo_general: { type: "string" },
      objetivos_especificos: { type: "array", items: { type: "string" } },
      delimitaciones: { type: "string" }
    }
  },
  mapa: {
    type: "object",
    additionalProperties: false,
    required: ["perspectivas"],
    properties: {
      perspectivas: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["perspectiva", "que_necesito"],
          properties: {
            perspectiva: { type: "string" },
            que_necesito: { type: "string" }
          }
        }
      }
    }
  },
  divulgacion: {
    type: "object",
    additionalProperties: false,
    required: ["estructura"],
    properties: {
      estructura: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["seccion", "contenido_breve"],
          properties: {
            seccion: { type: "string" },
            contenido_breve: { type: "string" }
          }
        }
      }
    }
  },
  notas: {
    type: "object",
    additionalProperties: false,
    required: ["idea_principal", "conceptos_clave", "relacion_investigacion"],
    properties: {
      idea_principal: { type: "string" },
      conceptos_clave: { type: "array", items: { type: "string" } },
      relacion_investigacion: { type: "string" }
    }
  }
};

// ---- Constructores de prompt por tarea ----
// Devuelven { system, user } y un "unwrap" para dar al cliente la forma que espera.
function buildFriccion(p) {
  const idea = p.idea || {};
  const system =
    "Eres un asistente de investigacion que ayuda a estudiantes universitarios a identificar fricciones conceptuales (tensiones que justifican investigar algo). Respondes unicamente con datos estructurados.";
  const user =
    `Tema: ${s(idea.tema)}\n` +
    `Por que le interesa: ${s(idea.porque)}\n` +
    `Que cree que ya sabe: ${s(idea.yaSe)}\n` +
    `Que no entiende todavia: ${s(idea.noEntiendo)}\n` +
    `Intuicion de tension: ${s(idea.tension)}\n\n` +
    "Genera exactamente 4 opciones. Cada titulo debe ser corto (menos de 8 palabras) y cada descripcion debe explicar en 1 a 2 oraciones una tension conceptual real y especifica a este tema (por ejemplo: una creencia popular versus evidencia cientifica, una practica comun versus sus riesgos, una explicacion aceptada versus casos que no encajan).";
  return { system, user, schemaKey: "friccion", unwrap: (r) => r.opciones };
}

function buildPregunta(p) {
  const system =
    "Eres un asistente de investigacion que ayuda a estudiantes a formular problemas investigables. Respondes unicamente con datos estructurados.";
  const user =
    `Idea inicial: ${JSON.stringify(p.idea || {})}\n` +
    `Friccion conceptual elegida: ${s(p.friccionSeleccion)}\n\n` +
    "Genera un problema investigable, una pregunta principal, dos preguntas secundarias, un objetivo general, dos objetivos especificos y las delimitaciones. Todo en espanol, especifico al tema, breve y claro.";
  return { system, user, schemaKey: "pregunta", unwrap: (r) => r };
}

function buildMapa(p) {
  const idea = p.idea || {};
  const preg = p.pregunta || {};
  const system =
    "Eres un asistente de investigacion. Respondes unicamente con datos estructurados.";
  const user =
    `Tema: ${s(idea.tema)}\n` +
    `Problema: ${s(preg.problema)}\n` +
    `Pregunta principal: ${s(preg.pregunta_principal)}\n\n` +
    "Genera exactamente 5 perspectivas, una por cada una de: Conceptual, Contextual, Empirica, Metodologica, Critica. En cada perspectiva, que_necesito es una frase especifica de 1 a 2 oraciones sobre que debe cubrir esa perspectiva PARA ESTE TEMA en particular, no una definicion generica.";
  return { system, user, schemaKey: "mapa", unwrap: (r) => r.perspectivas };
}

function buildDivulgacion(p) {
  const idea = p.idea || {};
  const preg = p.pregunta || {};
  const refs = Array.isArray(p.referencias) ? p.referencias.map(s).join("; ") : "";
  const system =
    "Eres un asistente de divulgacion cientifica. Respondes unicamente con datos estructurados.";
  const user =
    `Formato elegido: ${s(p.formato)}\n` +
    `Tema: ${s(idea.tema)}\n` +
    `Problema: ${s(preg.problema)}\n` +
    `Pregunta principal: ${s(preg.pregunta_principal)}\n` +
    `Objetivo general: ${s(preg.objetivo_general)}\n` +
    `Referencias aceptadas: ${refs}\n\n` +
    "Genera entre 5 y 8 secciones apropiadas para el formato elegido, en espanol, especificas a este proyecto. Cada seccion con un titulo y una descripcion breve de su contenido.";
  return { system, user, schemaKey: "divulgacion", unwrap: (r) => r };
}

function buildNotas(p) {
  const ref = p.referencia || {};
  const idea = p.idea || {};
  const preg = p.pregunta || {};
  const system =
    "Eres un asistente de investigacion que ayuda a estudiantes a redactar un borrador de ficha de lectura a partir de una referencia real. Tu resultado es un punto de partida que el estudiante debe revisar y editar con criterio propio, no una conclusion final. Respondes unicamente con datos estructurados.";
  const user =
    `Tema del proyecto: ${s(idea.tema)}\n` +
    `Pregunta principal del proyecto: ${s(preg.pregunta_principal)}\n\n` +
    `Referencia: ${s(ref.titulo)} (${s(ref.autores)}, ${s(ref.anio)})\n` +
    `Resumen/abstract real de la referencia: ${s(ref.resumen)}\n` +
    `Aporte ya identificado en la busqueda: ${s(ref.justificacion)}\n\n` +
    "A partir del resumen real (no inventes datos que no esten ahi), redacta: la idea principal del articulo en 1 a 2 oraciones, entre 3 y 5 conceptos clave breves, y como se relaciona especificamente con el tema y la pregunta de este proyecto en 1 a 2 oraciones.";
  return { system, user, schemaKey: "notas", unwrap: (r) => r };
}

const BUILDERS = {
  friccion: buildFriccion,
  pregunta: buildPregunta,
  mapa: buildMapa,
  divulgacion: buildDivulgacion,
  notas: buildNotas
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
    try {
      body = JSON.parse(body);
    } catch {
      res.status(400).json({ error: "Cuerpo invalido" });
      return;
    }
  }
  const task = body && body.task;
  const payload = (body && body.payload) || {};

  const builder = BUILDERS[task];
  if (!builder) {
    res.status(400).json({ error: "Tarea no reconocida" });
    return;
  }
  if (JSON.stringify(payload).length > MAX_PAYLOAD_CHARS) {
    res.status(413).json({ error: "Los datos enviados son demasiado grandes." });
    return;
  }

  const { system, user, schemaKey, unwrap } = builder(payload);

  try {
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
        output_config: {
          format: { type: "json_schema", schema: SCHEMAS[schemaKey] }
        },
        messages: [{ role: "user", content: user }]
      })
    });

    const data = await apiRes.json();

    if (!apiRes.ok || data.type === "error") {
      console.error("Error de la API de Claude:", data);
      res.status(502).json({ error: "El agente no pudo responder en este momento." });
      return;
    }
    if (data.stop_reason === "refusal") {
      res.status(422).json({ error: "El agente declino responder a esta solicitud." });
      return;
    }

    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      // Respaldo por si el modelo envolviera el JSON en markdown.
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      parsed = JSON.parse(cleaned);
    }

    res.status(200).json({ result: unwrap(parsed) });
  } catch (e) {
    console.error("Fallo llamando al agente:", e);
    res.status(500).json({ error: "Error interno al generar la sugerencia." });
  }
}
