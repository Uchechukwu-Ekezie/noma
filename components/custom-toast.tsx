"use client"

import * as React from "react"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface CustomToastProps {
  title?: string
  description?: string
  variant?: "default" | "success" | "error" | "warning" | "info"
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

const toastVariants = {
  default: {
    icon: Info,
    className: "bg-[#2b2b2b] border-[#A259FF]/20 text-white",
    iconColor: "text-[#A259FF]",
  },
  success: {
    icon: CheckCircle,
    className: "bg-green-900/90 border-green-500/30 text-white",
    iconColor: "text-green-400",
  },
  error: {
    icon: XCircle,
    className: "bg-red-900/90 border-red-500/30 text-white",
    iconColor: "text-red-400",
  },
  warning: {
    icon: AlertTriangle,
    className: "bg-yellow-900/90 border-yellow-500/30 text-white",
    iconColor: "text-yellow-400",
  },
  info: {
    icon: Info,
    className: "bg-blue-900/90 border-blue-500/30 text-white",
    iconColor: "text-blue-400",
  },
}

export function showCustomToast({
  title,
  description,
  variant = "default",
  duration = 5000,
  action,
}: CustomToastProps) {
  const variantConfig = toastVariants[variant]
  const Icon = variantConfig.icon

  return toast({
    title: title,
    description: description,
    duration,
    action: action && (
      <Button
        onClick={action.onClick}
        className="bg-[#A259FF] hover:bg-[#A259FF]/90 text-white px-3 py-1 h-auto text-xs rounded-[10px]"
      >
        {action.label}
      </Button>
    ),
    className: cn(
      "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-[20px] border p-4 pr-8 shadow-lg transition-all",
      "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out",
      "data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full",
      "data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
      variantConfig.className
    ),
  })
}

// Convenience functions for different toast types
export const toastSuccess = (title: string, description?: string) =>
  showCustomToast({ title, description, variant: "success" })

export const toastError = (title: string, description?: string) =>
  showCustomToast({ title, description, variant: "error" })

export const toastWarning = (title: string, description?: string) =>
  showCustomToast({ title, description, variant: "warning" })

export const toastInfo = (title: string, description?: string) =>
  showCustomToast({ title, description, variant: "info" })

export const toastDefault = (title: string, description?: string) =>
  showCustomToast({ title, description, variant: "default" })
