import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search, HelpCircle } from "lucide-react"
import { BackButton } from "@/components/back-button"

export default function NotFound() {

  return (
    <div className="min-h-screen bg-[#2b2b2b] text-[#A259FF] flex items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-[#A259FF] mb-4 opacity-80">
            404
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-[#A259FF] to-transparent mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-[#A259FF]/80 mb-2">
            The page you&apos;re looking for seems to have vanished into the digital void.
          </p>
          <p className="text-base text-white/60">
            Don&apos;t worry, even the best explorers sometimes take a wrong turn.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link href="/">
            <Button className="bg-[#A259FF] text-white px-8 py-4 rounded-[20px] font-semibold hover:bg-[#A259FF]/90 transition-colors flex items-center gap-2">
              <Home className="w-5 h-5" />
              Back to Home
            </Button>
          </Link>
          
          <BackButton>
            Go Back
          </BackButton>
          
          <Link href="/marketplace">
            <Button 
              variant="outline"
              className="border-2 border-[#A259FF] text-[#A259FF] px-8 py-4 rounded-[20px] font-semibold hover:bg-[#A259FF] hover:text-white transition-colors flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Browse Marketplace
            </Button>
          </Link>
        </div>

        {/* Help Section */}
        <div className="border-t border-[#A259FF]/20 pt-8">
          <p className="text-sm text-white/60 mb-4">
            Still can&apos;t find what you&apos;re looking for?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link href="/messages">
              <Button 
                variant="ghost" 
                className="text-[#A259FF] hover:bg-[#A259FF]/10 rounded-[20px] flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                Contact Support
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-[#A259FF]/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#A259FF]/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-5 w-16 h-16 bg-[#A259FF]/8 rounded-full blur-lg"></div>
      </div>
    </div>
  )
}
