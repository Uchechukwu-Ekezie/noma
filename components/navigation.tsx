import Link from "next/link";
import Image from "next/image";

import { MessageCircle, Search } from "lucide-react";
import { PrivyWalletConnect } from "./privy-wallet-connect";

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-[#2b2b2b] text-white ">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-xl font-bold text-[#A259FF] flex items-center gap-2"
            >
              <Image
                src="/noma_logo.svg"
                alt="Noma Logo"
                width={50}
                height={40}
              />
              Noma
            </Link>

            <div className="items-center hidden gap-6 md:flex">
              <Link
                href="/marketplace"
                className="flex items-center gap-2 text-[16px] font-semibold text-white transition-colors hover:text-[#A259FF]"
              >
                <Search className="w-4 h-4" />
                Marketplace
              </Link>
              <Link
                href="/messages"
                className="flex items-center gap-2 text-[16px] font-semibold text-white transition-colors hover:text-[#A259FF]"
              >
                <MessageCircle className="w-4 h-4" />
                Messages
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <PrivyWalletConnect />
          </div>
        </div>
      </div>
    </nav>
  );
}
