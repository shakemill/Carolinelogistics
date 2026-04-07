"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle2, AlertCircle, Info } from "lucide-react"

function ToastIcon({ variant }: { variant?: string }) {
  const iconClass = "h-6 w-6 shrink-0"
  switch (variant) {
    case "success":
      return <CheckCircle2 className={`${iconClass} text-green-600 dark:text-green-400`} />
    case "destructive":
      return <AlertCircle className={`${iconClass} text-destructive`} />
    default:
      return <Info className={`${iconClass} text-primary`} />
  }
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <ToastIcon variant={variant} />
              <div className="grid gap-1 flex-1 min-w-0">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
