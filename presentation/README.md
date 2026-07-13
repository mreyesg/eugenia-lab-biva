# Presentación: desarrollo de Biblioteca Viva

Ponencia sobre el desarrollo, validación, alcance, limitaciones y fortalezas de la app Biblioteca Viva. Enfoque metodológico: pensada como base para explicar la app en un congreso y como punto de partida para una publicación sobre desarrollo de aplicaciones de IA para la investigación científica.

## Es un documento vivo

La idea es actualizarla a lo largo del desarrollo, no escribirla de golpe al final. Cada slide con contenido futuro que aún no existe lleva un marcador visible **PENDIENTE** (en color tierra). Al cerrar cada hito de desarrollo, conviene revisar esos marcadores y rellenarlos con lo que ya sea real. Marcadores activos hoy:

- Estado de las fases C y D de construcción (slide de hoja de ruta).
- Resultados de la prueba en frío con Kamila usando la app sola (slide de hallazgos de validación). Es la validación más importante y todavía está pendiente.
- Sede o revista de la publicación metodológica (slide de trabajo futuro).

## La presentación es código

Igual que el póster, el `.pptx` se genera con un script de `pptxgenjs`, no se edita a mano en PowerPoint. El script fuente es `src/build_presentation.js`. Para regenerar:

```
cd presentation/src
npm install pptxgenjs
node build_presentation.js
```

Esto escribe `presentation/Presentacion_Biblioteca_Viva.pptx` (24 slides, 16:9). Editar el `.pptx` a mano se perdería en la próxima regeneración: los cambios de contenido van en el script.

## Reglas de estilo aplicadas

- Nunca guiones largos (em-dash) en ningún texto, regla general del proyecto. Se usan comas, dos puntos o punto y aparte.
- Reglas de pptx (el skill `pptx` no está disponible en esta máquina, se aplicaron a mano): nunca `#` en colores hex, nunca reutilizar el mismo objeto de opciones entre llamadas, `bullet: true` en vez de viñetas unicode.
- Misma identidad visual que el póster y la app: verde bosque, musgo, crema, acento tierra; tipografía Cambria (display) y Calibri (cuerpo), que son seguras en cualquier PowerPoint.

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
├── README.md                          (este archivo)
├── Presentacion_Biblioteca_Viva.pptx  (salida generada; regenerable desde el script)
└── src/
    └── build_presentation.js          (script fuente; editar y correr esto para cambios)
```
