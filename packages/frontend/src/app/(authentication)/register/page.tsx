"use client";
import { TrendingUp, Quote } from "lucide-react";
import { useState, useEffect } from "react";

import { RegisterForm } from "./_components/register-form";
import Link from "next/link";

const tradingQuotes = [
  {
    quote:
      "The most important quality for an investor is temperament, not intellect.",
    author: "Warren Buffett",
  },
  {
    quote:
      "It's not whether you're right or wrong that's important, but how much money you make when you're right and how much you lose when you're wrong.",
    author: "George Soros",
  },
  {
    quote:
      "The key to trading success is emotional discipline. If intelligence were the key, there would be a lot more people making money trading.",
    author: "Victor Sperandeo",
  },
  {
    quote: "The trend is your friend until the end when it bends.",
    author: "Ed Seykota",
  },
  {
    quote: "Do more of what works and less of what doesn't.",
    author: "Steve Clark",
  },
  {
    quote:
      "The elements of good trading are: cutting losses, cutting losses, and cutting losses.",
    author: "Ed Seykota",
  },
];

export default function RegisterPage() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % tradingQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-zinc-950 lg:flex lg:items-center lg:justify-center p-12">
        {/* Content */}
        <div className="relative z-10 max-w-2xl">
          <div className="mb-12 flex items-center gap-4">
            <Quote className="h-12 w-12 text-white/40" />
          </div>

          <blockquote className="space-y-8">
            <p
              key={`quote-${currentQuoteIndex}`}
              className="text-4xl font-light text-white leading-relaxed animate-[fadeInUp_0.8s_ease-out]"
            >
              &ldquo;{tradingQuotes[currentQuoteIndex].quote}&rdquo;
            </p>
            <footer
              key={`author-${currentQuoteIndex}`}
              className="text-xl text-gray-400 font-medium animate-[fadeInUp_0.8s_ease-out_0.2s_both]"
            >
              — {tradingQuotes[currentQuoteIndex].author}
            </footer>
          </blockquote>

          <div className="flex gap-2 mt-12">
            {tradingQuotes.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuoteIndex(index)}
                className={`h-2 rounded-full transition-all duration-500 ease-out ${
                  index === currentQuoteIndex
                    ? "w-8 bg-white"
                    : "w-2 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to quote ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 font-medium text-xl font-medium text-gray-900"
          >
            <TrendingUp className="h-8 w-8 text-gray-900" />
            Trade2Learn
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
