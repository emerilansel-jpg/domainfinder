import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, ArrowRight } from 'lucide-react'
import { Link } from 'react-router'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Basic domain discovery and scoring',
    features: [
      'Browse up to 50 domains',
      'Brand Score (basic)',
      'SEO Score (basic)',
      'Archive history lookup',
      'Save up to 10 domains',
      'Basic filters',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'Full domain intelligence suite',
    features: [
      'Unlimited domain browsing',
      'Advanced Brand Score breakdown',
      'Advanced SEO Score breakdown',
      'Backlink analysis',
      'Domain authority estimates',
      'Toxic link detection',
      'Risk flags & spam detection',
      'Unlimited saved domains',
      'Advanced filters & sorting',
      'Export to CSV',
    ],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: '/month',
    description: 'For agencies and teams',
    features: [
      'Everything in Pro',
      'Team accounts (5 members)',
      'API access',
      'Custom scoring weights',
      'White-label reports',
      'Priority support',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

export default function Pricing() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Pricing</h1>
        <p className="text-sm text-gray-500 mt-1">Choose the plan that fits your domain research needs</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.name} className={`relative ${plan.popular ? 'border-amber-500 shadow-lg' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-amber-500 text-white">
                  <Crown size={14} className="mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-sm text-gray-500">{plan.period}</span>
              </div>
              <p className="text-sm text-gray-500">{plan.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check size={16} className={`${plan.popular ? 'text-amber-500' : 'text-green-500'}`} />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to={plan.name === 'Enterprise' ? '/' : '/app'}>
                <Button className={`w-full gap-2 ${plan.popular ? 'bg-amber-500 hover:bg-amber-600 text-black' : ''}`}>
                  {plan.cta}
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>All plans include access to domain discovery tools.</p>
        <p className="mt-1">Cancel anytime. No hidden fees.</p>
      </div>
    </div>
  )
}
