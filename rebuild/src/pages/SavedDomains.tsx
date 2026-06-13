import { Link } from 'react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Heart, ArrowRight, Search, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { MOCK_DOMAINS } from '@/data/mockDomains'
import { useWatchlist } from '@/hooks/useWatchlist'

export default function SavedDomains() {
  const { isSaved, toggleSave } = useWatchlist()
  const saved = MOCK_DOMAINS.filter(d => isSaved(d.id))

  const totalScore = (d: any) => Math.round((d.brandScore + d.seoScore) / 2)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Domains</h1>
          <p className="text-sm text-gray-500 mt-1">{saved.length} domains in your watchlist</p>
        </div>
        <Link to="/app/browse">
          <Button className="gap-2 bg-amber-500 hover:bg-amber-600 text-black">
            <Search size={18} />
            Browse More
          </Button>
        </Link>
      </div>

      {saved.length === 0 ? (
        <div className="text-center py-12">
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No saved domains yet</p>
          <p className="text-sm text-gray-400 mt-1">Browse domains and click the heart to save them</p>
          <Link to="/app/browse" className="inline-block mt-4">
            <Button variant="outline" className="gap-2">
              <ArrowRight size={16} />
              Browse Domains
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {saved.map((domain) => (
            <Card key={domain.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Link to={`/app/domain/${domain.id}`} className="text-lg font-semibold text-gray-900 hover:text-amber-600 truncate">
                        {domain.fqdn}
                      </Link>
                      <Badge variant="outline" className="text-xs capitalize">{domain.source.replace('_', ' ')}</Badge>
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
                        className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      >
                        <Heart size={18} className="fill-current" />
                      </button>
                      <Link to={`/app/domain/${domain.id}`}>
                        <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-black">
                          Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
