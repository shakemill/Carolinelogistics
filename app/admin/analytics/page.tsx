import { prisma } from "@/lib/db/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, MousePointerClick, TrendingUp } from "lucide-react"

async function getAnalytics() {
  const [partnerProducts, ordersWithItems, partners] = await Promise.all([
    prisma.product.findMany({
      where: { isPartner: true },
      include: { partner: true },
      orderBy: { views: "desc" },
    }),
    prisma.order.findMany({
      where: { status: { not: "CANCELLED" } },
      include: {
        items: { include: { product: { include: { partner: true } } } },
      },
    }),
    prisma.partner.findMany({ where: { isActive: true } }),
  ])

  const totalViews = partnerProducts.reduce((sum, p) => sum + p.views, 0)
  const totalClicks = partnerProducts.reduce((sum, p) => sum + p.clicks, 0)
  const conversionRate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0

  // Group by partner (vues, clics, nb produits)
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

  // Commissions : par partenaire, ventes = sum(price * quantity) sur les OrderItem dont le produit a ce partnerId
  const salesByPartner: Record<string, number> = {}
  for (const order of ordersWithItems) {
    for (const item of order.items) {
      const partnerId = item.product.partnerId
      if (!partnerId) continue
      const amount = item.price * item.quantity
      salesByPartner[partnerId] = (salesByPartner[partnerId] ?? 0) + amount
    }
  }

  const commissionRows = partners.map((partner) => {
    const totalSales = salesByPartner[partner.id] ?? 0
    const rate = partner.commissionRate ?? 0
    const commission = totalSales * (rate / 100)
    return {
      partner,
      totalSales,
      commissionRate: rate,
      commission,
    }
  })

  return {
    totalViews,
    totalClicks,
    conversionRate,
    partnerStats: Object.values(partnerStats),
    topProducts: partnerProducts.slice(0, 10),
    commissionRows,
  }
}

export default async function AnalyticsPage() {
  const analytics = await getAnalytics()

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

      <Card>
        <CardHeader>
          <CardTitle>Commissions Partenaires</CardTitle>
          <CardDescription>
            Calcul des commissions à partir des ventes (commandes livrées ou en cours, hors annulées)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-foreground">
                    Partenaire
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-foreground">
                    Taux commission (%)
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-foreground">
                    Ventes totales (€)
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-foreground">
                    Commission (€)
                  </th>
                </tr>
              </thead>
              <tbody>
                {analytics.commissionRows.map((row) => (
                  <tr
                    key={row.partner.id}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {row.partner.name}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {row.commissionRate.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-right text-foreground">
                      {row.totalSales.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-foreground">
                      {row.commission.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border bg-muted/50 font-medium">
                  <td className="px-4 py-3 text-foreground">Total commissions</td>
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3 text-right text-foreground">
                    {analytics.commissionRows
                      .reduce((s, r) => s + r.totalSales, 0)
                      .toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {analytics.commissionRows
                      .reduce((s, r) => s + r.commission, 0)
                      .toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
