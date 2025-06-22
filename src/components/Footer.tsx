
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative z-10 py-12 px-6 border-t border-cyan-500/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
              ARK ❍
            </div>
            <p className="text-gray-400 text-sm">
              Salvation from the crypto flood. Join the ARK and be saved.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-cyan-400 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#swap" className="hover:text-cyan-400 transition-colors">Swap</a></li>
              <li><Link to="/locker" className="hover:text-cyan-400 transition-colors">Locker</Link></li>
              <li><a href="#stats" className="hover:text-cyan-400 transition-colors">Stats</a></li>
              <li><a href="#chart" className="hover:text-cyan-400 transition-colors">Chart</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-cyan-400 mb-4">Community</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Telegram</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Medium</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-cyan-400 mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Whitepaper</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Audit</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Support</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-cyan-500/20 mt-8 pt-8 text-center text-gray-400 text-sm">
          &copy; 2025 THE ARK ❍. 0xACC15eF8fa2e702d0138c3662A9E7d696f40F021
        </div>
      </div>
    </footer>
  );
};

export default Footer;
