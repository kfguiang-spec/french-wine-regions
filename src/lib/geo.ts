/** Simple equirectangular project for mainland France + Corsica. */
const FR_LON0 = -5.5
const FR_LON1 = 10.5
const FR_LAT0 = 41.0
const FR_LAT1 = 51.5

export function projectFrance(lon: number, lat: number): { x: number; y: number } {
  const x = ((lon - FR_LON0) / (FR_LON1 - FR_LON0)) * 360
  const y = ((FR_LAT1 - lat) / (FR_LAT1 - FR_LAT0)) * 420
  return { x, y }
}

/** Zoomed Bordeaux / Gironde schematic. */
const BX_LON0 = -1.05
const BX_LON1 = 0.05
const BX_LAT0 = 44.4
const BX_LAT1 = 45.35

export function projectBordeaux(lon: number, lat: number): { x: number; y: number } {
  const x = ((lon - BX_LON0) / (BX_LON1 - BX_LON0)) * 360
  const y = ((BX_LAT1 - lat) / (BX_LAT1 - BX_LAT0)) * 380
  return { x, y }
}

/** @deprecated use projectFrance */
export const project = projectFrance
