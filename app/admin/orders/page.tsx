"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, Download, Search } from "lucide-react"
import Link from "next/link"

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  shippingCost: number
  customerInfo: any
  createdAt: string
  items: any[]
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price)
}

function getStatusBadgeColor(status: string) {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    SHIPPING: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  }
  return colors[status] || "bg-gray-100 text-gray-800"
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    PENDING: "En attente",
    CONFIRMED: "Confirmée",
    SHIPPING: "En livraison",
    DELIVERED: "Livrée",
    CANCELLED: "Annulée",
  }
  return labels[status] || status
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      })
      if (statusFilter) params.append("status", statusFilter)

      const res = await fetch(`/api/orders?${params}`)
      const data = await res.json()
      setOrders(data.orders || [])
      setTotalPages(data.pagination?.totalPages || 1)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [page, statusFilter])

  const handleExport = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.append("status", statusFilter)

      const res = await fetch(`/api/orders/export?${params}`)
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error exporting orders:", error)
      alert("Erreur lors de l'export")
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      order.orderNumber.toLowerCase().includes(searchLower) ||
      (order.customerInfo?.name || "").toLowerCase().includes(searchLower) ||
      (order.customerInfo?.email || "").toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Commandes</h1>
          <p className="text-muted-foreground mt-2">
            Gestion des commandes et suivi des livraisons
          </p>
        </div>
        <Button onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Exporter
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une commande..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setPage(1)
                }}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="">Tous les statuts</option>
                <option value="PENDING">En attente</option>
                <option value="CONFIRMED">Confirmée</option>
                <option value="SHIPPING">En livraison</option>
                <option value="DELIVERED">Livrée</option>
                <option value="CANCELLED">Annulée</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Chargement...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune commande trouvée
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 text-sm font-medium text-foreground">Numéro</th>
                      <th className="text-left p-4 text-sm font-medium text-foreground">Client</th>
                      <th className="text-left p-4 text-sm font-medium text-foreground">Date</th>
                      <th className="text-left p-4 text-sm font-medium text-foreground">Statut</th>
                      <th className="text-left p-4 text-sm font-medium text-foreground">Total</th>
                      <th className="text-left p-4 text-sm font-medium text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border hover:bg-muted/50">
                        <td className="p-4">
                          <div className="font-medium text-foreground">{order.orderNumber}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-foreground">
                            {order.customerInfo?.name || "-"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {order.customerInfo?.email || ""}
                          </div>
                        </td>
                        <td className="p-4 text-sm text-foreground">
                          {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}
                          >
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="p-4 text-sm font-medium text-foreground">
                          {formatPrice(order.total)}
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/orders/${order.id}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Précédent
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} sur {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Suivant
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
