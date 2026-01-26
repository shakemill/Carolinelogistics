"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function PromotionBanner() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Banner 1 - Hot Deals */}
          <div className="relative bg-primary rounded-2xl overflow-hidden p-8 md:p-10">
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-white/20 text-primary-foreground text-sm font-medium rounded-full mb-4">
                Hot Deals
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                Jusqu&apos;à -50%
              </h3>
              <p className="text-primary-foreground/80 mb-6 max-w-xs">
                Sur une sélection de produits électroniques. Offre limitée !
              </p>
              <Button asChild variant="secondary" className="bg-white text-primary hover:bg-white/90">
                <Link href="/promotions">
                  Voir les offres
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 right-10 w-24 h-24 bg-white/10 rounded-full translate-y-1/2" />
          </div>

          {/* Banner 2 - Weekly Promo */}
          <div className="relative bg-secondary rounded-2xl overflow-hidden p-8 md:p-10">
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-white/20 text-secondary-foreground text-sm font-medium rounded-full mb-4">
                Promo de la Semaine
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-secondary-foreground mb-2">
                Livraison Gratuite
              </h3>
              <p className="text-secondary-foreground/80 mb-6 max-w-xs">
                Pour toute commande supérieure à 50 000 FCFA cette semaine.
              </p>
              <Button asChild className="bg-white text-secondary hover:bg-white/90">
                <Link href="/boutique">
                  Commander
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 right-10 w-24 h-24 bg-white/10 rounded-full translate-y-1/2" />
          </div>
        </div>

        {/* Countdown promo */}
        <div className="mt-6 bg-[#6ea935] rounded-2xl p-6 md:p-8 text-center">
          <p className="text-white/80 text-sm mb-2">Offre Flash - Se termine dans</p>
          <div className="flex items-center justify-center gap-4 mb-4">
            {[
              { value: "02", label: "Jours" },
              { value: "14", label: "Heures" },
              { value: "35", label: "Minutes" },
              { value: "20", label: "Secondes" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 rounded-lg flex items-center justify-center mb-1">
                  <span className="text-xl md:text-2xl font-bold text-white">{item.value}</span>
                </div>
                <span className="text-xs text-white/80">{item.label}</span>
              </div>
            ))}
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
            Soldes de Saison - Profitez de -40% sur la Mode
          </h3>
          <Button asChild className="bg-white text-[#6ea935] hover:bg-white/90">
            <Link href="/promotions">
              Découvrir maintenant
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
