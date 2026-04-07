"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  shippingCost: number
  shippingZone: string | null
  customerInfo: any
  createdAt: string
  items: Array<{
    id: string
    quantity: number
    price: number
    product: {
      id: string
      title: string
    }
  }>
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price)
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

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<string | null>(null)

  useEffect(() => {
    fetchOrder()
  }, [params.id])

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${params.id}`)
      const data = await res.json()
      setOrder(data)
    } catch (error) {
      console.error("Error fetching order:", error)
    } finally {
      setLoading(false)
    }
  }

  const doStatusChange = async (newStatus: string) => {
    try {
      setUpdating(true)
      const res = await fetch(`/api/orders/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) fetchOrder()
      else {
        const error = await res.json()
        alert(error.error || "Erreur lors de la mise à jour")
      }
    } catch (error) {
      console.error("Error updating order:", error)
      alert("Erreur lors de la mise à jour")
    } finally {
      setUpdating(false)
      setConfirmOpen(false)
      setPendingStatus(null)
    }
  }

  const handleConfirmStatusChange = () => {
    if (pendingStatus) doStatusChange(pendingStatus)
  }

  const handleRequestStatusChange = (newStatus: string) => {
    setPendingStatus(newStatus)
    setConfirmOpen(true)
  }

  if (loading) {
    return <div className="p-6">Chargement...</div>
  }

  if (!order) {
    return <div className="p-6">Commande non trouvée</div>
  }

  const items = order.items || []
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const c = order.customerInfo || {}

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/orders">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Commande {order.orderNumber}</h1>
          <p className="text-muted-foreground mt-1">
            {new Date(order.createdAt).toLocaleString("fr-FR")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Informations client — tableau */}
          <Card>
            <CardHeader>
              <CardTitle>Informations client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-3 pr-4 font-medium text-muted-foreground w-40">Nom</td>
                      <td className="py-3 text-foreground">{c.name || "-"}</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 pr-4 font-medium text-muted-foreground">Email</td>
                      <td className="py-3 text-foreground">{c.email || "-"}</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 pr-4 font-medium text-muted-foreground">Téléphone</td>
                      <td className="py-3 text-foreground">{c.phone || "-"}</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 pr-4 font-medium text-muted-foreground">Adresse</td>
                      <td className="py-3 text-foreground">{c.address || "-"}</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-muted-foreground">Ville</td>
                      <td className="py-3 text-foreground">{c.city || "-"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* 2. Produits */}
          <Card>
            <CardHeader>
              <CardTitle>Produits</CardTitle>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center text-muted-foreground py-6">Aucun article dans cette commande</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 pr-4 font-medium text-foreground">Produit</th>
                        <th className="text-right py-3 pr-4 font-medium text-foreground w-24">Quantité</th>
                        <th className="text-right py-3 pr-4 font-medium text-foreground w-28">Prix unitaire</th>
                        <th className="text-right py-3 font-medium text-foreground w-32">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="border-b border-border">
                          <td className="py-3 pr-4 font-medium text-foreground">{item.product?.title || "Produit supprimé"}</td>
                          <td className="py-3 pr-4 text-right text-foreground">{item.quantity}</td>
                          <td className="py-3 pr-4 text-right text-muted-foreground">{formatPrice(item.price)}</td>
                          <td className="py-3 text-right font-medium text-foreground">{formatPrice(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 3. Résumé — en bas à gauche */}
          <Card>
            <CardHeader>
              <CardTitle>Résumé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sous-total</span>
                <span className="text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Livraison</span>
                <span className="text-foreground">{formatPrice(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-border pt-2 mt-2">
                <span>Total</span>
                <span className="text-primary">{formatPrice(order.total)}</span>
              </div>
              {order.shippingZone && (
                <p className="mt-2 text-sm text-muted-foreground">Zone : {order.shippingZone}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite : Statut */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statut</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-medium text-foreground">
                  {getStatusLabel(order.status)}
                </span>
              </div>
              <div className="space-y-2">
                <Button
                  variant={order.status === "CONFIRMED" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleRequestStatusChange("CONFIRMED")}
                  disabled={updating || order.status === "CONFIRMED"}
                >
                  Confirmer
                </Button>
                <Button
                  variant={order.status === "SHIPPING" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleRequestStatusChange("SHIPPING")}
                  disabled={updating || order.status === "SHIPPING"}
                >
                  En livraison
                </Button>
                <Button
                  variant={order.status === "DELIVERED" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleRequestStatusChange("DELIVERED")}
                  disabled={updating || order.status === "DELIVERED"}
                >
                  Livrée
                </Button>
                <Button
                  variant={order.status === "CANCELLED" ? "default" : "outline"}
                  className="w-full text-destructive"
                  onClick={() => handleRequestStatusChange("CANCELLED")}
                  disabled={updating || order.status === "CANCELLED"}
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Changer le statut"
        message={
          pendingStatus
            ? `Changer le statut de la commande à « ${getStatusLabel(pendingStatus)} » ?`
            : ""
        }
        confirmLabel="Confirmer"
        cancelLabel="Annuler"
        variant="default"
        onConfirm={handleConfirmStatusChange}
        onCancel={() => {
          setConfirmOpen(false)
          setPendingStatus(null)
        }}
      />
    </div>
  )
}
