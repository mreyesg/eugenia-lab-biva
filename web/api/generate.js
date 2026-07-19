// Función serverless (Vercel) que actúa de proxy seguro hacia la API de Claude.
// La clave ANTHROPIC_API_KEY vive solo en el servidor, nunca llega al navegador.
// El navegador solo puede pedir una de las tareas definidas abajo, con datos
// estructurados: así la clave no queda expuesta como un "Claude gratis" para
// cualquiera que escanee el QR.

// Modelo configurable por variable de entorno. Por defecto Claude Sonnet 5:
// buen balance de calidad, costo y latencia para una app pública en el teléfono.
// Para máxima calidad, pon CLAUDE_MODEL=claude-opus-4-8 en Vercel.
const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-5";

const MAX_PAYLOAD_CHARS = 40000;

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
  },
  reenfoque: {
    type: "object",
    additionalProperties: false,
    required: [
      "tema",
      "problema",
      "pregunta_principal",
      "objetivo_general",
      "objetivos_especificos",
      "justificacion_giro",
      "fuentes"
    ],
    properties: {
      tema: { type: "string" },
      problema: { type: "string" },
      pregunta_principal: { type: "string" },
      objetivo_general: { type: "string" },
      objetivos_especificos: { type: "array", items: { type: "string" } },
      justificacion_giro: { type: "string" },
      // Numeros (1-based) de las referencias aceptadas que sostienen el nuevo foco.
      fuentes: { type: "array", items: { type: "integer" } }
    }
  },
  mde: {
    type: "object",
    additionalProperties: false,
    required: ["dimensiones"],
    properties: {
      dimensiones: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["dimension", "hallazgo_evidencia", "criterio_adoptado", "fuentes"],
          properties: {
            dimension: { type: "string" },
            hallazgo_evidencia: { type: "string" },
            criterio_adoptado: { type: "string" },
            // Numeros (1-based) de las referencias aceptadas que sostienen esta fila.
            fuentes: { type: "array", items: { type: "integer" } }
          }
        }
      }
    }
  },
  sintesis: {
    type: "object",
    additionalProperties: false,
    required: ["hallazgos"],
    properties: {
      hallazgos: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["tipo", "hallazgo", "implicacion", "fuentes", "confianza"],
          properties: {
            tipo: { type: "string", enum: ["consenso", "contradiccion", "brecha"] },
            hallazgo: { type: "string" },
            implicacion: { type: "string" },
            fuentes: { type: "array", items: { type: "integer" } },
            confianza: { type: "string", enum: ["alta", "media", "baja"] }
          }
        }
      }
    }
  },
  extraerReferencia: {
    type: "object",
    additionalProperties: false,
    required: ["titulo", "autores", "anio", "resumen"],
    properties: {
      titulo: { type: "string" },
      autores: { type: "string" },
      anio: { type: "string" },
      resumen: { type: "string" }
    }
  },
  borradores: {
    type: "object",
    additionalProperties: false,
    required: ["justificacion", "metodos", "comparacion", "discusion", "tabla_comparativa"],
    properties: {
      // Cuatro borradores de parrafo, uno por componente del trabajo. Cada uno
      // cita sus fuentes con marcadores [n] que remiten a las referencias
      // aceptadas numeradas.
      justificacion: { type: "string" },
      metodos: { type: "string" },
      comparacion: { type: "string" },
      discusion: { type: "string" },
      tabla_comparativa: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["fuente", "enfoque", "hallazgo_principal", "limitacion"],
          properties: {
            // Numero (1-based) de la referencia aceptada que resume esta fila.
            fuente: { type: "integer" },
            enfoque: { type: "string" },
            hallazgo_principal: { type: "string" },
            limitacion: { type: "string" }
          }
        }
      }
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
    "Genera exactamente 4 componentes de un trabajo publicable, con estos nombres exactos en este orden: " +
    "'Justificacion y brecha', 'Metodos', 'Comparacion de resultados', 'Discusion y contraste'. " +
    "Para cada componente, que_necesito es una frase especifica de 1 a 2 oraciones sobre que evidencia bibliografica necesita esa seccion PARA ESTE TEMA en particular (por ejemplo, en Metodos: que enfoques metodologicos conviene revisar para elegir y defender el propio), no una definicion generica.";
  return { system, user, schemaKey: "mapa", unwrap: (r) => r.perspectivas, maxTokens: 2200 };
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
  return { system, user, schemaKey: "divulgacion", unwrap: (r) => r, maxTokens: 2200 };
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

