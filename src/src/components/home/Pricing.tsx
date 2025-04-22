
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const plans = [
  {
    name: "Free",
    description: "Get started with basic inventory management",
    price: "$0",
    period: "forever",
    features: [
      "Up to 100 inventory items",
      "Basic geolocation mapping",
      "Single organization profile",
      "7-day data history",
      "Community support"
    ],
    cta: "Sign up",
    ctaLink: "/signup",
    popular: false
  },
  {
    name: "Business",
    description: "Perfect for growing businesses",
    price: "$29",
    period: "per month",
    features: [
      "Unlimited inventory items",
      "Advanced geolocation features",
      "Organization profiles",
      "90-day data history",
      "REST API access",
      "Priority email support"
    ],
    cta: "Start trial",
    ctaLink: "/signup?plan=business",
    popular: true
  },
  {
    name: "Enterprise",
    description: "For large organizations with complex needs",
    price: "Custom",
    period: "pricing",
    features: [
      "Unlimited everything",
      "Multi-tenant architecture",
      "Advanced permissions",
      "Custom integrations",
      "Unlimited data history",
      "Dedicated support",
      "SLA guarantees"
    ],
    cta: "Contact us",
    ctaLink: "/contact",
    popular: false
  }
];

const Pricing = () => {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 relative bg-[#0f1923]">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_50%_60%,rgba(23,74,119,0.15)_0%,transparent_100%)]" />
      </div>

      <div className="container px-4 md:px-6">
        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/5 px-3 py-1 text-sm mb-4">
            <span className="font-medium text-blue-400">Simple Pricing</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-white">
            Plans for businesses of all sizes
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start free and scale as you grow. No credit card required to get started.
          </p>

          {/* Period toggle */}
          <div className="flex items-center justify-center space-x-4 mt-8">
            <span className={`${!annual ? 'text-white font-medium' : 'text-gray-400'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-gray-700"
              type="button"
              role="switch"
              aria-checked={annual}
            >
              <span
                className={`${
                  annual ? 'translate-x-5' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-blue-400 transition-transform`}
              />
            </button>
            <span className={`flex items-center ${annual ? 'text-white font-medium' : 'text-gray-400'}`}>
              Annual
              <span className="ml-1.5 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col rounded-xl bg-[#0d1c28] p-6 shadow-sm transition-all hover:shadow-md ${
                plan.popular ? 'border border-blue-400 ring-1 ring-blue-400' : 'border border-blue-400/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-blue-400 px-3 py-1 text-xs font-medium text-white">
                  Most Popular
                </div>
              )}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-sm text-gray-300 mt-1">{plan.description}</p>
                </div>
              </div>
              <div className="mb-4 flex items-baseline">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="ml-1 text-sm font-medium text-gray-400">/{plan.period}</span>
              </div>
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <Check className="h-4 w-4 text-blue-400 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Button 
                  asChild 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                >
                  <Link to={plan.ctaLink} className={plan.popular ? "bg-blue-400 hover:bg-blue-500" : "border-blue-400/20 text-gray-300 hover:bg-blue-500/5"}>{plan.cta}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ teaser */}
        <div className="mt-20 text-center">
          <h3 className="text-xl font-semibold mb-2 text-white">Have questions?</h3>
          <p className="text-gray-300 mb-4">Check out our FAQ or contact our support team</p>
          <Button asChild variant="outline" className="border-blue-400/20 text-gray-300 hover:bg-blue-500/5">
            <Link to="/faq">View FAQ</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
