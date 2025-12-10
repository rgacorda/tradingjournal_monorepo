import { TrendingUp, Quote } from "lucide-react";
import Link from "next/link";
import { LoginForm } from "./login-form";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const tradingQuotes = [
  {
    quote:
      "The stock market is filled with individuals who know the price of everything, but the value of nothing.",
    author: "Philip Fisher",
  },
  {
    quote: "In investing, what is comfortable is rarely profitable.",
    author: "Robert Arnott",
  },
  {
    quote:
      "The goal of a successful trader is to make the best trades. Money is secondary.",
    author: "Alexander Elder",
  },
  {
    quote: "Risk comes from not knowing what you're doing.",
    author: "Warren Buffett",
  },
  {
    quote:
      "The market is a device for transferring money from the impatient to the patient.",
    author: "Warren Buffett",
  },
  {
    quote: "Every battle is won before it is fought.",
    author: "Sun Tzu",
  },
];

export default function Loginss() {
  const searchParams = useSearchParams();
  const expired = searchParams.get("expired");
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    if (expired === "1") {
      toast.warning("Session expired. Please log in again.");
    }
  }, [expired]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % tradingQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 font-medium text-xl font-medium text-foreground"
          >
            <TrendingUp className="h-8 w-8 text-foreground" />
            Trade2Learn
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
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
    </div>
  );
}
