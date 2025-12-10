"use client";

import React, { useState } from "react";
import { Menu, X, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { IconMoon, IconSun } from "@tabler/icons-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-background/95 border-b border-border sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Trade2Learn
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
            >
              About
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-accent transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <IconSun className="h-5 w-5 text-foreground" />
              ) : (
                <IconMoon className="h-5 w-5 text-foreground" />
              )}
            </button>
            <Link
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
              href="/login"
            >
              Sign In
            </Link>
            <Link
              className="bg-primary text-primary-foreground px-5 py-2 rounded-lg hover:bg-primary/90 transition-all duration-200 font-semibold"
              href="/register"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors duration-200 text-foreground"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Pricing
              </a>
              <a
                href="#about"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                About
              </a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex items-center gap-2 text-left text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {theme === "dark" ? (
                    <>
                      <IconSun className="h-5 w-5" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <IconMoon className="h-5 w-5" />
                      Dark Mode
                    </>
                  )}
                </button>
                <Link
                  href="/login"
                  className="text-left text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-all duration-200 text-center font-semibold"
                >
                  Sign up
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
