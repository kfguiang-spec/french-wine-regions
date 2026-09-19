# French wine regions

Interactive proof-of-concept: major **French wine regions**, **real climate normals** from [Open-Meteo](https://open-meteo.com/), and **typical grape varieties** (educational summary).

**Live:** https://kfguiang-spec.github.io/french-wine-regions/

Related: [WSET tasting guide](https://kfguiang-spec.github.io/wset-tasting-guide/) · [Grape lineage](https://kfguiang-spec.github.io/grape-lineage/)

## Features

- List + schematic SVG map of major regions (Bordeaux, Burgundy, Champagne, Loire, Rhône, Alsace, Provence, Languedoc-Roussillon, Beaujolais, Jura, Savoie, Southwest, Corsica)
- Sort by name, annual mean °C, or growing-season (Apr–Oct) mean °C
- Detail panel: temperatures, station coordinates, short factual blurb, red/white grapes
- Quiet UI: white background, black text, Arial/Helvetica

## Climate methodology (do not invent numbers)

Temperatures are **pre-fetched at build time** into `public/data/climate.json` so GitHub Pages does not depend on runtime CORS and values stay reproducible.

| Item | Detail |
|------|--------|
| API | [Open-Meteo Historical Weather](https://open-meteo.com/en/docs/historical-weather-api) (`archive-api.open-meteo.com/v1/archive`) |
| Model | **ERA5** (`models=era5`) |
| Variable | Daily `temperature_2m_mean` (°C) |
| Period | **1991-01-01 – 2020-12-31** (30-year climate normal window) |
| Annual mean | Average of all daily means in the period |
| Growing-season mean | Average of daily means for months **April–October** inclusive |
| Stations | Representative city / town per region (e.g. Bordeaux, Beaune, Reims, Tours, Avignon, Colmar, Aix-en-Provence, Montpellier, Villefranche-sur-Saône, Arbois, Chambéry, Cahors, Ajaccio) |

Refresh data:

```bash
npm run fetch:climate
```

Respect Open-Meteo free-tier rate limits (the script backs off on HTTP 429).

**Citation:** Hersbach et al. (2023). ERA5 hourly data on single levels from 1940 to present. ECMWF. https://doi.org/10.24381/cds.adbb2d47 — served via Open-Meteo.

## Grapes

Curated **typical / primary varieties** committed in `src/data/regions.json`, labeled in the UI as an educational summary (WSET-level classics). Not an exhaustive planting census; obscure varieties are omitted on purpose.

## Stack

Vite + React + TypeScript. Static JSON for climate and region metadata.

## Local development

```bash
npm install
npm run fetch:climate   # optional refresh
npm run dev
```

```bash
npm run build      # typecheck + production build (base /)
npm run preview
```

## Deploy (GitHub Pages)

Source on `main`. Built assets on **`gh-pages`** (Pages: branch `gh-pages` / root).

```bash
VITE_BASE=/french-wine-regions/ npm run build
# publish contents of dist/ to gh-pages branch
```

Or: `npm run build:pages`

## License

App code: MIT (or as otherwise noted). Climate data: Open-Meteo / ECMWF ERA5 terms. Grapes: educational summary only.
