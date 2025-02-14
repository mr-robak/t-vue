export interface Show {
  _links: Links
  averageRuntime: number
  dvdCountry: string
  ended?: string
  externals: Externals
  genres: string[]
  id: number
  image: Image
  language: string
  name: string
  network?: Network
  officialSite?: string
  premiered: string
  rating: Rating
  runtime?: number
  schedule: Schedule
  status: string
  summary: string
  type: string
  updated: number
  url: string
  webChannel?: WebChannel
  weight: number
}

export interface Links {
  previousepisode: Previousepisode
  self: Self
  nextepisode?: Nextepisode
}

export interface Previousepisode {
  href: string
  name: string
}

export interface Self {
  href: string
}

export interface Nextepisode {
  href: string
  name: string
}

export interface Externals {
  imdb?: string
  thetvdb?: number
  tvrage: number
}

export interface Image {
  medium: string
  original: string
}

export interface Network {
  country: Country
  id: number
  name: string
  officialSite?: string
}

export interface Country {
  code: string
  name: string
  timezone: string
}

export interface Rating {
  average?: number
}

export interface Schedule {
  days: string[]
  time: string
}

export interface WebChannel {
  country: Country2
  id: number
  name: string
  officialSite: string
}

export interface Country2 {
  code: string
  name: string
  timezone: string
}
