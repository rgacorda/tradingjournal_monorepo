import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

const CTA = () => {
  return (
    <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]"></div>

      {/* Gradient orb */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-gray-100 to-transparent opacity-60 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-4 py-2 rounded-full bg-black text-white mb-8 shadow-lg shadow-black/10">
            <span className="text-sm font-medium">GET STARTED TODAY</span>
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black mb-8 tracking-tight leading-[1.1]">
            Ready to Transform Your
            <span className="block text-gray-500 mt-2">Trading Performance?</span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed font-light max-w-3xl mx-auto">
            Join thousands of successful traders who have improved their performance with Trade2Learn.
            Start your free trial today and see the difference professional analytics can make.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button disabled className="bg-black text-white px-12 py-6 rounded-xl hover:bg-gray-900 transition-all duration-300 flex items-center justify-center group font-semibold text-lg shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 hover:scale-105">
              Start Free Trial
              <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            <Link className="border-2 border-gray-300 text-gray-700 px-12 py-6 rounded-xl hover:border-black hover:bg-gray-50 transition-all duration-300 font-semibold text-lg" href={"/register"}>
              Join Demo
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-black" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-black" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-black" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;