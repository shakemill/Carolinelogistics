import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import { User, Package, Heart, Mail, HelpCircle, FileText } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Mon Compte | Caroline Logistic",
  description: "Accédez à vos commandes et à votre espace client",
}

export default function MonComptePage() {
  const links = [
    {
      href: "/suivi-commande",
      title: "Suivi de commande",
      description: "Suivez votre colis avec votre numéro de commande et votre email",
      icon: Package,
    },
    {
      href: "/wishlist",
      title: "Ma liste d'envies",
      description: "Consultez les produits que vous avez mis de côté",
      icon: Heart,
    },
    {
      href: "/contact",
      title: "Nous contacter",
      description: "Une question ? Notre équipe vous répond",
      icon: Mail,
    },
    {
      href: "/faq",
      title: "Questions fréquentes",
      description: "Trouvez rapidement les réponses à vos questions",
      icon: HelpCircle,
    },
    {
      href: "/conditions-generales",
      title: "Conditions générales",
      description: "Consultez nos conditions de vente",
      icon: FileText,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumb
            items={[
              { label: "Accueil", href: "/" },
              { label: "Mon Compte" },
            ]}
          />
        </div>

        <section className="py-12 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Mon Compte
              </h1>
              <p className="text-lg text-muted-foreground">
                Accédez à vos commandes et aux services qui vous concernent
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Card className="border-primary/20 bg-primary/5 mb-8">
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Vous pouvez commander sur notre boutique sans créer de compte. Pour suivre une commande, 
                    utilisez la page <Link href="/suivi-commande" className="text-primary font-medium hover:underline">Suivi de commande</Link> avec 
                    votre numéro de commande et l’email utilisé lors de l’achat.
                  </p>
                </CardContent>
              </Card>

              <h2 className="text-2xl font-bold text-foreground mb-6">Services à votre disposition</h2>
              <div className="grid gap-4">
                {links.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link key={item.href} href={item.href}>
                      <Card className="hover:border-primary/40 hover:bg-muted/30 transition-colors cursor-pointer">
                        <CardContent className="p-4 flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{item.title}</h3>
                            <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
