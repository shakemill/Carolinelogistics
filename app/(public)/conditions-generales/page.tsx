import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Scale } from "lucide-react"

export const metadata = {
  title: "Conditions Générales de Vente | Caroline Logistic",
  description: "Conditions générales de vente et d'utilisation",
}

export default function ConditionsGeneralesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "Conditions Générales" },
          ]}
        />

        {/* Page Header */}
        <section className="py-12 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Conditions Générales de Vente
              </h1>
              <p className="text-lg text-muted-foreground">
                Dernière mise à jour : 28 janvier 2026
              </p>
            </div>
          </div>
        </section>

        {/* CGV Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              
              {/* Article 1 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-primary" />
                    Article 1 - Objet
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-muted-foreground">
                  <p>
                    Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre 
                    <strong> Caroline Logistic</strong>, ci-après dénommée "le Vendeur", et toute personne physique ou morale, 
                    ci-après dénommée "le Client", souhaitant effectuer un achat via le site internet carolinelogistics.fr.
                  </p>
                  <p>
                    Le fait de passer commande implique l'adhésion entière et sans réserve du Client aux présentes CGV, 
                    à l'exclusion de tous autres documents, prospectus, catalogues ou photographies qui n'ont qu'une valeur indicative.
                  </p>
                </CardContent>
              </Card>

              {/* Article 2 */}
              <Card>
                <CardHeader>
                  <CardTitle>Article 2 - Produits et Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-muted-foreground">
                  <p>
                    Les produits et services proposés sont ceux qui figurent sur le site carolinelogistics.fr. 
                    Chaque produit est accompagné d'un descriptif établi par le Vendeur ou ses partenaires.
                  </p>
                  <p>
                    Les photographies et graphismes présentés sur le site ne sont pas contractuels et ne sauraient 
                    engager la responsabilité du Vendeur.
                  </p>
                  <p>
                    Le Vendeur se réserve le droit de modifier à tout moment l'assortiment de produits proposés.
                  </p>
                </CardContent>
              </Card>

              {/* Article 3 */}
              <Card>
                <CardHeader>
                  <CardTitle>Article 3 - Prix</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-muted-foreground">
                  <p>
                    Les prix des produits sont indiqués en euros (€), toutes taxes comprises (TTC), hors frais de livraison. 
                    Le Vendeur se réserve le droit de modifier ses prix à tout moment, étant toutefois entendu que le prix 
                    figurant au catalogue le jour de la commande sera le seul applicable au Client.
                  </p>
                  <p>
                    Les frais de livraison sont calculés en fonction du poids et de la destination. Ils sont indiqués 
                    avant la validation définitive de la commande.
                  </p>
                  <p>
                    Le paiement demandé au Client correspond au montant total de l'achat, y compris les frais de livraison.
                  </p>
                </CardContent>
              </Card>

              {/* Article 4 */}
              <Card>
                <CardHeader>
                  <CardTitle>Article 4 - Commande</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-muted-foreground">
                  <p>
                    Le Client passe commande sur le site internet en suivant le processus en ligne. Il doit obligatoirement 
                    renseigner l'ensemble des champs obligatoires de la fiche de commande.
                  </p>
                  <p>
                    La validation de la commande par le Client vaut acceptation des présentes CGV et constitue une preuve 
                    du contrat de vente. Le Client reçoit alors un email de confirmation de commande.
                  </p>
                  <p>
                    Le Vendeur se réserve le droit d'annuler ou de refuser toute commande d'un Client avec lequel il 
                    existerait un litige relatif au paiement d'une commande antérieure.
                  </p>
                </CardContent>
              </Card>

              {/* Article 5 */}
              <Card>
                <CardHeader>
                  <CardTitle>Article 5 - Paiement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-muted-foreground">
                  <p>
                    Le paiement s'effectue en ligne de manière sécurisée via la plateforme Stripe. Le Vendeur accepte 
                    les paiements par cartes bancaires (Visa, Mastercard, American Express) et PayPal.
                  </p>
                  <p>
                    Le prix est payable comptant, en totalité au jour de la passation de la commande par le Client.
                  </p>
                  <p>
                    Les données de paiement sont échangées en mode crypté grâce au protocole SSL. Le Vendeur ne conserve 
                    aucune donnée bancaire sur ses serveurs.
                  </p>
                </CardContent>
              </Card>

              {/* Article 6 */}
              <Card>
                <CardHeader>
                  <CardTitle>Article 6 - Livraison</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-muted-foreground">
                  <p>
                    Les produits sont livrés à l'adresse de livraison indiquée par le Client lors de sa commande. 
                    Les délais de livraison sont donnés à titre indicatif et peuvent varier selon la disponibilité 
                    des produits et la zone géographique.
                  </p>
                  <p>
                    <strong>Délais indicatifs :</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>France métropolitaine : 2 à 5 jours ouvrés</li>
                    <li>Corse : 5 à 7 jours ouvrés</li>
                    <li>DOM-TOM : 7 à 10 jours ouvrés</li>
                  </ul>
                  <p>
                    En cas de retard de livraison supérieur à 7 jours ouvrés après la date indicative, le Client peut 
                    demander l'annulation de la commande et le remboursement des sommes versées.
                  </p>
                </CardContent>
              </Card>

              {/* Article 7 */}
              <Card>
                <CardHeader>
                  <CardTitle>Article 7 - Droit de rétractation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-muted-foreground">
                  <p>
                    Conformément aux articles L.221-18 et suivants du Code de la consommation, le Client dispose d'un 
                    délai de <strong>14 jours</strong> à compter de la réception des produits pour exercer son droit de rétractation 
                    sans avoir à justifier de motifs ni à payer de pénalités.
                  </p>
                  <p>
                    Les retours sont à effectuer dans leur état d'origine et complets (emballage, accessoires, notice, etc.) 
                    permettant leur recommercialisation à l'état neuf.
                  </p>
                  <p>
                    Le remboursement sera effectué dans un délai de 14 jours à compter de la réception du retour, 
                    par le même moyen de paiement que celui utilisé lors de la commande.
                  </p>
                </CardContent>
              </Card>

              {/* Article 8 */}
              <Card>
                <CardHeader>
                  <CardTitle>Article 8 - Garanties</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-muted-foreground">
                  <p>
                    Tous les produits fournis par le Vendeur bénéficient de la garantie légale de conformité 
                    (articles L.217-4 et suivants du Code de la consommation) et de la garantie contre les vices cachés 
                    (articles 1641 et suivants du Code civil).
                  </p>
                  <p>
                    <strong>Garantie légale de conformité :</strong> Le Client bénéficie d'un délai de 2 ans à compter 
                    de la délivrance du bien pour agir.
                  </p>
                  <p>
                    <strong>Garantie des vices cachés :</strong> Le Client peut choisir entre la résolution de la vente 
                    ou une réduction du prix de vente (article 1644 du Code civil).
                  </p>
                </CardContent>
              </Card>

              {/* Article 9 */}
              <Card>
                <CardHeader>
                  <CardTitle>Article 9 - Responsabilité</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-muted-foreground">
                  <p>
                    Le Vendeur ne saurait être tenu responsable de l'inexécution du contrat conclu en cas de rupture de 
                    stock, indisponibilité du produit, force majeure, perturbation ou grève totale ou partielle notamment 
                    des services postaux et moyens de transport et/ou communications.
                  </p>
                  <p>
                    Les photographies et graphismes présentés sur le site ne sont pas contractuels et ne sauraient engager 
                    la responsabilité du Vendeur.
                  </p>
                </CardContent>
              </Card>

              {/* Article 10 */}
              <Card>
                <CardHeader>
                  <CardTitle>Article 10 - Propriété intellectuelle</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-muted-foreground">
                  <p>
                    Tous les éléments du site carolinelogistics.fr sont et restent la propriété intellectuelle et exclusive 
                    du Vendeur. Nul n'est autorisé à reproduire, exploiter, rediffuser, ou utiliser à quelque titre que ce soit, 
                    même partiellement, des éléments du site qu'ils soient logiciels, visuels ou sonores.
                  </p>
                </CardContent>
              </Card>

              {/* Article 11 */}
              <Card>
                <CardHeader>
                  <CardTitle>Article 11 - Données personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-muted-foreground">
                  <p>
                    Le Vendeur s'engage à préserver la confidentialité des informations fournies par le Client. 
                    Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, 
                    le Client dispose d'un droit d'accès, de rectification et de suppression des données le concernant.
                  </p>
                  <p>
                    Pour plus d'informations, consultez notre <a href="/politique-confidentialite" className="text-primary hover:underline">Politique de Confidentialité</a>.
                  </p>
                </CardContent>
              </Card>

              {/* Article 12 */}
              <Card>
                <CardHeader>
                  <CardTitle>Article 12 - Règlement des litiges</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-muted-foreground">
                  <p>
                    Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée 
                    avant toute action judiciaire.
                  </p>
                  <p>
                    Conformément à l'article L.612-1 du Code de la consommation, le Client a le droit de recourir gratuitement 
                    à un médiateur de la consommation en vue de la résolution amiable du litige.
                  </p>
                  <p>
                    À défaut de résolution amiable, le litige sera porté devant les tribunaux compétents.
                  </p>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle>Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p><strong>Caroline Logistic</strong></p>
                  <p>Challans – France, 85300</p>
                  <p>Email : <a href="mailto:infocarolinelogistics@gmail.com" className="text-primary hover:underline">infocarolinelogistics@gmail.com</a></p>
                  <p>Téléphone : +33 7 45 22 36 64 / +33 7 60 27 08 90</p>
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
