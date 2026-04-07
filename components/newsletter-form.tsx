"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Loader2, Mail } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface NewsletterFormProps {
  variant?: "default" | "compact"
  className?: string
}

export function NewsletterForm({ variant = "default", className }: NewsletterFormProps) {
  const [email, setEmail] = useState("")
  const [consent, setConsent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer votre adresse email",
        variant: "destructive",
      })
      return
    }

    if (!consent) {
      toast({
        title: "Consentement requis",
        description: "Vous devez accepter de recevoir nos newsletters",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, consent }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue")
      }

      setIsSuccess(true)
      setEmail("")
      setConsent(false)
      
      toast({
        variant: "success",
        title: "Inscription réussie !",
        description: "Vous recevrez désormais nos newsletters et offres exclusives.",
      })

      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de vous inscrire. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className={`space-y-2 ${className}`}>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.fr"
              className="pl-10 h-11 border-border bg-background"
              disabled={isLoading || isSuccess}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || isSuccess || !consent}
            size="default"
            className="h-11 px-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90 shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isSuccess ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              "S'inscrire"
            )}
          </Button>
        </div>
        <label className="flex items-center gap-2 cursor-pointer text-xs text-primary-foreground/80">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="rounded border-primary-foreground/30 text-primary focus:ring-primary-foreground/20"
            disabled={isLoading || isSuccess}
            required
          />
          J'accepte de recevoir les newsletters et offres
        </label>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {isSuccess ? (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/20">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="font-medium text-primary-foreground">Inscription réussie !</p>
            <p className="text-sm text-primary-foreground/80">Vérifiez votre boîte mail pour confirmer.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-foreground/50" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.fr"
                className="h-12 pl-12 text-base rounded-xl border-2 border-primary-foreground/20 bg-white/10 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-2 focus-visible:ring-primary-foreground/30 focus-visible:border-primary-foreground/40"
                disabled={isLoading || isSuccess}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || isSuccess || !consent}
              size="lg"
              className="h-12 px-8 rounded-xl bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold shrink-0 shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Inscription...
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Inscrit !
                </>
              ) : (
                "S'inscrire"
              )}
            </Button>
          </div>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              id="newsletter-consent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-2 border-primary-foreground/30 text-primary focus:ring-2 focus:ring-primary-foreground/20 accent-primary-foreground"
              disabled={isLoading || isSuccess}
              required
            />
            <span className="text-sm text-primary-foreground/90 group-hover:text-primary-foreground transition-colors">
              J'accepte de recevoir la newsletter Caroline Logistic (offres, actualités). Désinscription possible à tout moment.
            </span>
          </label>
        </>
      )}
    </form>
  )
}
