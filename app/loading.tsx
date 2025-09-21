export default function Loading() {
  return (
    <div className="min-h-screen bg-[#2b2b2b] text-[#A259FF] flex items-center justify-center">
      <div className="text-center">
        {/* Loading Spinner */}
        <div className="relative mb-8">
          <div className="w-16 h-16 border-4 border-[#A259FF]/20 border-t-[#A259FF] rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-[#A259FF]/40 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        </div>

        {/* Loading Text */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Loading...
          </h2>
          <p className="text-[#A259FF]/80">
            Preparing your experience
          </p>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-[#A259FF] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[#A259FF] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-[#A259FF] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-[#A259FF]/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#A259FF]/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-5 w-16 h-16 bg-[#A259FF]/8 rounded-full blur-lg animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  )
}
