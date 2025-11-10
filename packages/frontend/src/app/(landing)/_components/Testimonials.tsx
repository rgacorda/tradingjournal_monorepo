import React from 'react';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Day Trader',
      image: '/assets/pexels1.jpeg',
      rating: 5,
      content: 'Trade2Learn transformed my trading. The analytics helped me identify my weaknesses and improve my win rate from 45% to 72% in just 4 months.'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Swing Trader',
      image: '/assets/pexels2.jpeg',
      rating: 5,
      content: 'The risk management tools are incredible. I finally have control over my position sizing and my account has grown consistently since using Trade2Learn.'
    },
    {
      name: 'Emily Johnson',
      role: 'Options Trader',
      image: '/assets/pexels3.jpeg',
      rating: 5,
      content: 'The journaling feature is a game-changer. Being able to document my thought process and review it later has made me a much more disciplined trader.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Traders Say About Us
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what successful traders are saying about Trade2Learn.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group"
            >
              <Quote className="h-8 w-8 text-gray-700 mb-4 group-hover:scale-110 transition-transform duration-300" />
              
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-gray-600 fill-current" />
                ))}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                &ldquo;{testimonial.content}&ldquo;
              </p>

              <div className="flex items-center">
                <Image
                  src='/assets/SS1.png'
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                  width={48}
                  height={48}
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;