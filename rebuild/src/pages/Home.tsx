import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Shield, BarChart3, Zap, Globe, ArrowRight, CheckCircle } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm mb-6 border border-white/20">
            <Zap size={16} className="text-amber-400" />
            <span>AI-Powered Domain Intelligence</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Discover Expired Domains
            <br />
            <span className="text-amber-400">With Real Scoring</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Analyze brand value, SEO history, and backlink potential of expired domains.
            Make data-driven decisions for your next investment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/app/check">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold gap-2">
                <Search size={18} />
                Check a Domain
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Get Started
              </Button>
            </Link>
          </div>
          <div className="mt-8 text-sm text-gray-400">
            Demo: <code className="bg-white/10 px-2 py-1 rounded">demo@web-library.net</code> / <code className="bg-white/10 px-2 py-1 rounded">demo123</code>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Why DomainIQ?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Search}
              title="Real-Time Scoring"
              desc="Brand Score + SEO Score calculated instantly from domain name and Archive.org history."
            />
            <FeatureCard
              icon={Globe}
              title="Archive.org Integration"
              desc="Pull real snapshot count, first seen year, and domain age from Wayback Machine."
            />
            <FeatureCard
              icon={Shield}
              title="Brand Analysis"
              desc="Length, TLD quality, keyword detection, hyphen/number penalty analysis."
            />
            <FeatureCard
              icon={BarChart3}
              title="SEO Breakdown"
              desc="Detailed signal bars showing SEO strength, history, and potential."
            />
            <FeatureCard
              icon={Zap}
              title="Premium Insights"
              desc="Upgrade to Pro for backlink analysis, traffic estimates, and domain age."
            />
            <FeatureCard
              icon={CheckCircle}
              title="Free to Start"
              desc="Check any domain for free. No credit card required for basic scoring."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-900">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Step number="1" title="Enter Domain" desc="Type any domain name you want to analyze." />
            <Step number="2" title="Real Scoring" desc="Our engine calculates brand + SEO scores instantly." />
            <Step number="3" title="Get Insights" desc="View detailed breakdowns and premium recommendations." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Domain?</h2>
          <p className="text-lg mb-8 text-white/90">
            Start checking domains now. No signup required for basic scoring.
          </p>
          <Link to="/app/check">
            <Button size="lg" className="bg-white text-amber-600 hover:bg-gray-100 font-semibold gap-2">
              <Search size={18} />
              Start Checking
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 text-gray-400 text-sm text-center">
        <p>DomainIQ — Expired Domain Intelligence Platform</p>
        <p className="mt-1">Built with React + Cloudflare + AI</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mb-3">
          <Icon size={20} className="text-amber-600" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">{desc}</p>
      </CardContent>
    </Card>
  )
}

function Step({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 font-bold text-lg flex items-center justify-center mx-auto mb-4">
        {number}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  )
}
