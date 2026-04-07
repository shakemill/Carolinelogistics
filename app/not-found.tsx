import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Home, Search, Package } from "lucide-react"
import { BackButton } from "./not-found-client"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            {/* 404 Illustration */}
            <div className="mb-8">
              <div className="relative inline-block">
                <div className="text-9xl font-bold text-primary/20 select-none">
                  404
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="w-24 h-24 text-primary/40" />
                </div>
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Page introuvable
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              Oups ! La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            <p className="text-muted-foreground mb-8">
              Il se peut que l'URL soit incorrecte ou que la page ait été supprimée.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Retour à l'accueil
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/boutique">
                  <Search className="w-4 h-4 mr-2" />
                  Voir la boutique
                </Link>
              </Button>
              <BackButton />
            </div>

            {/* Helpful Links */}
            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">
                Pages populaires :
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/boutique"
                  className="text-sm text-primary hover:underline"
                >
                  Boutique
                </Link>
                <Link
                  href="/categories"
                  className="text-sm text-primary hover:underline"
                >
                  Catégories
                </Link>
                <Link
                  href="/a-propos"
                  className="text-sm text-primary hover:underline"
                >
                  À Propos
                </Link>
                <Link
                  href="/contact"
                  className="text-sm text-primary hover:underline"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
