import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Eye, UserCheck, Database, AlertCircle } from "lucide-react"

export const metadata = {
  title: "Politique de Confidentialité | Caroline Logistic",
  description: "Protection de vos données personnelles",
}

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "Politique de Confidentialité" },
          ]}
        />

        {/* Page Header */}
        <section className="py-12 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Politique de Confidentialité
              </h1>
              <p className="text-lg text-muted-foreground">
                Dernière mise à jour : 28 janvier 2026
              </p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="mb-8 border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>Caroline Logistic</strong> accorde une grande importance à la protection de vos données personnelles. 
                    Cette politique de confidentialité vous informe sur la manière dont nous collectons, utilisons, stockons et 
                    protégeons vos informations personnelles conformément au Règlement Général sur la Protection des Données (RGPD) 
                    et à la loi Informatique et Libertés.
                  </p>
                </CardContent>
              </Card>

              <div className="space-y-8">
                
                {/* Section 1 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-primary" />
                      1. Données collectées
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-muted-foreground">
                    <p>Nous collectons les données personnelles suivantes :</p>
                    
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Données d'identification</h3>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Nom et prénom</li>
                        <li>Adresse email</li>
                        <li>Numéro de téléphone</li>
                        <li>Adresse postale (livraison et facturation)</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Données de commande</h3>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Historique des achats</li>
                        <li>Produits commandés</li>
                        <li>Montants des transactions</li>
                        <li>Préférences de livraison</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Données de navigation</h3>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Adresse IP</li>
                        <li>Type de navigateur</li>
                        <li>Pages visitées</li>
                        <li>Durée de visite</li>
                        <li>Cookies (avec votre consentement)</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <p className="text-sm text-blue-900">
                        <strong>Note :</strong> Nous ne collectons jamais vos données bancaires. Les paiements sont traités 
                        de manière sécurisée par notre prestataire Stripe, certifié PCI-DSS niveau 1.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Section 2 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-primary" />
                      2. Utilisation des données
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-muted-foreground">
                    <p>Vos données personnelles sont utilisées pour :</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Traiter et gérer vos commandes</li>
                      <li>Assurer la livraison de vos produits</li>
                      <li>Vous envoyer des confirmations de commande et des mises à jour</li>
                      <li>Gérer votre compte client</li>
                      <li>Répondre à vos demandes et questions</li>
                      <li>Améliorer nos services et votre expérience utilisateur</li>
                      <li>Vous envoyer des offres promotionnelles (avec votre consentement)</li>
                      <li>Respecter nos obligations légales et réglementaires</li>
                      <li>Prévenir la fraude et assurer la sécurité de notre site</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Section 3 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-primary" />
                      3. Base légale du traitement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-muted-foreground">
                    <p>Le traitement de vos données repose sur :</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>L'exécution du contrat :</strong> pour traiter vos commandes et livraisons</li>
                      <li><strong>Votre consentement :</strong> pour l'envoi de newsletters et communications marketing</li>
                      <li><strong>Notre intérêt légitime :</strong> pour améliorer nos services et prévenir la fraude</li>
                      <li><strong>Nos obligations légales :</strong> pour la comptabilité et la fiscalité</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Section 4 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-primary" />
                      4. Partage des données
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-muted-foreground">
                    <p>Vos données personnelles peuvent être partagées avec :</p>
                    
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Prestataires de services</h3>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li><strong>Stripe :</strong> pour le traitement sécurisé des paiements</li>
                        <li><strong>Transporteurs :</strong> pour la livraison de vos commandes</li>
                        <li><strong>Services d'hébergement :</strong> pour le stockage sécurisé des données</li>
                        <li><strong>Services d'emailing :</strong> pour l'envoi de newsletters (avec votre consentement)</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                      <p className="text-sm text-green-900">
                        <strong>Garantie :</strong> Tous nos prestataires sont soumis à des obligations strictes de 
                        confidentialité et ne peuvent utiliser vos données qu'aux fins pour lesquelles nous les leur communiquons.
                      </p>
                    </div>

                    <p className="mt-4">
                      <strong>Nous ne vendons jamais vos données personnelles à des tiers.</strong>
                    </p>
                  </CardContent>
                </Card>

                {/* Section 5 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      5. Conservation des données
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-muted-foreground">
                    <p>Nous conservons vos données personnelles pendant les durées suivantes :</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>Données de compte :</strong> jusqu'à la suppression de votre compte ou 3 ans d'inactivité</li>
                      <li><strong>Données de commande :</strong> 10 ans (obligation légale comptable et fiscale)</li>
                      <li><strong>Données de paiement :</strong> 13 mois (lutte contre la fraude)</li>
                      <li><strong>Cookies :</strong> 13 mois maximum</li>
                      <li><strong>Newsletter :</strong> jusqu'à votre désinscription</li>
                    </ul>
                    <p className="mt-4">
                      À l'issue de ces durées, vos données sont supprimées ou anonymisées.
                    </p>
                  </CardContent>
                </Card>

                {/* Section 6 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      6. Sécurité des données
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-muted-foreground">
                    <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Chiffrement SSL/TLS pour toutes les communications</li>
                      <li>Hébergement sécurisé avec sauvegardes régulières</li>
                      <li>Accès restreint aux données personnelles</li>
                      <li>Authentification forte pour les comptes administrateurs</li>
                      <li>Surveillance et détection des intrusions</li>
                      <li>Mises à jour régulières de sécurité</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Section 7 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-primary" />
                      7. Vos droits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-muted-foreground">
                    <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                    
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-foreground">Droit d'accès</h3>
                        <p className="text-sm">Vous pouvez obtenir une copie de vos données personnelles.</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-foreground">Droit de rectification</h3>
                        <p className="text-sm">Vous pouvez demander la correction de données inexactes ou incomplètes.</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-foreground">Droit à l'effacement</h3>
                        <p className="text-sm">Vous pouvez demander la suppression de vos données (droit à l'oubli).</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-foreground">Droit à la limitation</h3>
                        <p className="text-sm">Vous pouvez demander la limitation du traitement de vos données.</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-foreground">Droit à la portabilité</h3>
                        <p className="text-sm">Vous pouvez recevoir vos données dans un format structuré et couramment utilisé.</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-foreground">Droit d'opposition</h3>
                        <p className="text-sm">Vous pouvez vous opposer au traitement de vos données à des fins marketing.</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-foreground">Droit de retirer votre consentement</h3>
                        <p className="text-sm">Vous pouvez retirer votre consentement à tout moment (newsletters, cookies).</p>
                      </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-6">
                      <p className="text-sm">
                        <strong>Pour exercer vos droits :</strong> Contactez-nous à <a href="mailto:infocarolinelogistics@gmail.com" className="text-primary hover:underline">infocarolinelogistics@gmail.com</a> avec 
                        une copie de votre pièce d'identité. Nous répondrons dans un délai d'un mois.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Section 8 */}
                <Card>
                  <CardHeader>
                    <CardTitle>8. Cookies</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-muted-foreground">
                    <p>
                      Notre site utilise des cookies pour améliorer votre expérience de navigation. Les cookies sont de petits 
                      fichiers texte stockés sur votre appareil.
                    </p>
                    
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Types de cookies utilisés :</h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li><strong>Cookies essentiels :</strong> nécessaires au fonctionnement du site (panier, connexion)</li>
                        <li><strong>Cookies analytiques :</strong> pour comprendre comment vous utilisez notre site</li>
                        <li><strong>Cookies marketing :</strong> pour personnaliser les publicités (avec votre consentement)</li>
                      </ul>
                    </div>

                    <p>
                      Vous pouvez gérer vos préférences de cookies à tout moment via les paramètres de votre navigateur ou 
                      notre bandeau de consentement.
                    </p>
                  </CardContent>
                </Card>

                {/* Section 9 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-primary" />
                      9. Modifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-muted-foreground">
                    <p>
                      Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
                      Toute modification sera publiée sur cette page avec une nouvelle date de mise à jour.
                    </p>
                    <p>
                      Nous vous encourageons à consulter régulièrement cette page pour rester informé de la manière 
                      dont nous protégeons vos données.
                    </p>
                  </CardContent>
                </Card>

                {/* Section 10 */}
                <Card>
                  <CardHeader>
                    <CardTitle>10. Réclamation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-muted-foreground">
                    <p>
                      Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès 
                      de la Commission Nationale de l'Informatique et des Libertés (CNIL) :
                    </p>
                    <div className="bg-muted/50 rounded-lg p-4 mt-4">
                      <p className="text-sm">
                        <strong>CNIL</strong><br />
                        3 Place de Fontenoy<br />
                        TSA 80715<br />
                        75334 PARIS CEDEX 07<br />
                        Téléphone : 01 53 73 22 22<br />
                        Site web : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.cnil.fr</a>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle>Contact - Responsable du traitement</CardTitle>
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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
