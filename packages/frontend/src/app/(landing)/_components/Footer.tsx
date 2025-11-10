import React from 'react';
import { TrendingUp} from 'lucide-react';

const Footer = () => {
  // const footerLinks = {
  //   Product: ['Features', 'Pricing', 'API', 'Integrations', 'Changelog'],
  //   Company: ['About Us', 'Careers', 'Press', 'Blog', 'Partners'],
  //   Resources: ['Documentation', 'Help Center', 'Community', 'Webinars', 'Trading Guides'],
  //   Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR', 'Security']
  // };

  // const socialLinks = [
  //   { icon: Twitter, href: '#', label: 'Twitter' },
  //   { icon: Facebook, href: '#', label: 'Facebook' },
  //   { icon: Linkedin, href: '#', label: 'LinkedIn' },
  //   { icon: Github, href: '#', label: 'GitHub' }
  // ];

  return (
    <footer className="bg-black text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-6 gap-8">
          {/* Brand and Contact */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="p-2 rounded-lg bg-white">
                <TrendingUp className="h-5 w-5 text-black" />
              </div>
              <span className="text-xl font-bold text-white">
                Trade2Learn
              </span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              The most comprehensive trading journal and analytics platform.
              Track, analyze, and improve your trading performance with advanced statistics and insights.
            </p>
            {/* <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-400">support@trade2learn.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-400">New York, NY 10001</span>
              </div>
            </div> */}
          </div>

          {/* Links */}
          {/* {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))} */}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 Trade2Learn. All rights reserved.
            </div>
            
            {/* <div className="flex space-x-6">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label={label}
                >
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;