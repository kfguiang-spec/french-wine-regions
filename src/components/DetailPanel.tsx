import type { RegionView } from '../lib/types'
import { formatTemp } from '../lib/tempScale'

type Props = {
  region: RegionView | null
  climateMeta: { source: string; methodology: string; fetched_at: string } | null
}

export function DetailPanel({ region, climateMeta }: Props) {
  if (!region) {
    return (
      <aside className="detail">
        <p className="muted">Select a region on the map or in the list to see temperatures and typical grapes.</p>
      </aside>
    )
  }

  const c = region.climate
  return (
    <aside className="detail">
      <h2>
        {region.name}
        {region.nameFr !== region.name ? (
          <span className="muted"> · {region.nameFr}</span>
        ) : null}
      </h2>
      <p className="blurb">{region.blurb}</p>

      <h3>Temperature</h3>
      {c ? (
        <dl className="temp-dl">
          <div>
            <dt>Annual mean</dt>
            <dd>{formatTemp(c.annual_mean_c)}</dd>
          </div>
          <div>
            <dt>Growing season ({c.growing_season_months})</dt>
            <dd>{formatTemp(c.growing_season_mean_c)}</dd>
          </div>
          <div>
            <dt>Station (representative)</dt>
            <dd>
              {c.station} ({c.requested.lat.toFixed(2)}°N, {c.requested.lon.toFixed(2)}°
              {c.requested.lon >= 0 ? 'E' : 'W'})
            </dd>
          </div>
          <div>
            <dt>Period / model</dt>
            <dd>
              {c.period.start} – {c.period.end} · {c.model.toUpperCase()}
            </dd>
          </div>
        </dl>
      ) : (
        <p className="error">Climate data missing for this region.</p>
      )}
      {climateMeta ? (
        <p className="data-note muted">
          Means from daily 2&nbsp;m air temperature via Open-Meteo (ERA5). Pre-fetched at build time for
          reproducibility.
        </p>
      ) : null}

      <h3>Typical grape varieties</h3>
      <p className="data-note muted">Educational summary of primary / classic varieties — not an exhaustive planting list.</p>
      <div className="grape-cols">
        <div>
          <h4>Red</h4>
          <ul>
            {region.red.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>White</h4>
          <ul>
            {region.white.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  )
}
