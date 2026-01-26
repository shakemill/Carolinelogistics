import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CheckCircle, Users, Package, Truck, Award, Target, Heart, Zap } from "lucide-react"

const stats = [
  { value: "5000+", label: "Clients Satisfaits", icon: Users },
  { value: "10K+", label: "Produits Vendus", icon: Package },
  { value: "50+", label: "Partenaires", icon: Award },
  { value: "24/7", label: "Support Client", icon: Zap },
]

const values = [
  {
    icon: Target,
    title: "Notre Mission",
    description: "Offrir une expérience d'achat en ligne exceptionnelle avec des produits de qualité à des prix compétitifs.",
  },
  {
    icon: Heart,
    title: "Nos Valeurs",
    description: "Intégrité, qualité et satisfaction client sont au cœur de chaque décision que nous prenons.",
  },
  {
    icon: Truck,
    title: "Notre Engagement",
    description: "Livraison rapide et fiable partout au Cameroun avec un service client réactif et attentionné.",
  },
]

const team = [
  { name: "Caroline Mballa", role: "Fondatrice & CEO", initials: "CM" },
  { name: "Jean-Pierre Nguema", role: "Directeur Commercial", initials: "JN" },
  { name: "Marie Essomba", role: "Responsable Logistique", initials: "ME" },
  { name: "Paul Kamga", role: "Responsable Service Client", initials: "PK" },
]

export default function AProposPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-muted py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">À Propos de Nous</h1>
            <p className="text-muted-foreground mt-2">Découvrez notre histoire et notre équipe</p>
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <span>Accueil</span>
              <span>/</span>
              <span className="text-primary">À Propos</span>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <div className="relative">
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <span className="text-4xl font-bold text-primary">CL</span>
                    </div>
                    <p className="text-muted-foreground">Notre Histoire</p>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-card shadow-xl rounded-xl p-6 border border-border">
                  <p className="text-3xl font-bold text-primary">5+</p>
                  <p className="text-sm text-muted-foreground">{"Années d'expérience"}</p>
                </div>
              </div>

              {/* Content */}
              <div>
                <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                  Notre Histoire
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                  Une passion pour le commerce en ligne depuis 2020
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Caroline Logistic est née de la vision de rendre le commerce électronique accessible 
                  à tous au Cameroun. Fondée en 2020, notre entreprise a rapidement grandi pour devenir 
                  une référence dans le secteur e-commerce local.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Nous nous engageons à offrir une expérience d&apos;achat fluide, des produits de qualité 
                  rigoureusement sélectionnés, et un service client irréprochable. Notre réseau de 
                  partenaires nous permet de proposer une large gamme de produits à des prix compétitifs.
                </p>
                <ul className="space-y-3">
                  {["Produits 100% authentiques", "Livraison rapide et fiable", "Service client dédié", "Paiement sécurisé"].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#6ea935] shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    <stat.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold text-primary-foreground">{stat.value}</p>
                  <p className="text-primary-foreground/80 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">Ce qui nous définit</h2>
              <p className="text-muted-foreground mt-2">Nos valeurs fondamentales</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-card border border-border rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">Notre Équipe</h2>
              <p className="text-muted-foreground mt-2">Les personnes derrière Caroline Logistic</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <div key={index} className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-white">{member.initials}</span>
                  </div>
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-secondary-foreground mb-4">
              Prêt à découvrir nos produits ?
            </h2>
            <p className="text-secondary-foreground/80 mb-6 max-w-lg mx-auto">
              Rejoignez notre communauté de clients satisfaits et profitez de nos offres exclusives.
            </p>
            <a
              href="/boutique"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-secondary font-medium rounded-lg hover:bg-white/90 transition-colors"
            >
              Visiter la Boutique
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
