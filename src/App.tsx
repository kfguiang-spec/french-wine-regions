import { useEffect, useMemo, useState } from 'react'
import bordeauxMeta from './data/bordeaux-subregions.json'
import regionsMeta from './data/regions.json'
import { BordeauxMap } from './components/BordeauxMap'
import { DetailPanel } from './components/DetailPanel'
import { FranceMap } from './components/FranceMap'
import { RegionList } from './components/RegionList'
import type { TempUnit } from './lib/tempScale'
import type { ClimateFile, RegionMeta, RegionView, ViewLevel } from './lib/types'

const FRANCE = regionsMeta as RegionMeta[]
const BORDEAUX = bordeauxMeta as RegionMeta[]

function sortRegions(
  regions: RegionView[],
  sortBy: 'name' | 'annual' | 'growing',
): RegionView[] {
  const copy = [...regions]
  copy.sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    const av = sortBy === 'annual' ? a.climate?.annual_mean_c : a.climate?.growing_season_mean_c
    const bv = sortBy === 'annual' ? b.climate?.annual_mean_c : b.climate?.growing_season_mean_c
    if (av == null && bv == null) return 0
    if (av == null) return 1
    if (bv == null) return -1
    return av - bv
  })
  return copy
}

export default function App() {
  const [climate, setClimate] = useState<ClimateFile | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<ViewLevel>('france')
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

  const climateById = useMemo(() => {
    return new Map(climate?.regions.map((c) => [c.id, c]) ?? [])
  }, [climate])

  const franceRegions: RegionView[] = useMemo(
    () => FRANCE.map((m) => ({ ...m, climate: climateById.get(m.id) ?? null })),
    [climateById],
  )

  const bordeauxRegions: RegionView[] = useMemo(
    () => BORDEAUX.map((m) => ({ ...m, climate: climateById.get(m.id) ?? null })),
    [climateById],
  )

  const activeList = view === 'france' ? franceRegions : bordeauxRegions
  const sorted = useMemo(() => sortRegions(activeList, sortBy), [activeList, sortBy])
  const selected = activeList.find((r) => r.id === selectedId) ?? null

  function enterBordeaux() {
    setView('bordeaux')
    setSelectedId(bordeauxRegions[0]?.id ?? 'medoc')
  }

  function backToFrance() {
    setView('france')
    setSelectedId('bordeaux')
  }

  function handleActivate(id: string) {
    if (id === 'bordeaux') enterBordeaux()
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-row">
          <h1>{view === 'france' ? 'French wine regions' : 'Bordeaux sub-regions'}</h1>
          <p className="tagline">
            {view === 'france'
              ? 'Major AOCs · real climate normals · typical grapes'
              : 'PoC drill-down · Open-Meteo station temps · typical grapes'}
          </p>
        </div>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          {view === 'france' ? (
            <span>France</span>
          ) : (
            <>
              <button type="button" className="linkish" onClick={backToFrance}>
                France
              </button>
              <span className="sep">→</span>
              <span>Bordeaux</span>
              <button type="button" className="back-btn" onClick={backToFrance}>
                ← Back
              </button>
            </>
          )}
        </nav>
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
          {view === 'france' ? (
            <FranceMap
              regions={franceRegions}
              selectedId={selectedId}
              unit={unit}
              onSelect={setSelectedId}
              onActivate={handleActivate}
            />
          ) : (
            <BordeauxMap
              regions={bordeauxRegions}
              selectedId={selectedId}
              unit={unit}
              onSelect={setSelectedId}
            />
          )}
          <p className="map-hint muted">
            {view === 'france'
              ? 'Single-click selects. Double-click Bordeaux (or use Explore) for sub-regions.'
              : 'Schematic Gironde map — markers by growing-season mean. Click a sub-region.'}
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
            onActivate={view === 'france' ? handleActivate : undefined}
            activatableIds={view === 'france' ? ['bordeaux'] : []}
          />
        </section>

        <DetailPanel
          region={selected}
          unit={unit}
          showExploreBordeaux={view === 'france' && selectedId === 'bordeaux'}
          onExploreBordeaux={enterBordeaux}
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
          1991–2020 daily means — <code>public/data/climate.json</code> (stored °C; display converts).{' '}
          {climate ? (
            <>
              Period {climate.regions[0]?.period.start}–{climate.regions[0]?.period.end}.
            </>
          ) : null}
        </p>
        <p className="muted">
          Grapes: curated educational summary. Bordeaux drill-down is a PoC (Médoc point = Pauillac).
          Soft blue→amber colors show relative growing-season warmth.
        </p>
        <p className="muted">
          {climate?.citation ??
            'ERA5 via Open-Meteo. Cite Hersbach et al. (2023), doi:10.24381/cds.adbb2d47.'}
        </p>
      </footer>
    </div>
  )
}
