import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RotateCcw, Package, CreditCard, Clock, CheckCircle, AlertCircle } from "lucide-react"

export const metadata = {
  title: "Retours & Remboursements | Caroline Logistic",
  description: "Politique de retours et remboursements",
}

export default function RetoursRemboursementsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "Retours & Remboursements" },
          ]}
        />

        {/* Page Header */}
        <section className="py-12 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <RotateCcw className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Retours & Remboursements
              </h1>
              <p className="text-lg text-muted-foreground">
                Votre satisfaction est notre priorité. Découvrez notre politique de retours simple et transparente.
              </p>
            </div>
          </div>
        </section>

        {/* Main Policy */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <CheckCircle className="w-6 h-6 text-primary" />
                    Délai de rétractation : 14 jours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Conformément à la législation en vigueur, vous disposez d'un délai de <strong>14 jours</strong> à compter 
                    de la réception de votre commande pour exercer votre droit de rétractation, sans avoir à justifier de motifs 
                    ni à payer de pénalités.
                  </p>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm">
                      <strong>Important :</strong> Les produits doivent être retournés dans leur état d'origine, non utilisés, 
                      avec leur emballage d'origine et tous les accessoires.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Return Process */}
              <h2 className="text-3xl font-bold mb-8">Comment effectuer un retour ?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card>
                  <CardHeader>
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                      <span className="text-2xl font-bold text-primary">1</span>
                    </div>
                    <CardTitle>Contactez-nous</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Envoyez-nous un email à <a href="mailto:infocarolinelogistics@gmail.com" className="text-primary hover:underline">infocarolinelogistics@gmail.com</a> avec 
                      votre numéro de commande et le motif du retour.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                      <span className="text-2xl font-bold text-primary">2</span>
                    </div>
                    <CardTitle>Préparez le colis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Emballez soigneusement le(s) produit(s) dans leur emballage d'origine avec tous les accessoires 
                      et la facture.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                      <span className="text-2xl font-bold text-primary">3</span>
                    </div>
                    <CardTitle>Expédiez le colis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Renvoyez le colis à l'adresse que nous vous communiquerons. Conservez votre preuve d'expédition.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Refund Info */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <CreditCard className="w-6 h-6 text-primary" />
                    Remboursement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex gap-4">
                      <div className="shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Délai de remboursement</h3>
                        <p className="text-sm text-muted-foreground">
                          Le remboursement sera effectué dans un délai de <strong>14 jours</strong> suivant la réception 
                          de votre retour.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Mode de remboursement</h3>
                        <p className="text-sm text-muted-foreground">
                          Le remboursement s'effectue par le même moyen de paiement que celui utilisé lors de votre commande.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Exceptions */}
              <Card className="border-orange-200 bg-orange-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    Produits non retournables
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">
                    Conformément à la réglementation, certains produits ne peuvent pas faire l'objet d'un retour :
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <span>Les produits descellés qui ne peuvent être renvoyés pour des raisons d'hygiène ou de protection de la santé</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <span>Les produits personnalisés ou fabriqués sur mesure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <span>Les produits périssables ou dont la date de péremption est dépassée</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <span>Les produits endommagés ou incomplets</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Frais de retour */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Frais de retour</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Produit défectueux ou erreur de notre part</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Les frais de retour sont <strong>à notre charge</strong>. Nous vous fournirons une étiquette de retour prépayée.
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-xs text-green-800 font-medium">✓ Retour gratuit</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Changement d'avis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Les frais de retour sont <strong>à votre charge</strong>. Vous devez organiser et payer l'expédition du retour.
                    </p>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <p className="text-xs text-orange-800 font-medium">⚠ Frais à votre charge</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Une question sur un retour ?</h2>
              <p className="text-muted-foreground mb-8">
                Notre équipe est à votre disposition pour vous accompagner dans votre démarche de retour.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:infocarolinelogistics@gmail.com"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Nous contacter
                </a>
                <a
                  href="/faq"
                  className="inline-flex items-center justify-center gap-2 border border-input px-6 py-3 rounded-lg font-medium hover:bg-muted transition-colors"
                >
                  Consulter la FAQ
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
