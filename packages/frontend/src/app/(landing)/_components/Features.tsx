import React from 'react';
import { BarChart3, Target, BookOpen, Shield, Users, Zap, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const Features = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive performance metrics, risk analysis, and detailed trade breakdowns to identify patterns and improve your strategy.'
    },
    {
      icon: Target,
      title: 'Trade Tracking',
      description: 'Log every trade with detailed entry/exit points, stop losses, and profit targets. Import data from major brokers automatically.'
    },
    {
      icon: BookOpen,
      title: 'Journal & Notes',
      description: 'Document your trading psychology, market observations, and lessons learned. Build a comprehensive trading knowledge base.'
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'Monitor position sizing, portfolio exposure, and risk-reward ratios. Set alerts for risk thresholds and drawdown limits.'
    },
    {
      icon: Users,
      title: 'Community Insights',
      description: 'Connect with other traders, share strategies, and learn from successful trading patterns in our community.'
    },
    {
      icon: Zap,
      title: 'Real-time Sync',
      description: 'Automatic synchronization across all devices. Access your trading data anywhere, anytime with real-time updates.'
    }
  ];

  return (
    <section id="features" className="py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-2 rounded-full bg-black text-white mb-6 shadow-lg shadow-black/10">
            <span className="text-sm font-medium">POWERFUL FEATURES</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-black mb-6 tracking-tight">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light">
            Comprehensive tools designed by traders, for traders. Track your progress, analyze your performance, and accelerate your learning curve.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-24">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 lg:p-10 rounded-2xl bg-white border-2 border-gray-100 hover:border-gray-900 hover:shadow-2xl transition-all duration-500"
            >
              {/* Hover gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500"></div>

              <div className="relative">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-black/20">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-4 group-hover:text-gray-900 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center text-sm font-medium text-gray-400 group-hover:text-black transition-colors">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Screenshots Section */}
        <div className="space-y-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-black mb-4">
              See It In Action
            </h3>
            <p className="text-lg text-gray-600">
              Explore powerful features designed for serious traders
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden p-2">
                <div className="bg-gray-900 rounded-xl p-1">
                  <Image
                    src="/images/landing/SS2.png"
                    alt="Trade Analytics View"
                    width={600}
                    height={400}
                    className="rounded-lg w-full h-auto"
                  />
                </div>
              </div>
              <div className="mt-6 pl-2">
                <h4 className="text-xl font-bold text-black mb-2">Detailed Analytics</h4>
                <p className="text-gray-600">Deep insights into your trading performance with real-time metrics and historical data analysis</p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden p-2">
                <div className="bg-gray-900 rounded-xl p-1">
                  <Image
                    src="/images/landing/SS3.png"
                    alt="Trade Journal View"
                    width={600}
                    height={400}
                    className="rounded-lg w-full h-auto"
                  />
                </div>
              </div>
              <div className="mt-6 pl-2">
                <h4 className="text-xl font-bold text-black mb-2">Trade Journal</h4>
                <p className="text-gray-600">Document every trade with detailed notes, screenshots, and market observations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;