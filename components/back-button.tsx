"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface BackButtonProps {
  className?: string
  children?: React.ReactNode
}

export function BackButton({ className, children }: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <Button 
      onClick={handleBack}
      variant="outline"
      className={`border-2 border-[#A259FF] text-[#A259FF] px-8 py-4 rounded-[20px] font-semibold hover:bg-[#A259FF] hover:text-white transition-colors flex items-center gap-2 ${className}`}
    >
      <ArrowLeft className="w-5 h-5" />
      {children || "Go Back"}
    </Button>
  )
}
