import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { OrderTrackingForm } from "@/components/shop/order-tracking-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Truck, CheckCircle } from "lucide-react"

export const metadata = {
  title: "Suivi de Commande | Caroline Logistic",
  description: "Suivez votre commande en temps réel",
}

export default function SuiviCommandePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumb
            items={[
              { label: "Accueil", href: "/" },
              { label: "Suivi de Commande" },
            ]}
          />
        </div>

        {/* Page Header */}
        <section className="py-12 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Package className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Suivi de Commande
              </h1>
              <p className="text-lg text-muted-foreground">
                Suivez votre colis en temps réel et restez informé de chaque étape de la livraison
              </p>
            </div>
          </div>
        </section>

        {/* Tracking Form */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <OrderTrackingForm />
          </div>
        </section>

        {/* Tracking Steps */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Les étapes de votre livraison
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Commande confirmée</h3>
                  <p className="text-sm text-muted-foreground">
                    Votre commande a été reçue et validée
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Package className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">En préparation</h3>
                  <p className="text-sm text-muted-foreground">
                    Votre colis est en cours de préparation
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Truck className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Expédié</h3>
                  <p className="text-sm text-muted-foreground">
                    Votre colis est en route vers vous
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Livré</h3>
                  <p className="text-sm text-muted-foreground">
                    Votre commande a été livrée
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Questions fréquentes
              </h2>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Où trouver mon numéro de commande ?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Votre numéro de commande se trouve dans l'email de confirmation que vous avez reçu après votre achat. 
                      Il commence généralement par "CMD-" suivi de l'année et d'un numéro unique.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Combien de temps prend la livraison ?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Les délais de livraison varient selon votre zone géographique. En général, comptez 2 à 5 jours ouvrés 
                      pour la France métropolitaine. Vous recevrez un email avec le numéro de suivi dès l'expédition de votre colis.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Je n'ai pas reçu mon email de confirmation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Vérifiez d'abord vos spams. Si vous ne trouvez toujours pas l'email, contactez notre service client 
                      avec les informations de votre commande (nom, prénom, date d'achat).
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
