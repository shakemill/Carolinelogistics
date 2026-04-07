"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Loader2, Package, CheckCircle, Truck, Clock, XCircle } from "lucide-react"

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente de paiement",
  CONFIRMED: "Confirmée",
  SHIPPING: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
}

interface TrackedOrder {
  orderNumber: string
  status: string
  total: number
  shippingCost: number
  createdAt: string
  items: { title: string; quantity: number; price: number }[]
}

export function OrderTrackingForm() {
  const [orderNumber, setOrderNumber] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<TrackedOrder | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setOrder(null)
    const num = orderNumber.trim()
    const mail = email.trim()
    if (!num || !mail) {
      setError("Veuillez remplir le numéro de commande et l'email.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch(
        `/api/orders/track?orderNumber=${encodeURIComponent(num)}&email=${encodeURIComponent(mail)}`
      )
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Aucune commande trouvée.")
        return
      }
      setOrder(data)
    } catch {
      setError("Erreur lors de la recherche. Réessayez.")
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price)
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Rechercher votre commande
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="orderNumber">Numéro de commande</Label>
              <Input
                id="orderNumber"
                type="text"
                placeholder="Ex: ORD-1769954693281-ZVFOOA67Y"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="mt-2"
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="email">Email de commande</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2"
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Recherche...
                </>
              ) : (
                "Suivre ma commande"
              )}
            </Button>
          </form>
          {error && (
            <p className="mt-4 text-sm text-destructive font-medium" role="alert">
              {error}
            </p>
          )}
        </CardContent>
      </Card>

      {order && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Commande {order.orderNumber}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Passée le {formatDate(order.createdAt)}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
                  order.status === "DELIVERED"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : order.status === "CANCELLED"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      : order.status === "SHIPPING"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-muted text-muted-foreground"
                }`}
              >
                {order.status === "DELIVERED" && <CheckCircle className="w-4 h-4" />}
                {order.status === "CANCELLED" && <XCircle className="w-4 h-4" />}
                {order.status === "SHIPPING" && <Truck className="w-4 h-4" />}
                {(order.status === "PENDING" || order.status === "CONFIRMED") && (
                  <Clock className="w-4 h-4" />
                )}
                {STATUS_LABELS[order.status] ?? order.status}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Produits</h3>
              <ul className="space-y-2">
                {order.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex justify-between text-sm text-muted-foreground"
                  >
                    <span>
                      {item.title} × {item.quantity}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-4 flex justify-between text-sm">
              <span className="text-muted-foreground">Livraison</span>
              <span>{formatPrice(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(order.total + order.shippingCost)}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
