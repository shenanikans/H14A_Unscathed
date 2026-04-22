import { Link } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer'

const tiers = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        description: 'Get started with the basics. No credit card needed.',
        features: [
            'Up to 5 despatch advices per month',
            'Up to 5 invoices per month',
            '1 user',
            'AU / NZ standard only',
            'Email support',
        ],
        cta: 'Get Started',
        href: '/register',
        highlight: false,
        badge: null,
    },
    {
        name: 'Pro',
        price: '$29',
        period: 'per month',
        description: 'For businesses that need more volume and ship internationally.',
        features: [
            'Unlimited despatch advices',
            'Unlimited invoices',
            'Up to 5 users',
            'All country standards (AU/NZ, SG, JP, EU, US)',
            'Document history',
            'Priority support',
        ],
        cta: 'Start 14-day Trial',
        href: '/register',
        highlight: true,
        badge: 'Most Popular',
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: 'contact us',
        description: 'For larger businesses with complex supply chains.',
        features: [
            'Unlimited everything',
            'Unlimited users',
            'All country standards',
            'API access',
            'Dedicated account manager',
            'Custom integrations',
            'SLA guarantee',
        ],
        cta: 'Contact Sales',
        href: '/contact',
        highlight: false,
        badge: null,
    },
]

export default function Pricing() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <div className="flex-1 bg-gray-50 py-20 px-6 overflow-x-auto">
                <div className="max-w-5xl mx-auto min-w-0">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">Pricing</h1>
                        <p className="text-gray-500">Start free. No hidden fees. Cancel anytime.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {tiers.map((tier) => (
                            <div
                                key={tier.name}
                                className={`rounded-2xl p-8 flex flex-col relative ${
                                    tier.highlight
                                        ? 'bg-deep-sky-blue-600 text-white border-2 border-deep-sky-blue-600 shadow-lg'
                                        : 'bg-white border border-gray-200'
                                }`}
                            >
                                {tier.badge && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="bg-white text-deep-sky-blue-600 text-xs font-semibold px-3 py-1 rounded-full border border-deep-sky-blue-200 shadow-sm">
                                            {tier.badge}
                                        </span>
                                    </div>
                                )}

                                <div className="mb-6">
                                    <p className={`font-semibold mb-3 ${tier.highlight ? 'text-white' : 'text-gray-800'}`}>
                                        {tier.name}
                                    </p>
                                    <div className="flex items-end gap-1 mb-3">
                                        <span className="text-3xl font-bold">{tier.price}</span>
                                        <span className={`text-sm mb-1 ${tier.highlight ? 'text-deep-sky-blue-100' : 'text-gray-400'}`}>
                                            {tier.period}
                                        </span>
                                    </div>
                                    <p className={`text-sm ${tier.highlight ? 'text-deep-sky-blue-100' : 'text-gray-500'}`}>
                                        {tier.description}
                                    </p>
                                </div>

                                <div className="flex-1 flex flex-col gap-2 mb-8">
                                    {tier.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-2 text-sm">
                                            <span className={`mt-0.5 flex-shrink-0 ${tier.highlight ? 'text-white' : 'text-deep-sky-blue-600'}`}>✓</span>
                                            <span className={tier.highlight ? 'text-white' : 'text-gray-600'}>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link to={tier.href}>
                                    <button className={`w-full py-2.5 rounded-lg font-medium text-sm transition-colors ${
                                        tier.highlight
                                            ? 'bg-white text-deep-sky-blue-600 hover:bg-gray-50'
                                            : 'bg-deep-sky-blue-600 text-white hover:bg-deep-sky-blue-700'
                                    }`}>
                                        {tier.cta}
                                    </button>
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-gray-400 text-sm">All plans include a 14-day free trial. No credit card required to start.</p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}