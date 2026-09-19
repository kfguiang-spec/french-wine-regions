export type RegionMeta = {
  id: string
  name: string
  nameFr: string
  station: string
  lat: number
  lon: number
  blurb: string
  red: string[]
  white: string[]
  parentId?: string
}

export type ClimateRegion = {
  id: string
  station: string
  requested: { lat: number; lon: number }
  grid: { latitude: number; longitude: number; elevation_m: number }
  period: { start: string; end: string }
  model: string
  units: string
  annual_mean_c: number
  growing_season_mean_c: number
  growing_season_months: string
  sample_days: number
  growing_season_days: number
}

export type ClimateFile = {
  fetched_at: string
  source: string
  attribution: string
  citation: string
  methodology: string
  regions: ClimateRegion[]
}

export type RegionView = RegionMeta & {
  climate: ClimateRegion | null
}

export type ViewLevel = 'france' | 'bordeaux'
