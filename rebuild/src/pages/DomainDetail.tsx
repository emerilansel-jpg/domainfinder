import { useParams, useNavigate } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft, Heart, ExternalLink, Clock, DollarSign,
  CheckCircle, XCircle, AlertTriangle, Crown, Lock, Globe,
  Archive, BarChart3, Shield, Zap
} from 'lucide-react'
import { MOCK_DOMAINS } from '@/data/mockDomains'
import { useWatchlist } from '@/hooks/useWatchlist'
import { useAuth } from '@/lib/auth'

export default function DomainDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isSaved, toggleSave } = useWatchlist()
  const { isPro } = useAuth()

  const domain = MOCK_DOMAINS.find(d => d.id === id)
  if (!domain) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Domain not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/app/browse')}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Browse
        </Button>
      </div>
    )
  }

  const totalScore = Math.round((domain.brandScore + domain.seoScore) / 2)
  const coreSignals = domain.signals.filter(s => s.status === 'core')
  const premiumSignals = domain.signals.filter(s => s.status === 'premium')
  const launchSoonSignals = domain.signals.filter(s => s.status === 'launch_soon')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/app/browse')}>
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{domain.fqdn}</h1>
          <p className="text-sm text-gray-500 capitalize">{domain.source.replace('_', ' ')} — {domain.sourceStatus}</p>
        </div>
        <button
          onClick={() => toggleSave(domain)}
          className={`p-3 rounded-lg transition-colors ${isSaved(domain.id) ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
        >
          <Heart size={20} className={isSaved(domain.id) ? 'fill-current' : ''} />
        </button>
      </div>

      {/* Score Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <ScoreCard title="Brand Score" score={domain.brandScore} color="bg-blue-500" icon={Shield} />
        <ScoreCard title="SEO Score" score={domain.seoScore} color="bg-green-500" icon={BarChart3} />
        <ScoreCard title="Total Score" score={totalScore} color="bg-amber-500" icon={Zap} />
      </div>

      {/* Price & Auction */}
      {domain.price && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 flex items-center gap-4">
            <DollarSign size={24} className="text-amber-600" />
            <div>
              <p className="font-semibold text-amber-800">Current Price: ${domain.price}</p>
              {domain.auctionEndAt && (
                <p className="text-sm text-amber-600 flex items-center gap-1">
                  <Clock size={14} />
                  Ends in {Math.ceil((new Date(domain.auctionEndAt).getTime() - Date.now()) / 86400000)} days
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Archive Info */}
      {domain.archiveInfo && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Archive size={18} className="text-amber-600" />
              Archive History
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{domain.archiveInfo.snapshots}</p>
              <p className="text-xs text-gray-500">Snapshots</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{domain.archiveInfo.firstSeen}</p>
              <p className="text-xs text-gray-500">First Seen</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{domain.archiveInfo.age} yrs</p>
              <p className="text-xs text-gray-500">Age</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flags */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Analysis Flags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {domain.flags.map((flag, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              {flag.type === 'positive' && <CheckCircle size={18} className="text-green-500" />}
              {flag.type === 'negative' && <XCircle size={18} className="text-red-500" />}
              {flag.type === 'warning' && <AlertTriangle size={18} className="text-amber-500" />}
              <div>
                <p className={`font-medium ${
                  flag.type === 'positive' ? 'text-green-700' :
                  flag.type === 'negative' ? 'text-red-700' : 'text-amber-700'
                }`}>{flag.label}</p>
                <p className="text-sm text-gray-500">{flag.description}</p>
              </div>
              <Badge className={`ml-auto ${
                flag.severity === 'high' ? 'bg-red-100 text-red-700' :
                flag.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                'bg-green-100 text-green-700'
              }`}>{flag.severity}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Core Signals */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Globe size={18} className="text-blue-600" />
            Core Signals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {coreSignals.map((signal, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{signal.key}</span>
                <span className="font-medium">{signal.value}</span>
              </div>
              <p className="text-xs text-gray-400">{signal.explanation}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Premium Signals - Locked */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Crown size={18} className="text-amber-600" />
            Premium Signals
            {!isPro && <Badge className="bg-amber-500 text-white ml-2">PRO</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isPro ? (
            premiumSignals.map((signal, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{signal.key}</span>
                  <span className="font-medium">{signal.value}</span>
                </div>
                <p className="text-xs text-gray-400">{signal.explanation}</p>
              </div>
            ))
          ) : (
            <>
              {premiumSignals.map((signal, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/60">
                  <Lock size={16} className="text-amber-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">{signal.key}</p>
                    <p className="text-xs text-gray-400">{signal.explanation}</p>
                  </div>
                </div>
              ))}
              <div className="text-center py-4">
                <p className="text-sm text-amber-700 mb-2">Upgrade to Pro to unlock premium signals</p>
                <Button className="bg-amber-500 hover:bg-amber-600 text-black gap-2">
                  <Crown size={16} />
                  Upgrade to Pro
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Launch Soon Signals */}
      <Card className="bg-gray-50 border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-gray-500">
            <Zap size={18} />
            Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {launchSoonSignals.map((signal, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-100">
              <Lock size={16} className="text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">{signal.key}</p>
                <p className="text-xs text-gray-400">{signal.explanation}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <a href={`https://web.archive.org/web/*/${domain.fqdn}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-medium">
          <ExternalLink size={16} />
          View on Wayback Machine
        </a>
        <a href={`https://${domain.fqdn}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium">
          <ExternalLink size={16} />
          Visit Domain
        </a>
      </div>
    </div>
  )
}

function ScoreCard({ title, score, color, icon: Icon }: { title: string; score: number; color: string; icon: any }) {
  return (
    <Card className="text-center">
      <CardContent className="p-6">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mx-auto mb-3`}>
          <Icon size={20} className="text-white" />
        </div>
        <p className="text-sm text-gray-500 mb-2">{title}</p>
        <div className={`text-4xl font-bold ${color.replace('bg-', 'text-')}`}>{score}</div>
        <div className="mt-3">
          <Progress value={score} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}
