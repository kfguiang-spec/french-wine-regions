import type { RegionView } from '../lib/types'
import { projectBordeaux } from '../lib/geo'
import { formatTemp, tempFill, type TempUnit, unitLabel } from '../lib/tempScale'

/** Rough Gironde estuary + Garonne/Dordogne schematic. */
const ESTUARY =
  'M 40 40 L 95 55 L 120 100 L 140 160 L 155 220 L 170 280 L 185 330 L 200 360 L 175 365 L 150 320 L 130 260 L 115 200 L 95 140 L 70 90 L 45 55 Z'
const GARONNE = 'M 155 220 L 200 250 L 250 290 L 300 330'
const DORDOGNE = 'M 155 200 L 220 190 L 280 175 L 330 160'

type Props = {
  regions: RegionView[]
  selectedId: string | null
  unit: TempUnit
  onSelect: (id: string) => void
}

export function BordeauxMap({ regions, selectedId, unit, onSelect }: Props) {
  return (
    <svg
      className="france-map bordeaux-map"
      viewBox="0 0 360 400"
      role="img"
      aria-label="Schematic map of Bordeaux wine sub-regions"
    >
      <path d={ESTUARY} fill="#f3f7fa" stroke="#111" strokeWidth="1.2" />
      <path d={GARONNE} fill="none" stroke="#99aab8" strokeWidth="3" strokeLinecap="round" />
      <path d={DORDOGNE} fill="none" stroke="#99aab8" strokeWidth="3" strokeLinecap="round" />
      <text x="55" y="30" fontSize="10" fill="#666">
        Gironde
      </text>
      <text x="250" y="310" fontSize="9" fill="#888">
        Garonne →
      </text>
      <text x="250" y="155" fontSize="9" fill="#888">
        Dordogne →
      </text>
      {regions.map((r) => {
        const { x, y } = projectBordeaux(r.lon, r.lat)
        const selected = r.id === selectedId
        const grow = r.climate?.growing_season_mean_c
        const rRadius = selected ? 13 : 10
        const label = r.name.length > 14 ? r.nameFr.split(' ')[0] : r.name
        return (
          <g
            key={r.id}
            className="map-marker"
            style={{ cursor: 'pointer' }}
            onClick={() => onSelect(r.id)}
          >
            <circle
              cx={x}
              cy={y}
              r={rRadius}
              fill={tempFill(grow, selected)}
              stroke="#111"
              strokeWidth={selected ? 2.5 : 1.25}
            />
            <title>
              {r.name}: growing season {formatTemp(grow, unit)}
            </title>
            <text x={x} y={y + rRadius + 11} textAnchor="middle" className="map-label" fontSize="8" fill="#111">
              {label}
            </text>
          </g>
        )
      })}
      <g className="map-legend" transform="translate(12, 360)">
        <text fontSize="10" fill="#666">
          Growing season {unitLabel(unit)} — cooler → warmer
        </text>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={i * 22}
            y={12}
            width={20}
            height={10}
            fill={tempFill(17 + i * 0.2, false)}
            stroke="#111"
            strokeWidth="0.5"
          />
        ))}
      </g>
    </svg>
  )
}
