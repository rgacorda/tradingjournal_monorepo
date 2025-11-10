import React from 'react';
import { Check, Star } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$19',
      period: '/month',
      description: 'Perfect for new traders getting started',
      features: [
        'Up to 100 trades per month',
        'Basic analytics and reports',
        'Trading journal',
        'Email support',
        'Mobile app access'
      ],
      buttonText: 'Start Free Trial',
      buttonStyle: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
    },
    {
      name: 'Professional',
      price: '$49',
      period: '/month',
      description: 'For serious traders who need advanced tools',
      features: [
        'Unlimited trades',
        'Advanced analytics & AI insights',
        'Risk management tools',
        'Priority support',
        'API access',
        'Custom reports',
        'Portfolio optimization'
      ],
      buttonText: 'Start Free Trial',
      buttonStyle: 'bg-gray-900 text-white hover:bg-gray-800',
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$149',
      period: '/month',
      description: 'For trading teams and institutions',
      features: [
        'Everything in Professional',
        'Team collaboration tools',
        'Advanced compliance features',
        'Dedicated account manager',
        'Custom integrations',
        'White-label options',
        'SLA guarantee'
      ],
      buttonText: 'Contact Sales',
      buttonStyle: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Trading Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start your 14-day free trial today. No credit card required. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-xl shadow-lg p-8 ${
                plan.popular ? 'ring-2 ring-gray-900 transform scale-105' : ''
              } hover:shadow-xl transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-xl text-gray-600 ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-gray-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button disabled className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${plan.buttonStyle}`}>
                Coming Soon
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            All plans include a 14-day free trial with full access to features
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gray-600 rounded-full mr-2"></div>
              Cancel anytime
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gray-600 rounded-full mr-2"></div>
              No setup fees
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gray-600 rounded-full mr-2"></div>
              24/7 support
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;