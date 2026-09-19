import type { RegionView } from '../lib/types'
import { projectFrance } from '../lib/geo'
import { formatTemp, tempFill, type TempUnit, unitLabel } from '../lib/tempScale'

const FRANCE_PATH =
  'M 95 55 L 130 42 L 165 48 L 195 40 L 230 55 L 255 70 L 275 95 L 290 130 L 295 165 L 285 200 L 270 235 L 255 270 L 240 300 L 220 330 L 200 350 L 175 365 L 150 370 L 125 360 L 100 340 L 80 310 L 65 280 L 55 250 L 48 220 L 45 185 L 52 150 L 60 120 L 72 90 Z'

type Props = {
  regions: RegionView[]
  selectedId: string | null
  unit: TempUnit
  onSelect: (id: string) => void
  onActivate: (id: string) => void
}

export function FranceMap({ regions, selectedId, unit, onSelect, onActivate }: Props) {
  return (
    <svg
      className="france-map"
      viewBox="0 0 360 420"
      role="img"
      aria-label="Map of major French wine regions colored by growing-season temperature"
    >
      <path d={FRANCE_PATH} className="france-outline" fill="#fafafa" stroke="#111" strokeWidth="1.5" />
      {regions.map((r) => {
        const { x, y } = projectFrance(r.lon, r.lat)
        const selected = r.id === selectedId
        const grow = r.climate?.growing_season_mean_c
        const rRadius = selected ? 14 : 11
        return (
          <g
            key={r.id}
            className="map-marker"
            style={{ cursor: 'pointer' }}
            onClick={() => onSelect(r.id)}
            onDoubleClick={(e) => {
              e.preventDefault()
              onActivate(r.id)
            }}
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
              {r.id === 'bordeaux' ? ' — double-click to explore sub-regions' : ''}
            </title>
            <text
              x={x}
              y={y + rRadius + 12}
              textAnchor="middle"
              className="map-label"
              fontSize="9"
              fill="#111"
            >
              {r.nameFr.length > 12 ? r.name : r.nameFr}
            </text>
          </g>
        )
      })}
      <g className="map-legend" transform="translate(12, 378)">
        <text fontSize="10" fill="#666">
          Growing season (Apr–Oct) {unitLabel(unit)} — cooler → warmer
        </text>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={i * 22}
            y={14}
            width={20}
            height={10}
            fill={tempFill(15 + i * 1.5, false)}
            stroke="#111"
            strokeWidth="0.5"
          />
        ))}
        <text x={0} y={38} fontSize="9" fill="#888">
          {formatTemp(15, unit)}
        </text>
        <text x={88} y={38} fontSize="9" fill="#888" textAnchor="end">
          {formatTemp(21, unit)}
        </text>
      </g>
    </svg>
  )
}
