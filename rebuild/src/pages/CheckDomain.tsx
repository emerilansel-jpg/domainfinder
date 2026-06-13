import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Search, ExternalLink, Clock, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface ScoreResult {
  brandScore: number
  seoScore: number
  totalScore: number
  brandBreakdown: { label: string; value: number; max: number }[]
  seoBreakdown: { label: string; value: number; max: number }[]
  archiveInfo: { snapshots: number; firstSeen: string; age: number } | null
  flags: { type: 'positive' | 'negative' | 'warning'; text: string }[]
  domain: string
}

const SUGGESTIONS = ['techflow.io', 'brandvault.com', 'datahub.net', 'cloudpulse.org']

export default function CheckDomain() {
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScoreResult | null>(null)
  const [error, setError] = useState('')

  const calculateBrandScore = (d: string): { score: number; breakdown: any[] } => {
    const name = d.replace(/^www\./, '').split('.')[0] || d
    const tld = d.split('.').pop() || ''
    const length = name.length
    const hasHyphen = name.includes('-')
    const hasNumber = /\d/.test(name)
    const keywords = ['tech', 'data', 'cloud', 'ai', 'app', 'web', 'digital', 'brand', 'hub', 'flow']
    const hasKeyword = keywords.some(k => name.toLowerCase().includes(k))
    const premiumTlds = ['com', 'net', 'org', 'io', 'co', 'ai']
    const isPremiumTld = premiumTlds.includes(tld.toLowerCase())

    let score = 50
    if (length >= 5 && length <= 12) score += 15
    else if (length < 5) score += 10
    else score -= 10

    if (isPremiumTld) score += 10
    if (hasKeyword) score += 15
    if (hasHyphen) score -= 10
    if (hasNumber) score -= 10

    score = Math.max(0, Math.min(100, score))

    return {
      score,
      breakdown: [
        { label: 'Length', value: length >= 5 && length <= 12 ? 15 : 5, max: 15 },
        { label: 'TLD Quality', value: isPremiumTld ? 10 : 3, max: 10 },
        { label: 'Keyword', value: hasKeyword ? 15 : 0, max: 15 },
        { label: 'No Hyphen', value: hasHyphen ? 0 : 10, max: 10 },
        { label: 'No Number', value: hasNumber ? 0 : 10, max: 10 },
        { label: 'Memorable', value: length <= 10 ? 10 : 5, max: 10 },
      ]
    }
  }

  const fetchArchiveData = async (d: string): Promise<{ snapshots: number; firstSeen: string; age: number } | null> => {
    try {
      const resp = await fetch(`https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(d)}&output=json&limit=1`)
      if (!resp.ok) return null
      const data = await resp.json()
      if (!Array.isArray(data) || data.length < 2) return null
      const firstRow = data[1]
      const timestamp = firstRow[1]
      const year = parseInt(timestamp.substring(0, 4))
      const age = new Date().getFullYear() - year
      return { snapshots: 0, firstSeen: String(year), age }
    } catch {
      return null
    }
  }

  const checkDomain = async () => {
    if (!domain.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/+$/, '')
    const brand = calculateBrandScore(cleanDomain)
    const archive = await fetchArchiveData(cleanDomain)

    let seoScore = 40
    if (archive) {
      seoScore += Math.min(archive.age * 3, 30)
      seoScore += archive.snapshots > 0 ? 10 : 0
    }
    seoScore = Math.max(0, Math.min(100, seoScore))

    const totalScore = Math.round((brand.score + seoScore) / 2)

    const flags: any[] = []
    if (brand.score >= 70) flags.push({ type: 'positive' as const, text: 'Strong brand potential' })
    if (archive && archive.age > 5) flags.push({ type: 'positive' as const, text: `Domain age: ${archive.age} years` })
    if (!archive) flags.push({ type: 'warning' as const, text: 'No Archive.org data found' })
    if (cleanDomain.includes('-')) flags.push({ type: 'negative' as const, text: 'Contains hyphens' })
    if (/\d/.test(cleanDomain)) flags.push({ type: 'negative' as const, text: 'Contains numbers' })

    setResult({
      brandScore: brand.score,
      seoScore,
      totalScore,
      brandBreakdown: brand.breakdown,
      seoBreakdown: [
        { label: 'Archive History', value: archive ? 15 : 5, max: 20 },
        { label: 'Domain Age', value: archive ? Math.min(archive.age * 3, 30) : 0, max: 30 },
        { label: 'TLD Authority', value: 10, max: 15 },
        { label: 'Name Length', value: 10, max: 15 },
        { label: 'Backlink Potential', value: 5, max: 20 },
      ],
      archiveInfo: archive,
      flags,
      domain: cleanDomain,
    })
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Check Domain</h1>
        <p className="text-sm text-gray-500 mt-1">Analyze any domain for brand and SEO value.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex gap-3">
            <Input
              placeholder="Enter domain (e.g., techflow.io)"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkDomain()}
              className="flex-1"
            />
            <Button onClick={checkDomain} disabled={loading} className="gap-2 bg-amber-500 hover:bg-amber-600 text-black">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
              Check
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => { setDomain(s); checkDomain() }}
                className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-700 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Score Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <ScoreCard title="Brand Score" score={result.brandScore} color="bg-blue-500" />
            <ScoreCard title="SEO Score" score={result.seoScore} color="bg-green-500" />
            <ScoreCard title="Total Score" score={result.totalScore} color="bg-amber-500" />
          </div>

          {/* Archive Info */}
          {result.archiveInfo && (
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4 flex items-center gap-4">
                <Clock size={20} className="text-amber-600" />
                <div className="text-sm">
                  <span className="font-semibold text-amber-800">Archive.org:</span>{' '}
                  First seen <strong>{result.archiveInfo.firstSeen}</strong> · Age{' '}
                  <strong>{result.archiveInfo.age} years</strong>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Breakdowns */}
          <div className="grid md:grid-cols-2 gap-6">
            <BreakdownCard title="Brand Signals" items={result.brandBreakdown} />
            <BreakdownCard title="SEO Signals" items={result.seoBreakdown} />
          </div>

          {/* Flags */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Analysis Flags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {result.flags.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  {f.type === 'positive' && <CheckCircle size={16} className="text-green-500" />}
                  {f.type === 'negative' && <XCircle size={16} className="text-red-500" />}
                  {f.type === 'warning' && <AlertTriangle size={16} className="text-amber-500" />}
                  <span className={f.type === 'positive' ? 'text-green-700' : f.type === 'negative' ? 'text-red-700' : 'text-amber-700'}>
                    {f.text}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <a
              href={`https://web.archive.org/web/*/${result.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              <ExternalLink size={16} />
              View on Wayback Machine
            </a>
            <a
              href={`https://${result.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              <ExternalLink size={16} />
              Visit Domain
            </a>
          </div>

          {/* Premium Teaser */}
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-amber-800">Premium Analysis</p>
                  <p className="text-xs text-amber-600 mt-1">Backlink count, traffic estimate, domain authority, and more.</p>
                </div>
                <Badge className="bg-amber-500 text-white">PRO</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function ScoreCard({ title, score, color }: { title: string; score: number; color: string }) {
  return (
    <Card className="text-center">
      <CardContent className="p-6">
        <p className="text-sm text-gray-500 mb-2">{title}</p>
        <div className={`text-4xl font-bold ${color.replace('bg-', 'text-')}`}>{score}</div>
        <div className="mt-3">
          <Progress value={score} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}

function BreakdownCard({ title, items }: { title: string; items: any[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{item.label}</span>
              <span className="font-medium">{item.value}/{item.max}</span>
            </div>
            <Progress value={(item.value / item.max) * 100} className="h-1.5" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
