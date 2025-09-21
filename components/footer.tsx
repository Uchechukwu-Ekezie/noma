import Link from "next/link";
import { 
  Twitter, 
  Linkedin, 
  Github, 
  ArrowRight,
  Globe,
  MessageCircle,
  Search,
  Home,
  Mail
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#2b2b2b] border-t border-[#A259FF]/20">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#A259FF] rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-[#A259FF]">Noma</span>
            </div>
            <p className="text-white/80 leading-relaxed">
              A modern web application platform built with Next.js, TypeScript, and Tailwind CSS. 
              Experience the future of web development.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://twitter.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#3b3b3b] rounded-lg flex items-center justify-center hover:bg-[#A259FF] transition-colors"
              >
                <Twitter className="w-5 h-5 text-white/80 hover:text-white" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#3b3b3b] rounded-lg flex items-center justify-center hover:bg-[#A259FF] transition-colors"
              >
                <Linkedin className="w-5 h-5 text-white/80 hover:text-white" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#3b3b3b] rounded-lg flex items-center justify-center hover:bg-[#A259FF] transition-colors"
              >
                <Github className="w-5 h-5 text-white/80 hover:text-white" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Navigation</h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/" 
                  className="text-white/80 hover:text-[#A259FF] transition-colors flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/marketplace" 
                  className="text-white/80 hover:text-[#A259FF] transition-colors flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Marketplace
                </Link>
              </li>
              <li>
                <Link 
                  href="/messages" 
                  className="text-white/80 hover:text-[#A259FF] transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Messages
                </Link>
              </li>
              <li>
                <Link 
                  href="/portfolio" 
                  className="text-white/80 hover:text-[#A259FF] transition-colors flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Support</h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/messages" 
                  className="text-white/80 hover:text-[#A259FF] transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact Us
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:support@noma.app" 
                  className="text-white/80 hover:text-[#A259FF] transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email Support
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-[#A259FF] transition-colors flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-white/80 hover:text-[#A259FF] transition-colors flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Stay Updated</h3>
            <p className="text-white/80">
              Get the latest updates and news about Noma delivered to your inbox.
            </p>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-[#3b3b3b] border border-[#A259FF]/30 text-white placeholder:text-white/60 focus:border-[#A259FF] focus:ring-[#A259FF] px-4 py-3 rounded-[20px] text-sm"
                />
                <button className="bg-[#A259FF] hover:bg-[#A259FF]/90 text-white px-6 py-3 rounded-[20px] font-semibold flex items-center gap-2 text-sm transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-white/60">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="border-t border-[#A259FF]/20 pt-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#A259FF] mb-2">1K+</div>
              <div className="text-sm text-white/80">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#A259FF] mb-2">5K+</div>
              <div className="text-sm text-white/80">Projects Built</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#A259FF] mb-2">99.9%</div>
              <div className="text-sm text-white/80">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#A259FF] mb-2">24/7</div>
              <div className="text-sm text-white/80">Support</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#A259FF]/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white/60 text-sm">
              © 2024 Noma. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-white/60 hover:text-[#A259FF] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-white/60 hover:text-[#A259FF] transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-white/60 hover:text-[#A259FF] transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
