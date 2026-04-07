import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, Package, CreditCard, Truck, ShoppingCart, Shield, Phone, ChevronDown } from "lucide-react"

export const metadata = {
  title: "FAQ - Questions Fréquentes | Caroline Logistic",
  description: "Trouvez les réponses à vos questions",
}

export default function FAQPage() {
  const faqCategories = [
    {
      title: "Commandes",
      icon: ShoppingCart,
      questions: [
        {
          q: "Comment passer une commande ?",
          a: "Pour passer commande, parcourez notre boutique, ajoutez les produits souhaités à votre panier, puis cliquez sur 'Panier' et suivez les étapes du processus de paiement. Vous devrez fournir vos informations de livraison et de paiement."
        },
        {
          q: "Puis-je modifier ou annuler ma commande ?",
          a: "Vous pouvez modifier ou annuler votre commande dans les 2 heures suivant sa validation, en nous contactant directement. Passé ce délai, la commande est en cours de préparation et ne peut plus être modifiée."
        },
        {
          q: "Comment suivre ma commande ?",
          a: "Dès l'expédition de votre commande, vous recevrez un email avec un numéro de suivi. Vous pouvez également suivre votre commande depuis notre page 'Suivi de Commande' en saisissant votre numéro de commande et votre email."
        },
        {
          q: "Je n'ai pas reçu de confirmation de commande",
          a: "Vérifiez d'abord vos spams ou courriers indésirables. Si vous ne trouvez toujours pas l'email, contactez-nous avec vos informations de commande (nom, prénom, date et montant) et nous vous renverrons la confirmation."
        }
      ]
    },
    {
      title: "Livraison",
      icon: Truck,
      questions: [
        {
          q: "Quels sont les délais de livraison ?",
          a: "Pour la France métropolitaine, comptez 2 à 5 jours ouvrés après expédition. Pour la Corse et les DOM-TOM, les délais peuvent être de 5 à 10 jours ouvrés. Les délais peuvent varier selon la disponibilité des produits."
        },
        {
          q: "Quels sont les frais de livraison ?",
          a: "Les frais de livraison sont calculés en fonction de votre zone géographique et du poids de votre commande. Vous pouvez voir le montant exact avant de finaliser votre commande. Livraison gratuite à partir de 50€ d'achat en France métropolitaine."
        },
        {
          q: "Livrez-vous à l'international ?",
          a: "Actuellement, nous livrons uniquement en France métropolitaine, Corse et DOM-TOM. Nous travaillons à étendre nos services à l'international prochainement."
        },
        {
          q: "Que faire si je ne suis pas là lors de la livraison ?",
          a: "Le transporteur laissera un avis de passage dans votre boîte aux lettres. Vous pourrez alors récupérer votre colis dans le point relais le plus proche ou organiser une nouvelle tentative de livraison."
        }
      ]
    },
    {
      title: "Paiement",
      icon: CreditCard,
      questions: [
        {
          q: "Quels moyens de paiement acceptez-vous ?",
          a: "Nous acceptons les cartes bancaires (Visa, Mastercard, American Express), PayPal, et les virements bancaires. Tous les paiements sont sécurisés par Stripe."
        },
        {
          q: "Le paiement est-il sécurisé ?",
          a: "Oui, tous les paiements sont sécurisés par Stripe, une plateforme de paiement certifiée PCI-DSS niveau 1 (le plus haut niveau de sécurité). Vos données bancaires ne sont jamais stockées sur nos serveurs."
        },
        {
          q: "Puis-je payer en plusieurs fois ?",
          a: "Actuellement, nous n'offrons pas de paiement en plusieurs fois. Cette option sera disponible prochainement pour les commandes supérieures à 100€."
        },
        {
          q: "Ma carte a été refusée, que faire ?",
          a: "Vérifiez que vous avez saisi correctement les informations de votre carte et que vous disposez de fonds suffisants. Si le problème persiste, contactez votre banque ou essayez avec un autre moyen de paiement."
        }
      ]
    },
    {
      title: "Retours & Remboursements",
      icon: Package,
      questions: [
        {
          q: "Quel est le délai pour retourner un produit ?",
          a: "Vous disposez de 14 jours à compter de la réception de votre commande pour exercer votre droit de rétractation, conformément à la législation en vigueur."
        },
        {
          q: "Comment effectuer un retour ?",
          a: "Contactez-nous par email à infocarolinelogistics@gmail.com avec votre numéro de commande. Nous vous fournirons les instructions et l'adresse de retour. Le produit doit être dans son état d'origine avec l'emballage."
        },
        {
          q: "Qui paie les frais de retour ?",
          a: "Si le produit est défectueux ou si nous avons commis une erreur, les frais de retour sont à notre charge. En cas de changement d'avis, les frais de retour sont à votre charge."
        },
        {
          q: "Quand serai-je remboursé ?",
          a: "Le remboursement est effectué dans un délai de 14 jours suivant la réception de votre retour, par le même moyen de paiement que celui utilisé lors de votre commande."
        }
      ]
    },
    {
      title: "Produits",
      icon: Package,
      questions: [
        {
          q: "Les produits sont-ils garantis ?",
          a: "Tous nos produits bénéficient de la garantie légale de conformité de 2 ans. Certains produits peuvent avoir une garantie constructeur supplémentaire."
        },
        {
          q: "Comment savoir si un produit est en stock ?",
          a: "La disponibilité est indiquée sur chaque fiche produit. Si un produit est en rupture de stock, vous pouvez vous inscrire pour être notifié de son retour en stock."
        },
        {
          q: "Proposez-vous des produits reconditionnés ?",
          a: "Non, nous ne vendons que des produits neufs et authentiques, provenant directement de nos fournisseurs ou partenaires officiels."
        },
        {
          q: "Puis-je voir les produits avant d'acheter ?",
          a: "Nous sommes une boutique en ligne uniquement. Toutes les informations et photos détaillées sont disponibles sur les fiches produits. N'hésitez pas à nous contacter pour plus de renseignements."
        }
      ]
    },
    {
      title: "Compte Client",
      icon: Shield,
      questions: [
        {
          q: "Dois-je créer un compte pour commander ?",
          a: "Non, vous pouvez commander en tant qu'invité. Cependant, créer un compte vous permet de suivre vos commandes, gérer vos adresses et accéder à des offres exclusives."
        },
        {
          q: "Comment modifier mes informations personnelles ?",
          a: "Connectez-vous à votre compte et accédez à la section 'Mon Compte' où vous pourrez modifier vos informations personnelles et adresses de livraison."
        },
        {
          q: "J'ai oublié mon mot de passe",
          a: "Cliquez sur 'Mot de passe oublié' sur la page de connexion. Vous recevrez un email avec un lien pour réinitialiser votre mot de passe."
        },
        {
          q: "Comment supprimer mon compte ?",
          a: "Pour supprimer votre compte, contactez notre service client à infocarolinelogistics@gmail.com. Nous traiterons votre demande dans les 48 heures conformément au RGPD."
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "FAQ" },
          ]}
        />

        {/* Page Header */}
        <section className="py-12 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <HelpCircle className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Questions Fréquentes
              </h1>
              <p className="text-lg text-muted-foreground">
                Trouvez rapidement les réponses à vos questions
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-12">
              {faqCategories.map((category, idx) => {
                const Icon = category.icon
                return (
                  <div key={idx}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h2 className="text-3xl font-bold">{category.title}</h2>
                    </div>
                    <div className="space-y-2">
                      {category.questions.map((item, qIdx) => (
                        <details
                          key={qIdx}
                          className="group rounded-lg border border-border bg-card overflow-hidden"
                        >
                          <summary className="flex items-center justify-between gap-4 list-none cursor-pointer px-4 py-4 font-semibold text-foreground hover:bg-muted/50 transition-colors [&::-webkit-details-marker]:hidden">
                            <span className="text-left">{item.q}</span>
                            <ChevronDown className="w-5 h-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                          </summary>
                          <div className="px-4 pb-4 pt-0">
                            <p className="text-muted-foreground leading-relaxed text-sm">{item.a}</p>
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                    <Phone className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Vous ne trouvez pas votre réponse ?</h2>
                  <p className="text-muted-foreground mb-6">
                    Notre équipe est là pour vous aider. N'hésitez pas à nous contacter !
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="/contact"
                      className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      Nous contacter
                    </a>
                    <a
                      href="mailto:infocarolinelogistics@gmail.com"
                      className="inline-flex items-center justify-center gap-2 border border-input px-6 py-3 rounded-lg font-medium hover:bg-muted transition-colors"
                    >
                      Envoyer un email
                    </a>
                  </div>
                  <div className="mt-6 pt-6 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">
                      <strong>Téléphone :</strong> +33 7 45 22 36 64 / +33 7 60 27 08 90
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
