import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      {/* Newsletter */}
      <div className="bg-primary py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-primary-foreground">Inscrivez-vous à notre Newsletter</h3>
              <p className="text-primary-foreground/80 text-sm">Recevez nos offres exclusives et promotions</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Votre email..."
                className="flex-1 md:w-72 px-4 py-2 rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                {"S'inscrire"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">CL</span>
              </div>
              <div>
                <h2 className="font-bold text-lg leading-tight">Caroline</h2>
                <p className="text-xs text-background/60 -mt-1">Logistic</p>
              </div>
            </div>
            <p className="text-background/70 text-sm leading-relaxed">
              Caroline Logistic - Votre partenaire e-commerce de confiance. 
              Produits de qualité, livraison rapide et service client dédié.
            </p>
            <div className="flex gap-3 mt-4">
              <Link href="#" className="w-9 h-9 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-9 h-9 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-9 h-9 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              {["Accueil", "Boutique", "Catégories", "Promotions", "À Propos", "Contact"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-background/70 hover:text-primary text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Service Client</h3>
            <ul className="space-y-2">
              {["Mon Compte", "Suivi de Commande", "Retours & Remboursements", "FAQ", "Conditions Générales", "Politique de Confidentialité"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-background/70 hover:text-primary text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-background/70 text-sm">Douala, Cameroun</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-background/70 text-sm">+237 6XX XXX XXX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-background/70 text-sm">contact@carolinelogistic.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-background/60">
            <p>&copy; 2026 Caroline Logistic. Tous droits réservés.</p>
            <div className="flex items-center gap-4">
              <span>Moyens de paiement:</span>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-background/10 rounded text-xs">Mobile Money</span>
                <span className="px-2 py-1 bg-background/10 rounded text-xs">Orange Money</span>
                <span className="px-2 py-1 bg-background/10 rounded text-xs">Carte</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
