import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const features = [
  "Plus de 5 ans d'expérience",
  "Produits 100% authentiques",
  "Service client réactif",
  "Livraison dans toute la France",
]

export function AboutPreview() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/about-caroline.png"
                alt="Caroline Logistic - Votre partenaire logistique pour votre expansion"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            {/* Stats card */}
            <div className="absolute -bottom-6 -right-6 bg-card shadow-xl rounded-xl p-6 border border-border">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">5000+</p>
                <p className="text-sm text-muted-foreground">Clients Satisfaits</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              À Propos de Nous
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Caroline Logistic, votre partenaire e-commerce de confiance
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Depuis notre création, Caroline Logistic s&apos;engage à offrir une expérience d&apos;achat 
              en ligne exceptionnelle. Nous sélectionnons rigoureusement nos produits et partenaires 
              pour vous garantir qualité et satisfaction.
            </p>
            <ul className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#6ea935] shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/a-propos">
                En savoir plus
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
