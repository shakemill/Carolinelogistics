"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Truck, Shield, Headphones } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-muted to-background overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <span className="inline-block px-4 py-1 bg-[#6ea935]/10 text-[#6ea935] text-sm font-medium rounded-full mb-4">
              Nouvelle Collection 2026
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
              Découvrez nos <span className="text-primary">Produits</span> de Qualité
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 text-pretty">
              Caroline Logistic vous propose une sélection de produits premium avec livraison rapide partout au Cameroun.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center lg:justify-start">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/boutique">
                  Voir la Boutique
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/promotions">
                  Nos Promotions
                </Link>
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="aspect-square max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/hero-shopping.jpg"
                alt="Shopping premium Caroline Logistic"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 left-4 bg-card shadow-lg rounded-xl p-4 border border-border">
              <p className="text-sm font-semibold text-foreground">-30%</p>
              <p className="text-xs text-muted-foreground">Sur la première commande</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-8 border-t border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Livraison Rapide</h3>
              <p className="text-sm text-muted-foreground">Partout au Cameroun</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Paiement Sécurisé</h3>
              <p className="text-sm text-muted-foreground">Transactions protégées</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#6ea935]/10 rounded-xl flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6 text-[#6ea935]" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Support 24/7</h3>
              <p className="text-sm text-muted-foreground">Assistance dédiée</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
