# Visión de producto: de app pedagógica a herramienta de investigador

**Estado:** borrador para revisión de Manuel (2026-07-12). Nada de esto está implementado todavía; es el plano de la reestructuración.

## El problema que estamos corrigiendo

Hoy `web/` se lee como un tutorial para que un subgraduado aprenda a organizar una investigación. Manuel quiere que se sienta como una herramienta que un investigador graduado abre a mitad de un proyecto y percibe como una ventaja real. Meta: presentarla en el congreso del Colegio de Químicos de Puerto Rico a fin de julio 2026.

Lo fundamental, y lo que debe brillar, no es el acceso por QR: es la **obtención de las mejores fuentes bibliográficas para cada parte de una investigación en curso**, y el salto de esa evidencia curada a criterios concretos de metodología, comparación y discusión.

## Decisiones tomadas (Manuel, 2026-07-12)

1. **Función estrella para la demo:** la Matriz de Decisión (evidencia curada a criterios operativos). Pero las otras dos capacidades (evidencia evaluada por sección del manuscrito, y síntesis de consenso/contradicción/brecha) también deben lograrse en la app, no solo la MDE.
2. **Alcance:** reestructurar alrededor del motor bibliométrico, no solo re-nivelar.
3. **Audiencia:** ambos, subgraduado e investigador, pero con el modo de investigador al frente (la cara que se presenta y demuestra).

## El eje nuevo

El motor bibliométrico deja de ser el paso 5 de 8 y pasa a ser la columna vertebral. Todo lo demás lo alimenta o consume su salida.

Flujo propuesto (nombres de trabajo, sujetos a ajuste):

1. **Foco de investigación.** En modo investigador: pegar una pregunta o abstract existente y arrancar rápido. En modo guiado: el flujo actual de idea, fricción, pregunta (se conserva como andamiaje para quien lo necesita). Fricción y pregunta dejan de ser protagonistas y pasan a ser insumos.
2. **Componentes de la investigación.** Reemplaza el "mapa bibliográfico" abstracto (Conceptual, Contextual, Empírica, Metodológica, Crítica) por las partes reales de un trabajo publicable. Propuesta inicial de taxonomía, a confirmar con Manuel:
   - Justificación y brecha (Introducción)
   - Métodos (para elegir y defender la metodología propia)
   - Comparación de resultados (contra qué se mide el hallazgo)
   - Discusión y contraste (dónde la literatura concuerda o discrepa, para posicionar el aporte)
   - (opcional) Marco conceptual
3. **Motor bibliométrico evaluado.** Para cada componente, busca fuentes reales en OpenAlex (ya funciona), pero ahora enriquecidas con señales que un investigador respeta: tipo de estudio (revisión / primario / metodológico), citas, año, revista, acceso abierto, y una evaluación de Claude de qué tan fuerte es la fuente y para qué componente sirve. Nunca inventa citas. Esta es la capacidad de "evidencia por sección".
4. **Síntesis de evidencia.** Agrega las fuentes aceptadas y revela consenso, contradicción y brecha. Alimenta la justificación y la discusión. Esta es la capacidad de "síntesis".
5. **Matriz de Decisión (clímax de la demo).** Traduce la evidencia curada en criterios operativos. Claude propone, de forma adaptable al dominio, las dimensiones de decisión relevantes para ESTE trabajo (para química: solvente, método de extracción, rangos; para otro campo, otras dimensiones), cada celda sostenida por las fuentes reales aceptadas y enlazada a su DOI. La innovación es una matriz de decisión fundamentada en evidencia, adaptable a cualquier campo, sin citas inventadas.
6. **Salida para publicar.** Convierte todo lo anterior en material citado y listo para usar según el formato (póster, presentación, paper): borrador de párrafo de métodos, tabla comparativa, andamiaje de discusión, todo anclado a las fuentes reales.

Las notas de lectura (paso 6 actual, ya con sugerencia de IA opcional) se integran como anotación por fuente. La reflexión pasa a ser opcional en el modo investigador.

## Secuencia de construcción (cada fase deja algo demostrable)

- **Fase A, crítica para la demo:** reencuadrar componentes del manuscrito, enriquecer el motor con señales bibliométricas y evaluación de fuerza por componente, y construir el generador de la MDE que consume las referencias aceptadas. Al terminar esta fase, la demo del clímax ya funciona de punta a punta.
- **Fase B:** síntesis de evidencia (consenso, contradicción, brecha).
- **Fase C:** salidas para publicar por formato, con citas reales.
- **Fase D:** modo de entrada (investigador vs guiado) y pulido de lenguaje a tono de investigador en toda la app.

Orden pensado para que, si el tiempo aprieta antes del congreso, lo que sí esté listo sea justo el clímax (Fase A) y no las piezas de soporte.

## Principios que no se negocian

- Nunca inventar citas: toda fuente viene de OpenAlex, con DOI real. Vale para la MDE y para las salidas de publicación.
- La curaduría crítica y la decisión final son del investigador. La IA propone y evalúa; el humano acepta, edita y decide. Mismo principio que ya rige el paso 6.
- Sin guiones largos en ningún texto (preferencia de estilo del proyecto).

## Preguntas abiertas antes de codificar Fase A

1. ¿La taxonomía de componentes de arriba es la correcta para tu audiencia, o la ajustamos? (por ejemplo, si quieres separar Marco conceptual, o fundir Comparación con Discusión).
2. ¿Las dimensiones de la MDE deben ser siempre generadas por IA según el campo, o quieres un conjunto fijo pensado para química como opción por defecto?
