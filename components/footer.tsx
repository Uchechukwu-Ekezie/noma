import Link from "next/link";
import Image from "next/image";
import {
  Twitter,
  Linkedin,
  Github,
  ArrowRight,
  Globe,
  MessageCircle,
  Search,
  Home,
  Mail,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#2b2b2b] border-t border-[#A259FF]/20">
      <div className="container px-4 py-16 mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg">
                <Image
                  src="/noma_logo.svg"
                  alt="Zephyra Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
              </div>
              <span className="text-2xl font-bold text-[#A259FF]">Zephyra</span>
            </div>
            <p className="leading-relaxed text-white/80">
              The premier Web3 domain marketplace. Discover, buy, and trade
              blockchain domains across multiple networks. Your gateway to the
              decentralized web.
            </p>
            <div className="flex gap-4">
              <a
                href="https://twitter.com/zephyra_domains"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#3b3b3b] rounded-lg flex items-center justify-center hover:bg-[#A259FF] transition-colors"
              >
                <Twitter className="w-5 h-5 text-white/80 hover:text-white" />
              </a>
              <a
                href="https://linkedin.com/company/zephyra-domains"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#3b3b3b] rounded-lg flex items-center justify-center hover:bg-[#A259FF] transition-colors"
              >
                <Linkedin className="w-5 h-5 text-white/80 hover:text-white" />
              </a>
              <a
                href="https://github.com/zephyra-domains"
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
                  href="mailto:support@zephyra.domains"
                  className="text-white/80 hover:text-[#A259FF] transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email Support
                </a>
              </li>
              <li>
                <a
                  href="https://docs.zephyra.domains"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-[#A259FF] transition-colors flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://status.zephyra.domains"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-[#A259FF] transition-colors flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  Service Status
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Stay Updated</h3>
            <p className="text-white/80">
              Get the latest Web3 domain trends, new listings, and marketplace
              updates delivered to your inbox.
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
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#A259FF] mb-2">10K+</div>
              <div className="text-sm text-white/80">Domains Listed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#A259FF] mb-2">
                2.5K+
              </div>
              <div className="text-sm text-white/80">Active Traders</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#A259FF] mb-2">50+</div>
              <div className="text-sm text-white/80">Network Chains</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#A259FF] mb-2">24/7</div>
              <div className="text-sm text-white/80">Marketplace</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#A259FF]/20 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-sm text-white/60">
              © 2025 Zephyra Domains. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <a
                href="/privacy"
                className="text-white/60 hover:text-[#A259FF] transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-white/60 hover:text-[#A259FF] transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/security"
                className="text-white/60 hover:text-[#A259FF] transition-colors"
              >
                Security Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
