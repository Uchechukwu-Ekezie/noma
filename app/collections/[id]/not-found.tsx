"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, Home } from "lucide-react";

export default function CollectionNotFound() {
  return (
    <div className="min-h-screen bg-[#2b2b2b] text-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#A259FF] to-[#00D4FF] rounded-full flex items-center justify-center">
            <span className="text-6xl font-bold text-white">4</span>
          </div>
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#00D4FF] to-[#A259FF] rounded-full flex items-center justify-center -mt-8 ml-8">
            <span className="text-6xl font-bold text-white">0</span>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-white mb-4">Collection Not Found</h1>
        <p className="text-xl text-white/80 mb-8 leading-relaxed">
          The collection you&apos;re looking for doesn&apos;t exist or may have been removed.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-[#A259FF] hover:bg-[#A259FF]/90 text-white px-8 py-4 rounded-[20px] font-semibold">
              <Link href="/marketplace" className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Browse Collections
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              className="border-2 border-[#A259FF] text-[#A259FF] hover:bg-[#A259FF] hover:text-white px-8 py-4 rounded-[20px] font-semibold"
            >
              <Link href="/" className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="pt-4">
            <Button
              onClick={() => window.history.back()}
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/10 px-6 py-3 rounded-[20px]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-12 p-6 bg-[#3b3b3b] rounded-[20px] border border-[#A259FF]/20">
          <h3 className="text-lg font-semibold text-white mb-2">Need Help?</h3>
          <p className="text-white/80 text-sm leading-relaxed">
            If you believe this is an error, please check the URL or try browsing our collections from the marketplace.
          </p>
        </div>
      </div>
    </div>
  );
}