function buildMde(p) {
  const idea = p.idea || {};
  const preg = p.pregunta || {};
  const refs = Array.isArray(p.referencias) ? p.referencias : [];
  const lista = refs
    .map((r, i) => {
      const n = i + 1;
      return (
        `[${n}] ${s(r.titulo)} (${s(r.autores)}, ${s(r.anio)})\n` +
        `    Resumen: ${s(r.resumen)}\n` +
        `    Aporte identificado: ${s(r.justificacion)}`
      );
    })
    .join("\n");
  const system =
    "Eres un asistente de investigacion que construye una Matriz de Decision: traduce evidencia bibliografica ya curada en criterios operativos concretos para tomar decisiones dentro de una investigacion. Te adaptas a cualquier disciplina: las dimensiones de decision dependen del campo del trabajo (por ejemplo, en quimica podrian ser solvente, metodo de extraccion o rangos de un parametro; en otros campos seran otras). Usas unicamente la evidencia de las fuentes provistas, nunca inventas datos ni citas. Respondes unicamente con datos estructurados.";
  const user =
    `Tema del proyecto: ${s(idea.tema)}\n` +
    `Pregunta principal: ${s(preg.pregunta_principal)}\n` +
    `Objetivo general: ${s(preg.objetivo_general)}\n\n` +
    `Referencias aceptadas (numeradas):\n${lista}\n\n` +
    "A partir SOLO de estas referencias, identifica entre 3 y 6 dimensiones de decision relevantes para ESTE trabajo en particular (las que el investigador debe resolver para avanzar). Para cada dimension: 'hallazgo_evidencia' resume que dice la evidencia curada al respecto; 'criterio_adoptado' es una decision operativa concreta y accionable que se recomienda tomar, coherente con esa evidencia; 'fuentes' es la lista de numeros de las referencias que sostienen esa fila (solo numeros que aparezcan en la lista de arriba). No inventes dimensiones que las fuentes no puedan sostener. Todo en espanol, especifico a este proyecto.";
  return { system, user, schemaKey: "mde", unwrap: (r) => r.dimensiones, maxTokens: 2400 };
}

function buildSintesis(p) {
  const idea = p.idea || {};
  const preg = p.pregunta || {};
  const refs = Array.isArray(p.referencias) ? p.referencias : [];
  const lista = refs
    .map((r, i) =>
      `[${i + 1}] ${s(r.titulo)} (${s(r.autores)}, ${s(r.anio)})\n` +
      `    Resumen: ${s(r.resumen)}\n` +
      `    Aporte identificado: ${s(r.justificacion)}`
    )
    .join("\n");
  const system =
    "Eres un analista de evidencia cientifica. Comparas articulos ya seleccionados para identificar convergencias, contradicciones y brechas relevantes para una investigacion. Trabajas solo con los titulos, resumenes y aportes provistos. No conviertes ausencia de informacion en prueba de ausencia, no inventas resultados y distingues claramente una brecha del corpus provisto de una brecha demostrada de toda la literatura. Respondes unicamente con datos estructurados.";
  const user =
    `Tema: ${s(idea.tema)}\n` +
    `Pregunta principal: ${s(preg.pregunta_principal)}\n` +
    `Objetivo general: ${s(preg.objetivo_general)}\n\n` +
    `Fuentes aceptadas (numeradas):\n${lista}\n\n` +
    "Genera entre 3 y 7 hallazgos utiles. Usa tipo 'consenso' cuando dos o mas fuentes converjan; 'contradiccion' cuando reporten resultados, metodos o interpretaciones incompatibles; y 'brecha' para algo relevante que este corpus no resuelve. Para cada hallazgo explica su implicacion concreta para este proyecto, asigna solamente los numeros de las fuentes que realmente lo sostienen y declara confianza alta, media o baja segun la claridad y cantidad de evidencia disponible. Si no hay evidencia suficiente para una contradiccion, no la inventes. En las brechas, redacta explicitamente que se trata de una brecha observada en el corpus seleccionado.";
  return { system, user, schemaKey: "sintesis", unwrap: (r) => r.hallazgos, maxTokens: 2600 };
}

