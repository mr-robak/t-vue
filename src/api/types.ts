export interface Show {
  id: number
  url: string
  name: string
  type: string
  language?: string
  genres: string[]
  status: string
  runtime?: number
  averageRuntime?: number
  premiered?: string
  ended?: string
  officialSite?: string
  schedule: Schedule
  rating: Rating
  weight: number
  network?: Network
  webChannel?: WebChannel
  dvdCountry?: Country
  externals: Externals
  image?: ImageVariants | null
  summary?: string
  updated: number
  _links: Links
}

export interface ShowDetails extends Show {
  _embedded: Embedded
}

export interface Embedded {
  images: Image[]
  seasons: Season[]
  cast: Cast[]
}

export interface Cast {
  person: Person
  character: Character
  self: boolean
  voice: boolean
}

export interface Person {
  id: number
  url: string
  name: string
  country: Country
  birthday: string
  deathday: string
  gender: string
  image: ImageVariants
  updated: number
  _links: Links
}

export interface Character {
  id: number
  url: string
  name: string
  image: ImageVariants
  _links: ImageVariants
}

export interface Season {
  id: number
  url: string
  number: number
  name: string
  episodeOrder: number
  premiereDate: string
  endDate: string
  network: Network
  webChannel: WebChannel
  image: ImageVariants
  summary?: string
  _links: Links
}
export interface Image {
  id: number
  type: string
  main: boolean
  resolutions: ImageResolutions
}

export interface ImageResolutions {
  original: ImageDetails
  medium?: ImageDetails
}

export interface ImageDetails {
  url: string
  width: number
  height: number
}

export interface Schedule {
  time: string
  days: string[]
}

export interface Rating {
  average?: number
}

export interface Network {
  id: number
  name: string
  country: Country
  officialSite?: string
}

export interface Country {
  name: string
  code: string
  timezone: string
}

export interface WebChannel {
  id: number
  name: string
  country?: Country
  officialSite?: string
}

export interface Externals {
  tvrage?: number
  thetvdb?: number
  imdb?: string
}

export interface ImageVariants {
  medium: string
  original: string
}

export interface Links {
  self: Self
  previousepisode?: Previousepisode
  nextepisode?: Nextepisode
}

export interface Self {
  href: string
}

export interface Previousepisode {
  href: string
  name: string
}

export interface Nextepisode {
  href: string
  name: string
}

export interface SearchResult {
  score: number
  show: Show
}
