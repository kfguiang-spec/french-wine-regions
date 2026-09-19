import { useEffect, useMemo, useState } from 'react'
import regionsMeta from './data/regions.json'
import { DetailPanel } from './components/DetailPanel'
import { FranceMap } from './components/FranceMap'
import { RegionList } from './components/RegionList'
import type { TempUnit } from './lib/tempScale'
import type { ClimateFile, RegionMeta, RegionView } from './lib/types'

const META = regionsMeta as RegionMeta[]

export default function App() {
  const [climate, setClimate] = useState<ClimateFile | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>('bordeaux')
  const [sortBy, setSortBy] = useState<'name' | 'annual' | 'growing'>('growing')
  const [unit, setUnit] = useState<TempUnit>('F')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setLoadError(null)
      try {
        const base = import.meta.env.BASE_URL
        const res = await fetch(`${base}data/climate.json`)
        if (!res.ok) throw new Error(`Failed to load climate.json (${res.status})`)
        const data = (await res.json()) as ClimateFile
        if (!cancelled) setClimate(data)
      } catch (e) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : 'Failed to load climate data')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const regions: RegionView[] = useMemo(() => {
    const byId = new Map(climate?.regions.map((c) => [c.id, c]) ?? [])
    return META.map((m) => ({ ...m, climate: byId.get(m.id) ?? null }))
  }, [climate])

  const sorted = useMemo(() => {
    const copy = [...regions]
    copy.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      const av =
        sortBy === 'annual' ? a.climate?.annual_mean_c : a.climate?.growing_season_mean_c
      const bv =
        sortBy === 'annual' ? b.climate?.annual_mean_c : b.climate?.growing_season_mean_c
      if (av == null && bv == null) return 0
      if (av == null) return 1
      if (bv == null) return -1
      return av - bv
    })
    return copy
  }, [regions, sortBy])

  const selected = regions.find((r) => r.id === selectedId) ?? null

  return (
    <div className="app">
      <header className="header">
        <div className="header-row">
          <h1>French wine regions</h1>
          <p className="tagline">Major AOCs · real climate normals · typical grapes</p>
        </div>
        <div className="header-controls">
          <nav className="toolbar" aria-label="Related projects">
            <a href="https://kfguiang-spec.github.io/wset-tasting-guide/">WSET tasting guide</a>
            <span className="sep">·</span>
            <a href="https://kfguiang-spec.github.io/grape-lineage/">Grape lineage</a>
          </nav>
          <div className="unit-toggle" role="group" aria-label="Temperature unit">
            <span className="muted">Temp:</span>
            <button
              type="button"
              className={unit === 'F' ? 'active' : ''}
              aria-pressed={unit === 'F'}
              onClick={() => setUnit('F')}
            >
              °F
            </button>
            <button
              type="button"
              className={unit === 'C' ? 'active' : ''}
              aria-pressed={unit === 'C'}
              onClick={() => setUnit('C')}
            >
              °C
            </button>
          </div>
        </div>
      </header>

      {loading ? <p className="banner muted">Loading climate data…</p> : null}
      {loadError ? <p className="banner error">{loadError}</p> : null}

      <main className="main">
        <section className="map-panel" aria-label="Map">
          <FranceMap regions={regions} selectedId={selectedId} unit={unit} onSelect={setSelectedId} />
          <p className="map-hint muted">
            Markers colored by growing-season mean (Apr–Oct). Click a marker or a row.
          </p>
        </section>

        <section className="list-panel" aria-label="Region list">
          <RegionList
            regions={sorted}
            selectedId={selectedId}
            sortBy={sortBy}
            unit={unit}
            onSelect={setSelectedId}
            onSort={setSortBy}
          />
        </section>

        <DetailPanel
          region={selected}
          unit={unit}
          climateMeta={
            climate
              ? {
                  source: climate.source,
                  methodology: climate.methodology,
                  fetched_at: climate.fetched_at,
                }
              : null
          }
        />
      </main>

      <footer className="footer">
        <p>
          Climate: <a href="https://open-meteo.com/">Open-Meteo</a> Historical Weather API (ERA5),
          1991–2020 daily means at representative stations — see{' '}
          <code>public/data/climate.json</code> (stored in °C; display converts to °F when selected).{' '}
          {climate ? (
            <>
              Period {climate.regions[0]?.period.start}–{climate.regions[0]?.period.end}.
            </>
          ) : null}
        </p>
        <p className="muted">
          Grapes: curated educational summary (WSET-level classics), not exhaustive plantings. Map
          outline is schematic. Soft blue→amber map colors show relative growing-season warmth only.
        </p>
        <p className="muted">
          {climate?.citation ??
            'ERA5 via Open-Meteo. Cite Hersbach et al. (2023), doi:10.24381/cds.adbb2d47.'}
        </p>
      </footer>
    </div>
  )
}
