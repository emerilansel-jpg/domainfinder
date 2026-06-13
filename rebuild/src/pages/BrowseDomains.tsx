import { useState, useMemo } from 'react'
import { Link } from 'react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  Filter,
  ArrowUpDown,
  Heart,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Crown,
} from 'lucide-react'
import type { Domain, FilterState, SortState } from '@/types/domain'
import { MOCK_DOMAINS } from '@/data/mockDomains'
import { useWatchlist } from '@/hooks/useWatchlist'
import { useAuth } from '@/lib/auth'

const TLDS = ['com', 'net', 'org', 'io', 'co', 'ai', 'app', 'dev', 'tech', 'digital']
const SOURCES = ['auction', 'dropped', 'pending_delete', 'closeout']

export default function BrowseDomains() {
  const { isSaved, toggleSave } = useWatchlist()
  const { isPro } = useAuth()

  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    tlds: [],
    minLength: 3,
    maxLength: 25,
    hasHyphen: null,
    hasNumber: null,
    minBrandScore: 0,
    maxBrandScore: 100,
    minSeoScore: 0,
    maxSeoScore: 100,
    minPrice: null,
    maxPrice: null,
    sources: [],
    cleanHistory: false,
    hasArchive: false,
  })

  const [sort, setSort] = useState<SortState>({ field: 'totalScore', direction: 'desc' })
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    let result = MOCK_DOMAINS.filter((d) => {
      if (filters.keyword && !d.fqdn.toLowerCase().includes(filters.keyword.toLowerCase())) return false
      if (filters.tlds.length > 0 && !filters.tlds.includes(d.tld)) return false
      if (d.sld.length < filters.minLength || d.sld.length > filters.maxLength) return false
      if (filters.hasHyphen !== null && d.sld.includes('-') !== filters.hasHyphen) return false
      if (filters.hasNumber !== null && /\d/.test(d.sld) !== filters.hasNumber) return false
      if (d.brandScore < filters.minBrandScore || d.brandScore > filters.maxBrandScore) return false
      if (d.seoScore < filters.minSeoScore || d.seoScore > filters.maxSeoScore) return false
      if (filters.minPrice !== null && (d.price === null || d.price < filters.minPrice)) return false
      if (filters.maxPrice !== null && (d.price === null || d.price > filters.maxPrice)) return false
      if (filters.sources.length > 0 && !filters.sources.includes(d.source)) return false
      if (filters.cleanHistory && d.flags.some(f => f.type === 'negative')) return false
      if (filters.hasArchive && !d.archiveInfo) return false
      return true
    })

    result.sort((a, b) => {
      const dir = sort.direction === 'asc' ? 1 : -1
      switch (sort.field) {
        case 'brandScore': return (a.brandScore - b.brandScore) * dir
        case 'seoScore': return (a.seoScore - b.seoScore) * dir
        case 'totalScore': return ((a.brandScore + a.seoScore) / 2 - (b.brandScore + b.seoScore) / 2) * dir
        case 'price': return ((a.price ?? 0) - (b.price ?? 0)) * dir
        case 'age': return ((a.archiveInfo?.age ?? 0) - (b.archiveInfo?.age ?? 0)) * dir
        case 'name': return a.fqdn.localeCompare(b.fqdn) * dir
        default: return 0
      }
    })

    return result
  }, [filters, sort])

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const toggleArrayFilter = (key: 'tlds' | 'sources', value: string) => {
    setFilters(prev => {
      const arr = prev[key]
      const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]
      return { ...prev, [key]: next }
    })
  }

  const totalScore = (d: Domain) => Math.round((d.brandScore + d.seoScore) / 2)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Domains</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} of {MOCK_DOMAINS.length} domains</p>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Search domains..."
              value={filters.keyword}
              onChange={(e) => updateFilter('keyword', e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-amber-50 border-amber-200' : ''}
          >
            <Filter size={16} className="mr-2" />
            Filters
          </Button>
          <Select
            value={`${sort.field}-${sort.direction}`}
            onValueChange={(v) => {
              const [f, d] = v.split('-') as [SortState['field'], SortState['direction']]
              setSort({ field: f, direction: d })
            }}
          >
            <SelectTrigger className="w-40">
              <ArrowUpDown size={14} className="mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="totalScore-desc">Best Score</SelectItem>
              <SelectItem value="brandScore-desc">Brand Score</SelectItem>
              <SelectItem value="seoScore-desc">SEO Score</SelectItem>
              <SelectItem value="price-asc">Price: Low</SelectItem>
              <SelectItem value="price-desc">Price: High</SelectItem>
              <SelectItem value="age-desc">Age: Old</SelectItem>
              <SelectItem value="name-asc">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {showFilters && (
        <Card>
          <CardContent className="p-4 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">TLD</label>
              <div className="flex flex-wrap gap-1">
                {TLDS.map(tld => (
                  <button
                    key={tld}
                    onClick={() => toggleArrayFilter('tlds', tld)}
                    className={`px-2 py-1 text-xs rounded ${filters.tlds.includes(tld) ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    .{tld}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Source</label>
              <div className="flex flex-wrap gap-1">
                {SOURCES.map(src => (
                  <button
                    key={src}
                    onClick={() => toggleArrayFilter('sources', src)}
                    className={`px-2 py-1 text-xs rounded capitalize ${filters.sources.includes(src) ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {src.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Brand Score</label>
              <div className="flex gap-2">
                <Input type="number" min={0} max={100} placeholder="Min" value={filters.minBrandScore} onChange={e => updateFilter('minBrandScore', Number(e.target.value))} className="w-20" />
                <Input type="number" min={0} max={100} placeholder="Max" value={filters.maxBrandScore} onChange={e => updateFilter('maxBrandScore', Number(e.target.value))} className="w-20" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">SEO Score</label>
              <div className="flex gap-2">
                <Input type="number" min={0} max={100} placeholder="Min" value={filters.minSeoScore} onChange={e => updateFilter('minSeoScore', Number(e.target.value))} className="w-20" />
                <Input type="number" min={0} max={100} placeholder="Max" value={filters.maxSeoScore} onChange={e => updateFilter('maxSeoScore', Number(e.target.value))} className="w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {filtered.map((domain) => (
          <Card key={domain.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Link to={`/app/domain/${domain.id}`} className="text-lg font-semibold text-gray-900 hover:text-amber-600 truncate">
                      {domain.fqdn}
                    </Link>
                    <Badge variant="outline" className="text-xs capitalize">{domain.source.replace('_', ' ')}</Badge>
                    {domain.price && (
                      <Badge className="bg-green-50 text-green-700 text-xs">
                        <DollarSign size={10} className="mr-1" />
                        {domain.price}
                      </Badge>
                    )}
                    {domain.auctionEndAt && (
                      <Badge className="bg-amber-50 text-amber-700 text-xs">
                        <Clock size={10} className="mr-1" />
                        {Math.ceil((new Date(domain.auctionEndAt).getTime() - Date.now()) / 86400000)}d
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {domain.flags.slice(0, 3).map((flag, i) => (
                      <span key={i} className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                        flag.type === 'positive' ? 'bg-green-50 text-green-700' :
                        flag.type === 'negative' ? 'bg-red-50 text-red-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {flag.type === 'positive' && <CheckCircle size={10} />}
                        {flag.type === 'negative' && <XCircle size={10} />}
                        {flag.type === 'warning' && <AlertTriangle size={10} />}
                        {flag.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Brand</p>
                    <p className={`text-lg font-bold ${domain.brandScore >= 70 ? 'text-green-600' : domain.brandScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                      {domain.brandScore}
                    </p>
                    <Progress value={domain.brandScore} className="w-16 h-1" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">SEO</p>
                    <p className={`text-lg font-bold ${domain.seoScore >= 70 ? 'text-green-600' : domain.seoScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                      {domain.seoScore}
                    </p>
                    <Progress value={domain.seoScore} className="w-16 h-1" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Total</p>
                    <p className={`text-xl font-bold ${totalScore(domain) >= 70 ? 'text-green-600' : totalScore(domain) >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                      {totalScore(domain)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => toggleSave(domain)}
                      className={`p-2 rounded-lg transition-colors ${isSaved(domain.id) ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                      <Heart size={18} className={isSaved(domain.id) ? 'fill-current' : ''} />
                    </button>
                    <Link to={`/app/domain/${domain.id}`}>
                      <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-black">
                        Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {!isPro && domain.signals.some(s => s.status === 'premium') && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-amber-600">
                  <Crown size={14} />
                  <span>Premium signals available — upgrade to unlock backlink analysis, authority scores, and risk detection</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Search size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No domains match your filters</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setFilters({
              keyword: '', tlds: [], minLength: 3, maxLength: 25, hasHyphen: null, hasNumber: null,
              minBrandScore: 0, maxBrandScore: 100, minSeoScore: 0, maxSeoScore: 100,
              minPrice: null, maxPrice: null, sources: [], cleanHistory: false, hasArchive: false,
            })}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
