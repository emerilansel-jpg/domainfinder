import type { Domain, Flag, Signal, ArchiveInfo } from '@/types/domain'

const DOMAIN_NAMES = [
  'techflow', 'brandvault', 'datahub', 'cloudpulse', 'webmatrix', 'digisphere',
  'netforge', 'codebase', 'apptrail', 'pixelnode', 'quantumix', 'synapsex',
  'neuralink', 'cryptoflow', 'blockvault', 'aistream', 'smartnode', 'logicflow',
  'devpulse', 'buildforge', 'launchpad', 'growthstack', 'scalernode', 'metricflow',
  'trackvault', 'funnelbase', 'convertly', 'clickstream', 'trafficflow', 'ranknode',
  'seohub', 'linkvault', 'backlinker', 'authorityx', 'domainly', 'nameforge',
  'brandable', 'memorix', 'wordflow', 'phrasehub', 'lexiconx', 'namingly',
  'textnode', 'copybase', 'contently', 'writeflow', 'scriptly', 'storyhub',
  'mediapulse', 'videoflow', 'streamly', 'watchnode', 'viewbase', 'tubely'
]

const TLDS = ['com', 'net', 'org', 'io', 'co', 'ai', 'app', 'dev', 'tech', 'digital']

const SOURCES = ['auction', 'dropped', 'pending_delete', 'closeout'] as const

const KEYWORDS = ['tech', 'data', 'cloud', 'ai', 'app', 'web', 'digital', 'brand', 'hub', 'flow', 'base', 'node', 'vault', 'pulse', 'stream', 'ly', 'ly', 'ify', 'able', 'ix']

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)]
}

function calculateBrandScore(sld: string, tld: string): { score: number; breakdown: any[]; flags: Flag[] } {
  const length = sld.length
  const hasHyphen = sld.includes('-')
  const hasNumber = /\d/.test(sld)
  const hasKeyword = KEYWORDS.some(k => sld.toLowerCase().includes(k))
  const premiumTlds = ['com', 'io', 'ai', 'co', 'app']
  const isPremiumTld = premiumTlds.includes(tld)
  const isDictionary = length >= 4 && length <= 10 && !hasHyphen && !hasNumber
  const pronounceability = !hasHyphen && !hasNumber && length <= 12 ? 1 : 0.5

  let score = 40
  if (length >= 5 && length <= 10) score += 15
  else if (length < 5) score += 8
  else score -= 8

  if (isPremiumTld) score += 12
  if (hasKeyword) score += 12
  if (hasHyphen) score -= 12
  if (hasNumber) score -= 10
  if (isDictionary) score += 10
  if (pronounceability === 1) score += 8

  score = Math.max(0, Math.min(100, score))

  const breakdown = [
    { category: 'Memorability', score: length >= 5 && length <= 10 ? 15 : 5, max: 15, explanation: length >= 5 && length <= 10 ? 'Optimal length for memorability' : 'Too short or too long' },
    { category: 'TLD Strength', score: isPremiumTld ? 12 : 4, max: 12, explanation: isPremiumTld ? 'Strong commercial TLD' : 'Niche or less trusted TLD' },
    { category: 'Keyword Quality', score: hasKeyword ? 12 : 0, max: 12, explanation: hasKeyword ? 'Contains relevant commercial keyword' : 'No keyword signals' },
    { category: 'Cleanliness', score: (!hasHyphen && !hasNumber) ? 12 : 2, max: 12, explanation: (!hasHyphen && !hasNumber) ? 'Clean, no hyphens or numbers' : 'Contains hyphens or numbers' },
    { category: 'Pronounceability', score: pronounceability === 1 ? 8 : 3, max: 8, explanation: pronounceability === 1 ? 'Easy to pronounce' : 'Difficult to pronounce' },
    { category: 'Commercial Appeal', score: isDictionary ? 10 : 5, max: 10, explanation: isDictionary ? 'Strong dictionary-like name' : 'Moderate commercial appeal' },
  ]

  const flags: Flag[] = []
  if (score >= 70) flags.push({ type: 'positive', severity: 'low', label: 'Strong Brand', description: 'High brand potential for commercial use' })
  if (hasHyphen) flags.push({ type: 'negative', severity: 'medium', label: 'Hyphen Present', description: 'Hyphens reduce memorability and brand value' })
  if (hasNumber) flags.push({ type: 'negative', severity: 'medium', label: 'Number Present', description: 'Numbers reduce brandability and type-in traffic' })
  if (isPremiumTld && score >= 60) flags.push({ type: 'positive', severity: 'low', label: 'Premium TLD', description: 'Strong TLD with good commercial recognition' })

  return { score, breakdown, flags }
}

