"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Plus, Edit, Trash2, Calendar, Percent } from "lucide-react"
import Link from "next/link"

interface Promotion {
  id: string
  type: string
  name: string
  startDate: string
  endDate: string
  discountType: string
  discountValue: number
  isActive: boolean
  products: any[]
  categories: any[]
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const fetchPromotions = async () => {
    try {
      const res = await fetch("/api/promotions")
      const data = await res.json()
      setPromotions(data)
    } catch (error) {
      console.error("Error fetching promotions:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPromotions()
  }, [])

  const doDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/promotions/${id}`, { method: "DELETE" })
      if (res.ok) fetchPromotions()
      else {
        const error = await res.json()
        alert(error.error || "Erreur lors de la suppression")
      }
    } catch (error) {
      console.error("Error deleting promotion:", error)
      alert("Erreur lors de la suppression")
    } finally {
      setConfirmOpen(false)
      setPendingDeleteId(null)
    }
  }

  const handleConfirmDelete = () => {
    if (pendingDeleteId) doDelete(pendingDeleteId)
  }

  const getPromotionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      HOT_DEAL: "Hot Deal",
      WEEKLY: "Hebdomadaire",
      PRODUCT: "Produit",
      CATEGORY: "Catégorie",
    }
    return labels[type] || type
  }

  const formatDiscount = (type: string, value: number) => {
    return type === "PERCENTAGE" ? `${value}%` : `${value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Promotions</h1>
          <p className="text-muted-foreground mt-2">
            Gestion des promotions et offres spéciales
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/promotions/new">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle promotion
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des promotions</CardTitle>
          <CardDescription>
            {promotions.length} promotion(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Chargement...
            </div>
          ) : promotions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune promotion. Créez-en une pour commencer.
            </div>
          ) : (
            <div className="space-y-4">
              {promotions.map((promotion) => {
                const isActive = new Date(promotion.endDate) >= new Date() && promotion.isActive
                return (
                  <div
                    key={promotion.id}
                    className="p-4 border border-border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">{promotion.name}</h3>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                            {getPromotionTypeLabel(promotion.type)}
                          </span>
                          <span className="text-lg font-bold text-primary">
                            -{formatDiscount(promotion.discountType, promotion.discountValue)}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>
                            Du {new Date(promotion.startDate).toLocaleDateString("fr-FR")} au{" "}
                            {new Date(promotion.endDate).toLocaleDateString("fr-FR")}
                          </div>
                          <div>
                            {promotion.products.length} produit(s) • {promotion.categories.length} catégorie(s)
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              isActive
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {isActive ? "Active" : "Expirée"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/promotions/${promotion.id}/edit`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setPendingDeleteId(promotion.id)
                            setConfirmOpen(true)
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title="Supprimer cette promotion ?"
        message="Cette action est irréversible."
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setConfirmOpen(false)
          setPendingDeleteId(null)
        }}
      />
    </div>
  )
}
