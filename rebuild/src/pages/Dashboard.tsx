import { Link } from 'react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Shield, Crown, ArrowRight, Sparkles, Heart } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { MOCK_DOMAINS } from '@/data/mockDomains'
import { useWatchlist } from '@/hooks/useWatchlist'

export default function Dashboard() {
  const { user, isPro } = useAuth()
  const { watchlist } = useWatchlist()
  const highScoreDomains = MOCK_DOMAINS.filter(d => (d.brandScore + d.seoScore) / 2 >= 70).slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back{user?.name ? `, ${user.name}` : ''}
          </p>
        </div>
        <Link to="/app/browse">
          <Button className="gap-2 bg-amber-500 hover:bg-amber-600 text-black">
            <Search size={18} />
            Browse Domains
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Search size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{MOCK_DOMAINS.length}</p>
                <p className="text-xs text-gray-500">Domains Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <Heart size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{watchlist.length}</p>
                <p className="text-xs text-gray-500">Saved Domains</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <Shield size={20} className="text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{isPro ? 'Pro' : 'Free'}</p>
                <p className="text-xs text-gray-500">Current Plan</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Discover Quality Domains</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Browse 54+ expired domains with real brand and SEO scoring.
                </p>
              </div>
            </div>
            <Link to="/app/browse">
              <Button className="gap-2 bg-amber-500 hover:bg-amber-600 text-black">
                Browse Now
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Top Domains */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Scoring Domains</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {highScoreDomains.map((domain) => (
            <Card key={domain.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Link to={`/app/domain/${domain.id}`} className="font-semibold text-gray-900 hover:text-amber-600">
                    {domain.fqdn}
                  </Link>
                  <Badge className="bg-green-50 text-green-700">
                    {Math.round((domain.brandScore + domain.seoScore) / 2)}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Brand: {domain.brandScore}</span>
                  <span>SEO: {domain.seoScore}</span>
                  <span className="capitalize">{domain.source.replace('_', ' ')}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {!isPro && (
        <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white">
                  <Crown size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Upgrade to Pro</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Unlock backlink analysis, authority scores, toxic link detection, and unlimited saved domains.
                  </p>
                </div>
              </div>
              <Link to="/app/pricing">
                <Button className="gap-2 bg-white text-gray-900 hover:bg-gray-100">
                  <Crown size={16} />
                  View Pricing
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
