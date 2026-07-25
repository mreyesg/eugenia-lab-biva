# ACS Poster (English) — EugenIA Lab

Poster en ingles para el congreso de ACS, construido sobre la plantilla que
entrego Manuel (`src/plantilla_ACS_original.pptx`, 36 x 48 pulgadas, vertical).

Igual que el poster en espanol y la ponencia, **esto es codigo**: no se edito a
mano en PowerPoint.

## Regenerar

```
cd poster/acs_en/src
python -m pip install python-pptx
python construir.py
```

Escribe `ACS_Poster_EugenIA_Lab_EN.pptx` en `src/`, hay que copiarlo un nivel
arriba. Requiere que exista la carpeta `capturas/` con las figuras; si no esta,
se regenera con los dos scripts de Playwright (ver abajo).

## Decisiones de contenido (2026-07-25, confirmadas con Manuel)

- **Nombres:** EugenIA y EugenIA Lab. El borrador de la plantilla (noviembre 2025)
  usaba "Bibliometric AI" y "GAIA-AVAT ecosystem", nombres anteriores al marco actual.
- **Enfoque:** investigacion primero. Las secciones llevan el caso quimico; la app
  aparece como el instrumento, con QR para probarla.
- **Curso:** solo CIFI 4996. El borrador decia CIFI 4074.

## Las figuras son capturas reales, no maquetas

`src/capturas.mjs` y `src/mde.mjs` manejan la app **en produccion** con Playwright
en viewport de iPhone 13, con el caso real de Plectranthus. `mde.mjs` retoma el
estado guardado (`estado.json`) para no repetir busquedas ni gastar llamadas al
modelo de nuevo.

Detalle util si hay que rehacerlas: la app guarda las referencias como `pendiente`
al anadirlas, y exige un **Aceptar** explicito del investigador. La MDE no se
habilita hasta que hay referencias con `estado === "aceptada"`. Ademas hay que
esperar a que desaparezca el indicador de carga, no a que el boton Continuar se
habilite: ese ya esta habilitado desde antes.

## Pendiente, solo Manuel

- **Logo de ACS.** Sigue como marcador de texto. El de la UPR ya esta incorporado
  (`src/logo_upr.jpg`, cuadrado 900x900, colocado a escala 1:1 para no deformarlo).
- **Referencias.** Hay una nota honesta sobre bases de datos y disponibilidad de
  datos, no una lista numerada. No se inventaron referencias.
- **Idioma de las figuras.** La app corre en espanol, asi que las capturas muestran
  interfaz en espanol dentro de un poster en ingles. Decision pendiente de Manuel.

## Dato corregido, importante

`CLAUDE.md` registra "constante dielectrica de los solventes de mejor rendimiento:
0.7-0.9". Esos valores **no son constantes dielectricas** (etanol ~24, agua ~80):
corresponden a **polaridad relativa** normalizada (etanol 0.654, metanol 0.762,
agua 1.000). Se omitio del poster para no publicar un error que un quimico en ACS
notaria de inmediato. Vale corregir la etiqueta en `CLAUDE.md`.

## Verificacion

Verificado visualmente exportando a PNG con PowerPoint COM (no hay LibreOffice en
esta maquina) e inspeccionando la imagen, en tres rondas. La primera tenia
desbordes de texto, paneles de color invisibles por z-order, y las divisorias
horizontales de la plantilla atravesando parrafos como tachones. La version
guardada (`ACS_Poster_EugenIA_Lab_EN_preview.png`) es la que quedo limpia.
