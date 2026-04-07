import { prisma } from "@/lib/db/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Clock,
  FolderTree,
  Handshake,
  Mail,
  AlertTriangle,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

const LOW_STOCK_THRESHOLD = 5

async function getDashboardStats() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const [
    ordersTotal,
    ordersPending,
    ordersThisMonth,
    ordersByStatus,
    productsActive,
    productsLowStock,
    usersCount,
    categoriesCount,
    partnersCount,
    newsletterCount,
    promotionsActive,
    revenueAll,
    revenueThisMonth,
    revenueLastMonth,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({
      where: { createdAt: { gte: startOfMonth } },
    }),
    prisma.order.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.findMany({
      where: { isActive: true, stock: { lte: LOW_STOCK_THRESHOLD } },
      select: { id: true, title: true, stock: true },
      orderBy: { stock: "asc" },
      take: 10,
    }),
    prisma.user.count({ where: { isActive: true } }),
    prisma.category.count(),
    prisma.partner.count({ where: { isActive: true } }),
    prisma.newsletter.count(),
    prisma.promotion.count({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
    }),
    prisma.order.aggregate({
      where: { status: { in: ["CONFIRMED", "SHIPPING", "DELIVERED"] } },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: {
        status: { in: ["CONFIRMED", "SHIPPING", "DELIVERED"] },
        createdAt: { gte: startOfMonth },
      },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: {
        status: { in: ["CONFIRMED", "SHIPPING", "DELIVERED"] },
        createdAt: { gte: startOfLastMonth, lt: startOfMonth },
      },
      _sum: { total: true },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        orderNumber: true,
        status: true,
        total: true,
        createdAt: true,
      },
    }),
  ])

  const revenue = revenueAll._sum.total ?? 0
  const revenueMonth = revenueThisMonth._sum.total ?? 0
  const revenuePrevMonth = revenueLastMonth._sum.total ?? 0
  const revenueTrend =
    revenuePrevMonth > 0
      ? ((revenueMonth - revenuePrevMonth) / revenuePrevMonth) * 100
      : revenueMonth > 0
        ? 100
        : 0

  const statusCounts = Object.fromEntries(
    ordersByStatus.map((s) => [s.status, s._count.id])
  )

  return {
    ordersTotal,
    ordersPending,
    ordersThisMonth,
    statusCounts,
    productsActive,
    productsLowStock,
    usersCount,
    categoriesCount,
    partnersCount,
    newsletterCount,
    promotionsActive,
    revenue,
    revenueMonth,
    revenueTrend,
    recentOrders,
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price)
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    PENDING: "En attente",
    CONFIRMED: "Confirmée",
    SHIPPING: "En livraison",
    DELIVERED: "Livrée",
    CANCELLED: "Annulée",
  }
  return labels[status] ?? status
}

function getStatusBadgeClass(status: string) {
  const classes: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    SHIPPING: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
    DELIVERED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  }
  return classes[status] ?? "bg-muted text-muted-foreground"
}

