"use client";
import React from 'react';
import { TrendingUp, Users, BarChart, DollarSign } from 'lucide-react';

const Statistics = () => {
  const stats = [
    {
      icon: Users,
      value: '100+',
      label: 'Active Traders',
      description: 'Professional traders trust Trade2Learn'
    },
    {
      icon: BarChart,
      value: '250k+',
      label: 'Trades Analyzed',
      description: 'Trades tracked and analyzed monthly'
    },
    {
      icon: TrendingUp,
      value: '17%',
      label: 'Average Improvement',
      description: 'Win rate improvement in first 3 months'
    },
    {
      icon: DollarSign,
      value: '$1.2M+',
      label: 'Portfolio Value',
      description: 'Total portfolio value managed'
    }
  ];

  return (
    <section className="relative py-24 lg:py-32 bg-black text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:48px_48px]"></div>

      {/* Gradient orbs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-2 rounded-full bg-white text-black mb-6 shadow-xl shadow-white/10">
            <span className="text-sm font-medium">OUR IMPACT</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Trusted by Traders Worldwide
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light">
            Join thousands of traders who have improved their performance using Trade2Learn&apos;s advanced analytics and journaling tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Card background */}
              <div className="absolute inset-0 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 group-hover:border-white/30 group-hover:bg-white/10 transition-all duration-500"></div>

              <div className="relative p-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl shadow-white/20">
                  <stat.icon className="h-8 w-8 text-black" />
                </div>
                <div className="text-5xl lg:text-6xl font-bold mb-4 text-white group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-xl font-bold text-white mb-3">
                  {stat.label}
                </div>
                <div className="text-gray-400 text-sm leading-relaxed">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;