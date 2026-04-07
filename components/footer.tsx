import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"
import { NewsletterForm } from "@/components/newsletter-form"
import { FooterSocialLinks } from "@/components/footer-social-links"

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      {/* Newsletter */}
      <div className="relative bg-primary py-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-foreground/5 to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            <div className="text-center lg:text-left max-w-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-foreground/10 mb-4">
                <Mail className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-primary-foreground tracking-tight">
                Restez informé
              </h3>
              <p className="text-primary-foreground/85 text-base mt-2 leading-relaxed">
                Inscrivez-vous à notre newsletter et recevez nos offres exclusives, nouveautés et bons plans.
              </p>
            </div>
            <div className="w-full lg:max-w-md shrink-0">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <p className="text-background/70 text-sm leading-relaxed">
              Caroline Logistic - Votre partenaire e-commerce de confiance. 
              Produits de qualité, livraison rapide et service client dédié.
            </p>
            <FooterSocialLinks />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-background/70 hover:text-primary text-sm transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/boutique" className="text-background/70 hover:text-primary text-sm transition-colors">
                  Boutique
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-background/70 hover:text-primary text-sm transition-colors">
                  Catégories
                </Link>
              </li>
              <li>
                <Link href="/promotions" className="text-background/70 hover:text-primary text-sm transition-colors">
                  Promotions
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="text-background/70 hover:text-primary text-sm transition-colors">
                  À Propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-background/70 hover:text-primary text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Service Client</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/mon-compte" className="text-background/70 hover:text-primary text-sm transition-colors">
                  Mon Compte
                </Link>
              </li>
              <li>
                <Link href="/suivi-commande" className="text-background/70 hover:text-primary text-sm transition-colors">
                  Suivi de Commande
                </Link>
              </li>
              <li>
                <Link href="/retours-remboursements" className="text-background/70 hover:text-primary text-sm transition-colors">
                  Retours & Remboursements
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-background/70 hover:text-primary text-sm transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/conditions-generales" className="text-background/70 hover:text-primary text-sm transition-colors">
                  Conditions Générales
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="text-background/70 hover:text-primary text-sm transition-colors">
                  Politique de Confidentialité
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-background/70 text-sm">Challans – France<br />85300</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col text-background/70 text-sm">
                  <a href="tel:+33745223664" className="hover:text-primary transition-colors">+33 7 45 22 36 64</a>
                  <a href="tel:+33760270890" className="hover:text-primary transition-colors">+33 7 60 27 08 90</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href="mailto:infocarolinelogistics@gmail.com" className="text-background/70 text-sm hover:text-primary transition-colors">infocarolinelogistics@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/60">
            <p>
              &copy; 2026 Caroline Logistic. Tous droits réservés. Design by{" "}
              <a 
                href="https://yarabyte.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition-colors"
              >
                yarabyte.com
              </a>
            </p>
            <div className="flex flex-col items-center md:items-end gap-3">
              <span className="text-xs text-background/70">Moyens de paiement acceptés</span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {/* Visa */}
                <div className="flex items-center justify-center w-12 h-8 bg-white rounded border border-background/20 shadow-sm px-1.5">
                  <span className="text-[10px] font-bold text-[#1434CB] tracking-tight">Visa</span>
                </div>
                
                {/* Mastercard */}
                <div className="flex items-center justify-center w-12 h-8 bg-white rounded border border-background/20 shadow-sm">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-[#EB001B] -mr-3"></div>
                    <div className="w-6 h-6 rounded-full bg-[#F79E1B]"></div>
                  </div>
                </div>
                
                {/* American Express */}
                <div className="flex items-center justify-center w-12 h-8 bg-white rounded border border-background/20 shadow-sm">
                  <span className="text-[9px] font-bold text-[#006FCF]">AMEX</span>
                </div>
                
                {/* Generic Card Icon */}
                <div className="flex items-center justify-center w-12 h-8 bg-background/10 rounded border border-background/20">
                  <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none">
                    <rect width="32" height="20" rx="2" fill="#1A1F71"/>
                    <rect x="4" y="6" width="6" height="4" rx="1" fill="white"/>
                    <rect x="12" y="6" width="16" height="4" rx="1" fill="white"/>
                    <rect x="4" y="12" width="8" height="2" rx="1" fill="#8B9DC3"/>
                    <rect x="4" y="15" width="12" height="2" rx="1" fill="#8B9DC3"/>
                  </svg>
                </div>
                
                {/* PayPal */}
                <div className="flex items-center justify-center w-12 h-8 bg-white rounded border border-background/20 shadow-sm px-1">
                  <svg className="w-9 h-5" viewBox="0 0 24 24" fill="#003087">
                    <path d="M20.067 8.27c.086.57.075 1.34-.032 2.2-.12.94-.42 1.88-.936 2.717-.526.85-1.275 1.558-2.238 2.105-.99.56-2.15.876-3.4.876H12.3l-.595 3.763a1.23 1.23 0 0 1-1.212 1.014H8.58a.96.96 0 0 1-.944-.792L4.35 2.77A.96.96 0 0 1 5.294 1.8h5.722c1.892 0 3.105.404 3.736 1.238.63.834.78 1.966.435 3.392z"/>
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4 text-background/50" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.905 0-4.357-.927-5.93-1.763L4.35 24c1.732.888 4.357 1.444 6.953 1.444 2.532 0 4.735-.624 6.283-1.813 1.583-1.188 2.467-3.169 2.467-5.298 0-4.532-2.692-6.249-6.977-7.183h.001z"/>
                </svg>
                <span className="text-xs text-background/50">Paiement sécurisé par Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