export default async function DashboardPage() {
  const s = await getDashboardStats()

  const mainCards = [
    {
      title: "Commandes",
      value: s.ordersTotal.toLocaleString("fr-FR"),
      description: `${s.ordersThisMonth} ce mois`,
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Produits actifs",
      value: s.productsActive.toLocaleString("fr-FR"),
      description: `${s.productsLowStock.length} en faible stock`,
      icon: Package,
      color: "text-green-600",
    },
    {
      title: "Utilisateurs",
      value: s.usersCount.toLocaleString("fr-FR"),
      description: "Comptes actifs",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Revenus",
      value: s.revenue >= 1000 ? `${(s.revenue / 1000).toFixed(1)} K €` : formatPrice(s.revenue),
      description:
        s.revenueTrend !== 0
          ? `${s.revenueTrend >= 0 ? "+" : ""}${s.revenueTrend.toFixed(1)}% vs mois dernier`
          : "Revenus confirmés / livrés",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  const secondaryCards = [
    {
      title: "En attente",
      value: s.ordersPending,
      description: "Commandes à traiter",
      icon: Clock,
      color: "text-amber-600",
    },
    {
      title: "Catégories",
      value: s.categoriesCount,
      description: "Catégories",
      icon: FolderTree,
      color: "text-sky-600",
    },
    {
      title: "Partenaires",
      value: s.partnersCount,
      description: "Partenaires actifs",
      icon: Handshake,
      color: "text-indigo-600",
    },
    {
      title: "Newsletter",
      value: s.newsletterCount,
      description: "Inscrits",
      icon: Mail,
      color: "text-rose-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground mt-2">
          Vue d&apos;ensemble de votre activité
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <Icon className={`h-8 w-8 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {secondaryCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <Icon className={`h-8 w-8 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-foreground">
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Dernières commandes</CardTitle>
              <CardDescription>Récentes commandes</CardDescription>
            </div>
            <Link
              href="/admin/orders"
              className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
            >
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-3 py-2 text-left font-medium text-foreground">
                      N° commande
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-foreground">
                      Statut
                    </th>
                    <th className="px-3 py-2 text-right font-medium text-foreground">
                      Total
                    </th>
                    <th className="px-3 py-2 text-right font-medium text-foreground">
                      Date
                    </th>
                    <th className="px-3 py-2 w-8" />
                  </tr>
                </thead>
                <tbody>
                  {s.recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">
                        Aucune commande
                      </td>
                    </tr>
                  ) : (
                    s.recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-border last:border-b-0"
                      >
                        <td className="px-3 py-2 font-medium text-foreground">
                          {order.orderNumber}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadgeClass(order.status)}`}
                          >
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right text-foreground">
                          {formatPrice(order.total)}
                        </td>
                        <td className="px-3 py-2 text-right text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-3 py-2">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-primary hover:underline text-xs"
                          >
                            Voir
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Commandes par statut</CardTitle>
              <CardDescription>Répartition actuelle</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {(["PENDING", "CONFIRMED", "SHIPPING", "DELIVERED", "CANCELLED"] as const).map(
                (status) => (
                  <li
                    key={status}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadgeClass(status)}`}
                      >
                        {getStatusLabel(status)}
                      </span>
                    </span>
                    <span className="font-medium text-foreground">
                      {s.statusCounts[status] ?? 0}
                    </span>
                  </li>
                )
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      {s.productsLowStock.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Produits en faible stock
              </CardTitle>
              <CardDescription>
                Produits avec un stock ≤ {LOW_STOCK_THRESHOLD} unités
              </CardDescription>
            </div>
            <Link
              href="/admin/products"
              className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
            >
              Gérer <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-3 py-2 text-left font-medium text-foreground">
                      Produit
                    </th>
                    <th className="px-3 py-2 text-right font-medium text-foreground">
                      Stock
                    </th>
                    <th className="px-3 py-2 w-8" />
                  </tr>
                </thead>
                <tbody>
                  {s.productsLowStock.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-border last:border-b-0"
                    >
                      <td className="px-3 py-2 font-medium text-foreground">
                        {product.title}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <span
                          className={
                            product.stock === 0
                              ? "text-red-600 dark:text-red-400 font-medium"
                              : "text-amber-600 dark:text-amber-400"
                          }
                        >
                          {product.stock} unité(s)
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-primary hover:underline text-xs"
                        >
                          Modifier
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {(s.promotionsActive > 0 || s.newsletterCount > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {s.promotionsActive > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Promotions en cours</CardTitle>
                <CardDescription>
                  {s.promotionsActive} promotion(s) active(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/admin/promotions"
                  className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                >
                  Voir les promotions <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          )}
          {s.newsletterCount > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Newsletter</CardTitle>
                <CardDescription>
                  {s.newsletterCount} inscrit(s) à la newsletter
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">
                  {s.newsletterCount}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Export disponible dans la section dédiée
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