function calculateSeoScore(sld: string, tld: string): { score: number; breakdown: any[]; flags: Flag[]; archiveInfo: ArchiveInfo | null } {
  const age = randomInt(1, 20)
  const snapshots = randomInt(0, 500)
  const firstSeen = String(2000 + randomInt(0, 25))
  const hasArchive = snapshots > 0
  const hasHistory = age > 3
  const premiumTld = ['com', 'net', 'org'].includes(tld)

  let score = 35
  if (hasHistory) score += Math.min(age * 2, 25)
  if (hasArchive) score += 10
  if (snapshots > 50) score += 8
  if (premiumTld) score += 8
  if (sld.length >= 5 && sld.length <= 12) score += 5

  score = Math.max(0, Math.min(100, score))

  const breakdown = [
    { category: 'Domain Age', score: Math.min(age * 2, 25), max: 25, explanation: `${age} years old — ${age > 5 ? 'solid age foundation' : 'relatively new'}` },
    { category: 'Archive History', score: hasArchive ? 10 : 2, max: 10, explanation: hasArchive ? `${snapshots} snapshots found` : 'No archive data available' },
    { category: 'Snapshot Depth', score: snapshots > 50 ? 8 : 3, max: 8, explanation: snapshots > 50 ? 'Rich archive history' : 'Limited snapshot data' },
    { category: 'TLD Authority', score: premiumTld ? 8 : 4, max: 8, explanation: premiumTld ? 'Established TLD with authority' : 'Newer TLD with less authority' },
    { category: 'Name Structure', score: 5, max: 8, explanation: 'Standard name structure' },
    { category: 'Backlink Potential', score: 5, max: 12, explanation: 'Premium data needed for full assessment' },
  ]

  const flags: Flag[] = []
  if (age > 10) flags.push({ type: 'positive', severity: 'low', label: 'Aged Domain', description: `Domain age: ${age} years — strong foundation` })
  if (!hasArchive) flags.push({ type: 'warning', severity: 'medium', label: 'No Archive Data', description: 'No Wayback Machine history found' })
  if (snapshots > 200) flags.push({ type: 'positive', severity: 'low', label: 'Rich History', description: 'Extensive archive presence indicates active history' })
  if (age < 2) flags.push({ type: 'warning', severity: 'medium', label: 'Very New', description: 'Domain less than 2 years old — limited history' })

  return {
    score,
    breakdown,
    flags,
    archiveInfo: { snapshots, firstSeen, age }
  }
}

export function generateMockDomains(count: number = 54): Domain[] {
  const domains: Domain[] = []

  for (let i = 0; i < count; i++) {
    const sld = pick(DOMAIN_NAMES) + (Math.random() > 0.7 ? '' : pick(['', 'x', 'ly', 'ify', 'able']))
    const tld = pick(TLDS)
    const fqdn = `${sld}.${tld}`
    const source = pick([...SOURCES])
    const price = source === 'auction' ? randomInt(50, 5000) : source === 'closeout' ? randomInt(5, 50) : null
    const auctionEndAt = source === 'auction' ? new Date(Date.now() + randomInt(1, 14) * 86400000).toISOString() : null

    const brand = calculateBrandScore(sld, tld)
    const seo = calculateSeoScore(sld, tld)

    const allFlags = [...brand.flags, ...seo.flags]
    const uniqueFlags = allFlags.filter((f, idx, arr) => arr.findIndex(a => a.label === f.label) === idx)

    const signals: Signal[] = [
      { key: 'length', value: sld.length, status: 'core', weight: 1, tier: 'brand', explanation: `Domain length: ${sld.length} characters` },
      { key: 'age', value: seo.archiveInfo?.age || 0, status: 'core', weight: 1, tier: 'seo', explanation: `Domain age: ${seo.archiveInfo?.age || 0} years` },
      { key: 'snapshots', value: seo.archiveInfo?.snapshots || 0, status: 'core', weight: 1, tier: 'seo', explanation: `Archive snapshots: ${seo.archiveInfo?.snapshots || 0}` },
      { key: 'backlink_count', value: randomInt(0, 5000), status: 'premium', weight: 1, tier: 'seo', explanation: 'Backlink count — premium unlock required' },
      { key: 'domain_authority', value: randomInt(0, 100), status: 'premium', weight: 1, tier: 'seo', explanation: 'Domain authority estimate — premium unlock required' },
      { key: 'toxic_ratio', value: Math.random() * 0.3, status: 'premium', weight: 1, tier: 'seo', explanation: 'Toxic backlink ratio — premium unlock required' },
      { key: 'pbn_probability', value: Math.random() * 0.2, status: 'launch_soon', weight: 1, tier: 'risk', explanation: 'PBN probability detection — coming soon' },
    ]

    domains.push({
      id: `dom-${i}`,
      fqdn,
      sld,
      tld,
      source,
      sourceStatus: source === 'auction' ? 'active' : source === 'dropped' ? 'available' : 'pending',
      price,
      auctionEndAt,
      brandScore: brand.score,
      seoScore: seo.score,
      confidence: 75,
      flags: uniqueFlags,
      signals,
      archiveInfo: seo.archiveInfo,
      isSaved: false,
    })
  }

  return domains
}

export const MOCK_DOMAINS = generateMockDomains()
