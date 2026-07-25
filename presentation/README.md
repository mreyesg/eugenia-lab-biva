# Presentación: desarrollo de Biblioteca Viva

Ponencia sobre el desarrollo, validación, alcance, limitaciones y fortalezas de la app Biblioteca Viva. Enfoque metodológico: pensada como base para explicar la app en un congreso y como punto de partida para una publicación sobre desarrollo de aplicaciones de IA para la investigación científica.

## Es un documento vivo

La idea es actualizarla a lo largo del desarrollo, no escribirla de golpe al final. Cada slide con contenido futuro que aún no existe lleva un marcador visible **PENDIENTE** (en color tierra). Al cerrar cada hito de desarrollo, conviene revisar esos marcadores y rellenarlos con lo que ya sea real. Estado al cierre de esta ronda (2026-07-24, con tiempo de imprenta agotado, ver `lab/decision_log.md`):

- Fase D (pulido de lenguaje): primera pasada verificada pero no desplegada; falta desplegarla y una relectura humana antes del congreso (slide de hoja de ruta).
- "Compañero de defendibilidad" (Tus resultados + auditoría por dimensiones): construido y verificado el 2026-07-18; falta aprobación visual de Manuel y despliegue a producción (slide de diferenciación).
- Prueba en frío con Kamila usando la app sola: no llegó a tiempo. Se cierra esta ronda sin ese resultado; queda diferida explícitamente al próximo ciclo, no como una promesa abierta (slides de hallazgos de validación y de limitaciones).
- Sede o revista de la publicación metodológica: sin definir todavía, es trabajo posterior al congreso y no bloquea esta presentación (slide de trabajo futuro).

## La presentación es código

Igual que el póster, el `.pptx` se genera con un script de `pptxgenjs`, no se edita a mano en PowerPoint. El script fuente es `src/build_presentation.js`. Para regenerar:

```
cd presentation/src
npm install pptxgenjs
node build_presentation.js
```

Esto escribe `presentation/Presentacion_Biblioteca_Viva.pptx` (25 slides, 16:9). Editar el `.pptx` a mano se perdería en la próxima regeneración: los cambios de contenido van en el script.

## Dos versiones de tema visual

Mismo contenido y estructura exactos, dos paletas distintas para escoger según la audiencia:

- **`src/build_presentation.js`** (botánica, la misma identidad del póster y la app): verde bosque, musgo, crema, acento tierra. Genera `Presentacion_Biblioteca_Viva.pptx`.
- **`src/build_presentation_quimico.js`** (química, pedida el 2026-07-24 para dar más peso al contexto de química del caso Plectranthus): azul Prusia como primario (un pigmento de origen químico), teal de laboratorio como secundario, ámbar de mechero Bunsen como acento de nota/pendiente. Genera `Presentacion_Biblioteca_Viva_Quimico.pptx`.

Un cambio de contenido (texto de una slide, un marcador PENDIENTE, una fase actualizada) hay que aplicarlo en **ambos scripts**: son dos archivos independientes que hoy solo difieren en el bloque "Paleta", no un script con una sola fuente de verdad. Si diverge el mantenimiento, vale la pena refactorizar a un parámetro de tema en vez de dos copias.

## Reglas de estilo aplicadas

- Nunca guiones largos (em-dash) en ningún texto, regla general del proyecto. Se usan comas, dos puntos o punto y aparte.
- Reglas de pptx (el skill `pptx` no está disponible en esta máquina, se aplicaron a mano): nunca `#` en colores hex, nunca reutilizar el mismo objeto de opciones entre llamadas, `bullet: true` en vez de viñetas unicode.
- Identidad visual botánica (versión por defecto), igual que el póster y la app: verde bosque, musgo, crema, acento tierra. Identidad química (versión alterna): azul Prusia, teal, crema fría, acento ámbar. Ambas usan tipografía Cambria (display) y Calibri (cuerpo), seguras en cualquier PowerPoint.

## Verificación visual

En esta máquina no hay LibreOffice, pero sí PowerPoint. La revisión visual se hizo exportando las slides a PNG con automatización COM de PowerPoint y mirándolas una a una. Si se edita el script, hay que repetir esa revisión (los desbordes y traslapes no siempre se ven leyendo el código). Comando de referencia (PowerShell), que abre el `.pptx` y lo guarda como imágenes en una carpeta:

```
$app = New-Object -ComObject PowerPoint.Application
$p = $app.Presentations.Open("<ruta al .pptx>", $true, $false, $false)
$p.SaveAs("<carpeta de salida>", 18)   # 18 = ppSaveAsPNG
$p.Close(); $app.Quit()
```

## Estructura

```
presentation/
├── README.md                                  (este archivo)
├── Presentacion_Biblioteca_Viva.pptx          (tema botánico; regenerable desde el script)
├── Presentacion_Biblioteca_Viva_Quimico.pptx  (tema químico; regenerable desde el script)
└── src/
    ├── build_presentation.js                  (script del tema botánico)
    └── build_presentation_quimico.js          (script del tema químico)
```
