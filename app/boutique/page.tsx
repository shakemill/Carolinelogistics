import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Star, Filter, Grid3X3, List, ChevronDown } from "lucide-react"

const products = [
  { id: 1, name: "Smartphone Premium X12", category: "Électronique", price: 250000, originalPrice: 320000, rating: 4.8, reviews: 124, badge: "Promo", badgeColor: "bg-primary" },
  { id: 2, name: "Montre Connectée Pro", category: "Accessoires", price: 75000, originalPrice: null, rating: 4.5, reviews: 89, badge: "Nouveau", badgeColor: "bg-[#6ea935]" },
  { id: 3, name: "Écouteurs Sans Fil Elite", category: "Audio", price: 45000, originalPrice: 60000, rating: 4.7, reviews: 256, badge: "Bestseller", badgeColor: "bg-secondary" },
  { id: 4, name: "Sac à Dos Business", category: "Mode", price: 35000, originalPrice: null, rating: 4.3, reviews: 67, badge: null, badgeColor: null },
  { id: 5, name: "Lampe LED Intelligente", category: "Maison", price: 28000, originalPrice: 35000, rating: 4.6, reviews: 143, badge: "Promo", badgeColor: "bg-primary" },
  { id: 6, name: "Crème Hydratante Bio", category: "Beauté", price: 15000, originalPrice: null, rating: 4.9, reviews: 312, badge: "Top Vente", badgeColor: "bg-secondary" },
  { id: 7, name: "Tapis de Yoga Premium", category: "Sport", price: 22000, originalPrice: 28000, rating: 4.4, reviews: 78, badge: null, badgeColor: null },
  { id: 8, name: "Café Arabica 500g", category: "Alimentation", price: 8500, originalPrice: null, rating: 4.8, reviews: 189, badge: "Local", badgeColor: "bg-[#6ea935]" },
  { id: 9, name: "Tablette Tactile 10 pouces", category: "Électronique", price: 180000, originalPrice: 220000, rating: 4.6, reviews: 98, badge: "Promo", badgeColor: "bg-primary" },
  { id: 10, name: "Chaussures de Running", category: "Sport", price: 45000, originalPrice: null, rating: 4.7, reviews: 156, badge: null, badgeColor: null },
  { id: 11, name: "Parfum Élégance 100ml", category: "Beauté", price: 32000, originalPrice: 40000, rating: 4.5, reviews: 87, badge: "Promo", badgeColor: "bg-primary" },
  { id: 12, name: "Casque Audio Pro", category: "Audio", price: 65000, originalPrice: null, rating: 4.8, reviews: 234, badge: "Nouveau", badgeColor: "bg-[#6ea935]" },
]

const categories = ["Tous", "Électronique", "Mode", "Beauté", "Maison", "Sport", "Alimentation"]

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR").format(price) + " FCFA"
}

export default function BoutiquePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-muted py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Notre Boutique</h1>
            <p className="text-muted-foreground mt-2">Découvrez notre sélection de produits de qualité</p>
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <span>Accueil</span>
              <span>/</span>
              <span className="text-primary">Boutique</span>
            </div>
          </div>
        </section>

        {/* Filters & Products */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <aside className="lg:w-64 shrink-0">
                <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filtres
                  </h3>

                  {/* Categories */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-foreground mb-3">Catégories</h4>
                    <div className="space-y-2">
                      {categories.map((cat) => (
                        <label key={cat} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="category" defaultChecked={cat === "Tous"} className="accent-primary" />
                          <span className="text-sm text-muted-foreground hover:text-foreground">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-foreground mb-3">Prix</h4>
                    <div className="space-y-2">
                      {["0 - 25 000 FCFA", "25 000 - 50 000 FCFA", "50 000 - 100 000 FCFA", "100 000+ FCFA"].map((range) => (
                        <label key={range} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="accent-primary" />
                          <span className="text-sm text-muted-foreground">{range}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Promo */}
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="accent-primary" />
                      <span className="text-sm text-muted-foreground">En promotion uniquement</span>
                    </label>
                  </div>

                  <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
                    Appliquer
                  </Button>
                </div>
              </aside>

              {/* Products */}
              <div className="flex-1">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <p className="text-muted-foreground text-sm">
                    Affichage de <span className="font-medium text-foreground">12</span> produits
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 border border-border rounded bg-primary text-primary-foreground">
                        <Grid3X3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 border border-border rounded hover:bg-muted">
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Trier par:</span>
                      <button className="flex items-center gap-1 px-3 py-2 border border-border rounded text-sm">
                        Pertinence
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all"
                    >
                      {/* Image */}
                      <div className="relative aspect-square bg-muted">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-2xl font-bold text-primary">
                              {product.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        {product.badge && (
                          <span className={`absolute top-2 left-2 ${product.badgeColor} text-white text-xs font-medium px-2 py-1 rounded`}>
                            {product.badge}
                          </span>
                        )}
                        <button className="absolute top-2 right-2 w-8 h-8 bg-card rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-primary-foreground transition-all">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                        <h3 className="font-medium text-foreground mt-1 line-clamp-2 text-sm group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-2">
                          <Star className="w-3 h-3 fill-secondary text-secondary" />
                          <span className="text-xs font-medium text-foreground">{product.rating}</span>
                          <span className="text-xs text-muted-foreground">({product.reviews})</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="font-bold text-primary">{formatPrice(product.price)}</span>
                          {product.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full mt-3 bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 mt-10">
                  <Button variant="outline" size="sm" disabled>Précédent</Button>
                  <Button size="sm" className="bg-primary text-primary-foreground">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm">Suivant</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
