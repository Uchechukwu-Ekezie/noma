"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, RefreshCw, AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#2b2b2b] text-[#A259FF] flex items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-12 h-12 text-red-400" />
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-red-500 to-transparent mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Oops! Something Went Wrong
          </h1>
          <p className="text-lg text-[#A259FF]/80 mb-2">
            We encountered an unexpected error while processing your request.
          </p>
          <p className="text-base text-white/60 mb-4">
            Don&apos;t worry, our team has been notified and we&apos;re working on a fix.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details className="text-left bg-black/20 p-4 rounded-lg mt-4">
              <summary className="cursor-pointer text-sm text-white/60 mb-2">
                Error Details (Development Only)
              </summary>
              <pre className="text-xs text-red-400 overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            onClick={reset}
            className="bg-[#A259FF] text-white px-8 py-4 rounded-[20px] font-semibold hover:bg-[#A259FF]/90 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </Button>
          
          <Link href="/">
            <Button 
              variant="outline"
              className="border-2 border-[#A259FF] text-[#A259FF] px-8 py-4 rounded-[20px] font-semibold hover:bg-[#A259FF] hover:text-white transition-colors flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Help Section */}
        <div className="border-t border-[#A259FF]/20 pt-8">
          <p className="text-sm text-white/60 mb-4">
            If this problem persists, please contact support.
          </p>
          <Link href="/messages">
            <Button 
              variant="ghost" 
              className="text-[#A259FF] hover:bg-[#A259FF]/10 rounded-[20px] flex items-center gap-2 mx-auto"
            >
              Contact Support
            </Button>
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-red-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-red-500/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-5 w-16 h-16 bg-red-500/8 rounded-full blur-lg"></div>
      </div>
    </div>
  )
}
