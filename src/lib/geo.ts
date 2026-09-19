/** Simple equirectangular project for mainland France + Corsica. */
const LON0 = -5.5
const LON1 = 10.5
const LAT0 = 41.0
const LAT1 = 51.5

export function project(lon: number, lat: number): { x: number; y: number } {
  const x = ((lon - LON0) / (LON1 - LON0)) * 360
  const y = ((LAT1 - lat) / (LAT1 - LAT0)) * 420
  return { x, y }
}
