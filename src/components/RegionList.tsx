import type { RegionView } from '../lib/types'
import { formatTemp, type TempUnit, unitLabel } from '../lib/tempScale'

type Props = {
  regions: RegionView[]
  selectedId: string | null
  sortBy: 'name' | 'annual' | 'growing'
  unit: TempUnit
  onSelect: (id: string) => void
  onSort: (s: 'name' | 'annual' | 'growing') => void
}

export function RegionList({ regions, selectedId, sortBy, unit, onSelect, onSort }: Props) {
  const u = unitLabel(unit)
  return (
    <div className="region-list">
      <div className="list-toolbar">
        <span className="muted">Sort:</span>
        <button type="button" className={sortBy === 'name' ? 'active' : ''} onClick={() => onSort('name')}>
          Name
        </button>
        <button
          type="button"
          className={sortBy === 'annual' ? 'active' : ''}
          onClick={() => onSort('annual')}
        >
          Annual {u}
        </button>
        <button
          type="button"
          className={sortBy === 'growing' ? 'active' : ''}
          onClick={() => onSort('growing')}
        >
          Growing {u}
        </button>
      </div>
      <p className="list-units muted">Shown: annual · growing season ({u})</p>
      <ul>
        {regions.map((r) => (
          <li key={r.id}>
            <button
              type="button"
              className={`region-row ${r.id === selectedId ? 'selected' : ''}`}
              onClick={() => onSelect(r.id)}
            >
              <span className="region-name">
                {r.name}
                <span className="muted fr"> {r.nameFr !== r.name ? `(${r.nameFr})` : ''}</span>
              </span>
              <span className="temps">
                <span title={`Annual mean 1991–2020 (${u})`}>
                  {formatTemp(r.climate?.annual_mean_c, unit)}
                </span>
                <span className="sep">·</span>
                <span title={`Growing season Apr–Oct mean (${u})`}>
                  {formatTemp(r.climate?.growing_season_mean_c, unit)}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
