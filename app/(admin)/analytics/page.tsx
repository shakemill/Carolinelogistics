import { prisma } from "@/lib/db/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, MousePointerClick, TrendingUp, Euro } from "lucide-react"

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price)
}

async function getAnalytics() {
  const partnerProducts = await prisma.product.findMany({
    where: { isPartner: true },
    include: {
      partner: true,
    },
    orderBy: [
      { clicks: "desc" },
      { views: "desc" },
    ],
  })

  const totalViews = partnerProducts.reduce((sum, p) => sum + p.views, 0)
  const totalClicks = partnerProducts.reduce((sum, p) => sum + p.clicks, 0)
  const conversionRate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0

  // Group by partner
  const partnerStats = partnerProducts.reduce((acc, product) => {
    if (!product.partner) return acc
    const partnerId = product.partner.id
    if (!acc[partnerId]) {
      acc[partnerId] = {
        partner: product.partner,
        views: 0,
        clicks: 0,
        products: 0,
      }
    }
    acc[partnerId].views += product.views
    acc[partnerId].clicks += product.clicks
    acc[partnerId].products += 1
    return acc
  }, {} as Record<string, any>)

  // Calculer les commissions par produit (tous les produits partenaires)
  const commissionsByProduct = partnerProducts
    .map((product) => {
      const commissionRate = product.partner?.commissionRate || 0
      // Commission = clics × (taux de commission / 100) × prix du produit
      const commission = product.clicks * (commissionRate / 100) * product.price
      return {
        product,
        clicks: product.clicks,
        commissionRate,
        price: product.price,
        commission,
      }
    })
    .sort((a, b) => {
      // Trier d'abord par commission, puis par clics, puis par prix
      if (b.commission !== a.commission) {
        return b.commission - a.commission
      }
      if (b.clicks !== a.clicks) {
        return b.clicks - a.clicks
      }
      return b.price - a.price
    })

  const totalCommission = commissionsByProduct.reduce((sum, item) => sum + item.commission, 0)

  return {
    totalViews,
    totalClicks,
    conversionRate,
    partnerStats: Object.values(partnerStats),
    topProducts: partnerProducts.slice(0, 10),
    commissionsByProduct,
    totalCommission,
  }
}

export default async function AnalyticsPage() {
  const analytics = await getAnalytics()

  // Debug: log pour vérifier les données
  console.log("Analytics data:", {
    totalClicks: analytics.totalClicks,
    commissionsCount: analytics.commissionsByProduct.length,
    totalCommission: analytics.totalCommission,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics Partenaires</h1>
        <p className="text-muted-foreground mt-2">
          Suivi des performances des produits partenaires
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Vues
            </CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {analytics.totalViews.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Clics
            </CardTitle>
            <MousePointerClick className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {analytics.totalClicks.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taux de Conversion
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {analytics.conversionRate.toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance par Partenaire</CardTitle>
            <CardDescription>
              Statistiques détaillées par partenaire
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.partnerStats.map((stat: any) => (
                <div
                  key={stat.partner.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div>
                    <div className="font-medium text-foreground">
                      {stat.partner.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.products} produit(s)
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">
                      {stat.views} vues
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.clicks} clics
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Produits</CardTitle>
            <CardDescription>
              Produits les plus consultés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-foreground">
                      {product.title}
                    </div>
                    {product.partner && (
                      <div className="text-sm text-muted-foreground">
                        {product.partner.name}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">
                      {product.views} vues
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {product.clicks} clics
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des commissions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Commissions par Produit</CardTitle>
          <CardDescription>
            Calcul des commissions basé sur les clics (Commission = Clics × (Taux de commission / 100) × Prix)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {analytics.commissionsByProduct.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>Aucun produit partenaire trouvé</p>
              <p className="text-xs mt-2">
                Total clics: {analytics.totalClicks} | Produits: {analytics.commissionsByProduct.length}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Euro className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Total des commissions</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(analytics.totalCommission)}
                  </span>
                </div>
              </div>

              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-foreground">Produit</th>
                      <th className="text-left p-4 text-sm font-medium text-foreground">Partenaire</th>
                      <th className="text-right p-4 text-sm font-medium text-foreground">Clics</th>
                      <th className="text-right p-4 text-sm font-medium text-foreground">Prix</th>
                      <th className="text-right p-4 text-sm font-medium text-foreground">Taux Commission</th>
                      <th className="text-right p-4 text-sm font-medium text-foreground">Commission</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.commissionsByProduct.map((item) => (
                      <tr key={item.product.id} className="border-t border-border hover:bg-muted/50">
                        <td className="p-4">
                          <div className="font-medium text-foreground">{item.product.title}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-muted-foreground">
                            {item.product.partner?.name || "-"}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <span className="font-medium text-foreground">{item.clicks}</span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-sm text-foreground">{formatPrice(item.price)}</span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-sm text-muted-foreground">{item.commissionRate}%</span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="font-bold text-primary">{formatPrice(item.commission)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted border-t-2 border-border">
                    <tr>
                      <td colSpan={5} className="p-4 text-right font-bold text-foreground">
                        Total
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-xl font-bold text-primary">
                          {formatPrice(analytics.totalCommission)}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
