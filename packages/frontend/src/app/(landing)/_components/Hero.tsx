import React from 'react';
import { ArrowRight, Sparkles, Check } from 'lucide-react';
import Image from 'next/image';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-32 lg:pt-32 lg:pb-40">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]"></div>

      {/* Gradient orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-gray-100 to-transparent opacity-60 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white mb-8 shadow-lg shadow-black/10">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Now in Beta Testing</span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-black leading-[1.1] mb-8 tracking-tight">
            Master Your Trading
            <span className="block text-gray-500 mt-2">Performance</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto font-light">
            The most comprehensive trading journal and analytics platform. Track, analyze, and improve your trading performance with advanced statistics and insights.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button disabled className="bg-black text-white px-10 py-5 rounded-xl hover:bg-gray-900 transition-all duration-300 flex items-center justify-center group font-semibold text-lg shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 hover:scale-105">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            <button disabled className="border-2 border-gray-300 text-gray-700 px-10 py-5 rounded-xl hover:border-black hover:bg-gray-50 transition-all duration-300 font-semibold text-lg">
              View Demo
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500 mb-20">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-black" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-black" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-black" />
              <span>Cancel anytime</span>
            </div>
          </div>

          {/* Platform Screenshot */}
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>

            {/* Screenshot container */}
            <div className="relative bg-gradient-to-b from-gray-50 to-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden p-1 backdrop-blur-sm">
              <div className="bg-gray-900 rounded-xl p-1">
                <Image
                  src="/images/landing/SS1.png"
                  alt="Trade2Learn Dashboard"
                  width={1200}
                  height={700}
                  className="rounded-lg w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;