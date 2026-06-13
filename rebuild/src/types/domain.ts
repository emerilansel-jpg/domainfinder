export interface Domain {
  id: string
  fqdn: string
  sld: string
  tld: string
  source: 'auction' | 'dropped' | 'pending_delete' | 'closeout'
  sourceStatus: string
  price: number | null
  auctionEndAt: string | null
  brandScore: number
  seoScore: number
  confidence: number
  flags: Flag[]
  signals: Signal[]
  archiveInfo: ArchiveInfo | null
  isSaved: boolean
}

export interface Flag {
  type: 'positive' | 'negative' | 'warning'
  severity: 'low' | 'medium' | 'high'
  label: string
  description: string
}

export interface Signal {
  key: string
  value: number
  status: 'core' | 'premium' | 'launch_soon'
  weight: number
  tier: string
  explanation: string
}

export interface ArchiveInfo {
  snapshots: number
  firstSeen: string
  age: number
}

export interface FilterState {
  keyword: string
  tlds: string[]
  minLength: number
  maxLength: number
  hasHyphen: boolean | null
  hasNumber: boolean | null
  minBrandScore: number
  maxBrandScore: number
  minSeoScore: number
  maxSeoScore: number
  minPrice: number | null
  maxPrice: number | null
  sources: string[]
  cleanHistory: boolean
  hasArchive: boolean
}

export interface SortState {
  field: 'brandScore' | 'seoScore' | 'totalScore' | 'price' | 'age' | 'name'
  direction: 'asc' | 'desc'
}