function buildReenfoque(p) {
  const idea = p.idea || {};
  const preg = p.pregunta || {};
  const refs = Array.isArray(p.referencias) ? p.referencias : [];
  const lista = refs
    .map((r, i) => {
      const n = i + 1;
      return (
        `[${n}] ${s(r.titulo)} (${s(r.autores)}, ${s(r.anio)})\n` +
        `    Resumen: ${s(r.resumen)}\n` +
        `    Aporte: ${s(r.justificacion)}`
      );
    })
    .join("\n");
  const system =
    "Eres un asistente de investigacion. Ayudas a un investigador a reconsiderar el foco de su trabajo a la luz de los articulos que realmente selecciono, no de los que penso al principio. Es legitimo que el foco se reoriente hacia los intereses que emergen de esa seleccion, aunque cambie respecto al foco original: a veces la verdadera pregunta se descubre leyendo. Basas la propuesta unicamente en los articulos provistos, nunca inventas datos ni citas. Respondes unicamente con datos estructurados.";
  const user =
    `Foco original. Tema: ${s(idea.tema)}. Pregunta principal: ${s(preg.pregunta_principal)}.\n\n` +
    `Articulos que el investigador acepto (numerados):\n${lista}\n\n` +
    "Propon un foco de investigacion reformulado que emerja genuinamente de estos articulos seleccionados, aunque implique un giro respecto al foco original. Devuelve: 'tema' (el nuevo angulo, breve), 'problema', 'pregunta_principal', 'objetivo_general', entre 2 y 3 'objetivos_especificos', 'justificacion_giro' (en 2 a 3 oraciones, como este nuevo foco surge de los articulos elegidos y en que se diferencia del foco original), y 'fuentes' (los numeros de los articulos que sostienen el nuevo foco). Todo en espanol, especifico y coherente con la evidencia seleccionada.";
  return { system, user, schemaKey: "reenfoque", unwrap: (r) => r, maxTokens: 2000 };
}

function buildExtraerReferencia(p) {
  const texto = s(p.texto).slice(0, 8000);
  const system =
    "Eres un asistente bibliografico que identifica los datos de una referencia a partir del texto extraido de las primeras paginas de un PDF real que el investigador ya tiene en su poder (por ejemplo, un articulo de una base de datos paga a la que tiene acceso institucional). Trabajas UNICAMENTE con el texto provisto, nunca inventas ni completas con conocimiento externo. Si no puedes identificar con confianza el titulo, los autores o el anio, deja ese campo como cadena vacia en vez de adivinar. El resumen sintetiza en 2 a 4 oraciones, en espanol, el contenido real del articulo segun el texto provisto (si el texto incluye un abstract, basate en el; si no, sintetiza a partir de la introduccion disponible, sin inventar resultados que no esten en el texto). Respondes unicamente con datos estructurados.";
  const user =
    `Texto extraido de las primeras paginas de un PDF:\n\n${texto}\n\n` +
    "Identifica titulo, autores (en el formato en que aparezcan, separados por coma), anio de publicacion, y redacta el resumen.";
  return { system, user, schemaKey: "extraerReferencia", unwrap: (r) => r, maxTokens: 700 };
}

