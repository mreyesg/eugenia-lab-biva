# Testing y verificación

Este proyecto **no tiene test suite automatizado, ni linter, ni typecheck**. Verificado por inspección directa el 2026-07-09: no hay `.eslintrc*`, `tsconfig.json`, `jest.config*`, `vitest.config*` en ningún `package.json` del proyecto fuera de `node_modules` (esos son de dependencias de terceros, no del proyecto). No hay `.github/workflows/`, así que tampoco hay CI.

No inventes `npm test` ni `npm run lint`: no existen. Lo de abajo es lo único real.

## Nivel 1 — sintaxis (automatizable, rápido, sin red)

Los únicos 3 archivos `.js` reales del proyecto (fuera de `node_modules` y de versiones históricas del póster) se pueden verificar con el propio Node, sin instalar nada:

```
node --check web/api/generate.js
node --check web/api/search.js
node --check poster/src/build_poster.js
```

Verificado en esta sesión (2026-07-09, Node v24.15.0): los 3 pasan. Esto es lo que automatiza `scripts/verify.sh`.

`web/index.html` tiene JS embebido en `<script>` inline, no en un `.js` separado, así que `node --check` no lo cubre. No hay una forma automatizada de verificar su sintaxis en este momento; la verificación es manual (abrirlo en navegador, ver la consola).

## Nivel 2 — smoke test de los endpoints (necesita `vercel dev` corriendo o la URL de producción)

Estos son comandos reales que se usaron y confirmaron esta sesión, no hipotéticos:

```
# Con "vercel dev" corriendo en background desde web/ (puerto 3000, o 3001 si 3000 está ocupado):
curl -s -X POST http://localhost:3000/api/generate \
  -H "content-type: application/json" \
  -d '{"task":"friccion","payload":{"idea":{"tema":"...","porque":"...","yaSe":"","noEntiendo":"","tension":""}}}'
```

Respuesta esperada si todo está bien configurado: un JSON con `opciones` (4 tensiones conceptuales). Si la clave no está disponible en el entorno correcto, responde `{"error":"El servidor no tiene configurada la clave de la API."}` con status 500 — ver más abajo por qué eso pasaba.

Chequeo más liviano, sin gastar tokens de la API de Claude (documentado ya en `lab/next_session.md`, confirmado que sigue siendo así):

```
curl -s https://TU-URL-DE-PRODUCCION/api/search
# Esperado: {"error":"Metodo no permitido"}  (porque solo acepta POST)
```

## Nivel 3 — verificación visual (manual, no automatizable con las herramientas actuales)

**Póster (`poster/src/build_poster.js`)**: `CLAUDE.md` documenta que el proyecto usa un skill de Anthropic llamado `pptx` con reglas específicas (nunca `#` en colores hex, no reutilizar objetos de opciones entre llamadas, `bullet: true` en vez de viñetas unicode) y un flujo de verificación visual: convertir el `.pptx` a PDF con LibreOffice, luego a imágenes con `pdftoppm`, e inspeccionar antes de dar por bueno el resultado.

Ese skill **no apareció en la lista de skills disponibles de esta sesión** (se revisó al arrancar este arnés). Si en una sesión futura tampoco está disponible, aplicar esas mismas reglas a mano y hacer la verificación visual igual, no saltarla: los errores de traslape/desbordamiento de texto en pptxgenjs son comunes y no siempre se ven solo leyendo el código.

**App (`web/index.html` o `app/biblioteca_viva_app.html`)**: navegar las 8 etapas en un navegador real (o headless) y confirmar que no hay errores de JavaScript en consola. Una sesión anterior ya hizo esto con Playwright headless para la versión artefacto; no hay evidencia de que se haya repetido para `web/index.html` con las funciones `/api/*` reales conectadas de punta a punta en un navegador (sí se probó vía `curl` directo a los endpoints).

## Por qué `vercel dev` fallaba antes al leer la API key (causa raíz, confirmada esta sesión)

No era un problema de formato del archivo `.env.local` (se comprobó bit a bit: encoding correcto, sin BOM, sin caracteres raros). La causa real: en Vercel, las variables de entorno están scoped por entorno (`Development`, `Preview`, `Production`), y `ANTHROPIC_API_KEY` solo estaba guardada para `Production` y `Preview`. `vercel dev` corre bajo el entorno `Development`, así que nunca la veía, sin importar lo que hubiera en `.env.local` a mano.

Se confirmó con `npx vercel env ls` (mostraba la clave solo en `Production, Preview`) y se corrigió con:
```
npx vercel env add ANTHROPIC_API_KEY development
```
Después de eso, hay que refrescar el archivo local con `npx vercel env pull .env.local` y reiniciar `vercel dev`. **Este paso de refresco quedó pendiente de confirmar al cierre de esta sesión** — ver `docs/handoff.md`.

## Qué falta si se quiere subir el nivel de verificación

- No hay ningún test automatizado que llame de verdad a la API de Claude y valide la forma de la respuesta (todo lo de Nivel 2 fue manual con `curl`).
- No hay verificación automatizada de que `web/index.html` funcione end-to-end contra `/api/generate` y `/api/search` reales (solo se probaron los endpoints por separado).
- No hay linter, así que errores de estilo o `var` sin usar no se detectan salvo por lectura manual.

Ninguno de estos faltantes se resolvió en este arnés porque resolverlos implica escribir tests reales o agregar dependencias nuevas al proyecto, que va más allá de "documentar lo que existe" y "crear una compuerta de verificación con lo real". Si se quiere, es la siguiente conversación.
