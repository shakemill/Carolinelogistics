"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function ContactForm() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const name = (formData.get("name") as string)?.trim()
    const email = (formData.get("email") as string)?.trim()
    const phone = (formData.get("phone") as string)?.trim()
    const subject = (formData.get("subject") as string)?.trim()
    const message = (formData.get("message") as string)?.trim()

    if (!name || !email || !message) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir le nom, l'email et le message.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, message }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        toast({
          title: "Message envoyé",
          description: "Nous vous répondrons dans les plus brefs délais.",
          variant: "success",
        })
        form.reset()
      } else {
        toast({
          title: "Erreur",
          description: data.error ?? "Impossible d'envoyer le message.",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
            Nom complet
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="Votre nom"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="votre@email.com"
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
          Téléphone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="+33 X XX XX XX XX"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
          Sujet
        </label>
        <select
          id="subject"
          name="subject"
          className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          disabled={loading}
        >
          <option value="">Sélectionnez un sujet</option>
          <option value="order">Question sur une commande</option>
          <option value="product">Information sur un produit</option>
          <option value="delivery">Livraison</option>
          <option value="partnership">Partenariat</option>
          <option value="other">Autre</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          minLength={10}
          className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
          placeholder="Votre message..."
          disabled={loading}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Envoyer le message
          </>
        )}
      </Button>
    </form>
  )
}
