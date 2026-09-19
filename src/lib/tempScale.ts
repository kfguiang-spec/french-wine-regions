/** Map growing-season °C to a light choropleth fill (cool → warm). */
export function tempFill(c: number | null | undefined, selected: boolean): string {
  if (c == null) return selected ? '#ddd' : '#f5f5f5'
  // Typical range for our stations: ~15.5–20.8 growing season
  const t = Math.min(1, Math.max(0, (c - 15) / 6))
  // grayscale: cooler = lighter, warmer = darker (readable on white)
  const g = Math.round(245 - t * 130)
  if (selected) return `rgb(${Math.max(0, g - 40)}, ${Math.max(0, g - 40)}, ${Math.max(0, g - 40)})`
  return `rgb(${g}, ${g}, ${g})`
}

export function formatTemp(c: number | null | undefined): string {
  if (c == null || Number.isNaN(c)) return '—'
  return `${c.toFixed(1)} °C`
}
