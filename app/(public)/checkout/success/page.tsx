"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Package, Mail } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, Suspense } from "react"
import { useCart } from "@/components/shop/cart-context"
import Link from "next/link"

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const { clearCart } = useCart()

  useEffect(() => {
    if (sessionId) {
      clearCart()
    }
  }, [sessionId, clearCart])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg mx-auto flex flex-col items-center">
          <Breadcrumb
            items={[
              { label: "Boutique", href: "/boutique" },
              { label: "Checkout", href: "/checkout" },
              { label: "Succès" },
            ]}
            className="mb-8 self-start"
          />
          <Card className="w-full border-2 border-primary/20 bg-gradient-to-b from-primary/5 to-transparent shadow-lg">
            <CardContent className="pt-10 pb-8 px-8 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 mb-8 ring-4 ring-green-200 dark:ring-green-800/50">
                <CheckCircle className="w-14 h-14 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Commande confirmée
              </h1>
              <p className="text-muted-foreground text-lg mb-8 max-w-sm mx-auto">
                Merci pour votre achat. Votre commande a été enregistrée et sera traitée dans les plus brefs délais.
              </p>
              <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                <p className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4 shrink-0 text-green-600 dark:text-green-400" />
                  Un email de confirmation vous a été envoyé.
                </p>
                <p className="flex items-center justify-center gap-2">
                  <Package className="w-4 h-4 shrink-0 text-green-600 dark:text-green-400" />
                  Vous pouvez suivre votre commande depuis la page Suivi de commande.
                </p>
              </div>
            </CardContent>
          </Card>
          <div className="w-full mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="min-w-[200px]">
              <Link href="/boutique">Continuer les achats</Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="min-w-[200px]">
              <Link href="/suivi-commande">Suivre ma commande</Link>
            </Button>
            <Button variant="ghost" asChild size="lg">
              <Link href="/">Retour à l'accueil</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center px-4">
            <div className="text-center text-muted-foreground">Chargement...</div>
          </main>
          <Footer />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  )
}