// Convierte la evidencia ya curada (referencias aceptadas, sintesis y MDE) en
// borradores de seccion listos para adaptar a un manuscrito, mas una tabla
// comparativa de fuentes. Cada afirmacion se ancla a las fuentes reales por [n];
// nunca inventa resultados ni citas (mismo principio que mde y sintesis).
function buildBorradores(p) {
  const idea = p.idea || {};
  const preg = p.pregunta || {};
  const refs = Array.isArray(p.referencias) ? p.referencias : [];
  const lista = refs
    .map((r, i) => {
      const n = i + 1;
      return (
        `[${n}] ${s(r.titulo)} (${s(r.autores)}, ${s(r.anio)})\n` +
        `    Resumen: ${s(r.resumen)}\n` +
        `    Aporte: ${s(r.justificacion)}`
      );
    })
    .join("\n");
  const sint = Array.isArray(p.sintesis) ? p.sintesis : [];
  const sintTxt = sint
    .map((h) => `- (${s(h.tipo)}) ${s(h.hallazgo)} [fuentes: ${(Array.isArray(h.fuentes) ? h.fuentes : []).join(", ")}]`)
    .join("\n");
  const mde = Array.isArray(p.mde) ? p.mde : [];
  const mdeTxt = mde.map((d) => `- ${s(d.dimension)}: ${s(d.criterio_adoptado)}`).join("\n");
  const system =
    "Eres un asistente de redaccion cientifica. Conviertes evidencia ya curada en borradores de secciones de un manuscrito. Cada afirmacion que dependa de la literatura debe citar, con marcadores del tipo [n], el numero de la o las fuentes que la sostienen, usando solo numeros que aparezcan en la lista provista. Nunca inventas resultados, cifras ni fuentes: si algo no esta sostenido por los resumenes provistos, no lo afirmas. Los borradores son un punto de partida que el investigador debe revisar y editar, no un texto final. Respondes unicamente con datos estructurados.";
  const user =
    `Tema: ${s(idea.tema)}\n` +
    `Pregunta principal: ${s(preg.pregunta_principal)}\n` +
    `Objetivo general: ${s(preg.objetivo_general)}\n\n` +
    `Referencias aceptadas (numeradas):\n${lista}\n\n` +
    (sintTxt ? `Sintesis de evidencia ya generada:\n${sintTxt}\n\n` : "") +
    (mdeTxt ? `Criterios de la Matriz de Decision ya adoptados:\n${mdeTxt}\n\n` : "") +
    "Redacta, en espanol y especifico a este proyecto, cuatro borradores de parrafo listos para adaptar a un manuscrito, uno por cada componente del trabajo: " +
    "'justificacion' (justificacion y brecha, para la introduccion), 'metodos' (que enfoques metodologicos sostiene la evidencia y como se justifica el propio), 'comparacion' (comparacion de resultados entre las fuentes) y 'discusion' (discusion y contraste: donde la literatura concuerda o discrepa y como se posiciona el aporte). " +
    "Cada parrafo debe citar sus fuentes con marcadores [n]. Usa los corchetes UNICAMENTE para citar numeros de fuentes (por ejemplo [1] o [2, 3]); nunca los uses para anotaciones, notas al editor ni comentarios como '[criterio adoptado]'. Ademas, genera 'tabla_comparativa' con una fila por cada fuente aceptada relevante: 'fuente' es su numero, 'enfoque' resume su metodo o angulo en pocas palabras, 'hallazgo_principal' su resultado central, y 'limitacion' su alcance o limitacion segun el resumen. No inventes contenido que las fuentes no puedan sostener; si un resumen no da informacion para una celda, se breve y honesto.";
  return { system, user, schemaKey: "borradores", unwrap: (r) => r, maxTokens: 3200 };
}

const BUILDERS = {
  friccion: buildFriccion,
  pregunta: buildPregunta,
  mapa: buildMapa,
  divulgacion: buildDivulgacion,
  notas: buildNotas,
  mde: buildMde,
  sintesis: buildSintesis,
  reenfoque: buildReenfoque,
  extraerReferencia: buildExtraerReferencia,
  borradores: buildBorradores
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

  const { system, user, schemaKey, unwrap, maxTokens } = builder(payload);

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
        max_tokens: maxTokens || 1600,
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
    if (data.stop_reason === "max_tokens") {
      console.error("Respuesta truncada por max_tokens en tarea:", task);
      res.status(502).json({ error: "La respuesta del agente quedo incompleta. Intenta de nuevo." });
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
