import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"
import Link from "next/link"

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Paiement annulé
            </h1>
            <p className="text-muted-foreground mb-8">
              Votre paiement a été annulé. Aucun montant n'a été débité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/checkout">Réessayer</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/boutique">Retour à la boutique</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
