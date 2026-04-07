"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "default" | "danger"
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open) d.showModal()
    else d.close()
  }, [open])

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault()
    onCancel()
  }

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault()
    onConfirm()
  }

  const handleDialogCancel = () => {
    onCancel()
  }

  return (
    <dialog
      ref={ref}
      onCancel={handleDialogCancel}
      className={cn(
        "fixed inset-0 z-50 m-auto max-h-[85vh] w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-xl",
        "backdrop:bg-black/50 backdrop:backdrop-blur-sm",
        "open:animate-in open:slide-in-from-bottom-full open:duration-200",
        "[&::backdrop]:bg-black/50"
      )}
    >
      <form method="dialog" onSubmit={handleConfirm}>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            {cancelLabel}
          </Button>
          <Button type="submit" variant={variant === "danger" ? "destructive" : "default"}>
            {confirmLabel}
          </Button>
        </div>
      </form>
    </dialog>
  )
}
