"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

interface DeliveryZone {
  id: string
  name: string
  price: number
  isActive: boolean
}

export default function DeliveryPage() {
  const [zones, setZones] = useState<DeliveryZone[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const fetchZones = async () => {
    try {
      const res = await fetch("/api/delivery/zones")
      const data = await res.json()
      setZones(data)
    } catch (error) {
      console.error("Error fetching delivery zones:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchZones()
  }, [])

  const doDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/delivery/zones/${id}`, { method: "DELETE" })
      if (res.ok) fetchZones()
      else {
        const error = await res.json()
        alert(error.error || "Erreur lors de la suppression")
      }
    } catch (error) {
      console.error("Error deleting delivery zone:", error)
      alert("Erreur lors de la suppression")
    } finally {
      setConfirmOpen(false)
      setPendingDeleteId(null)
    }
  }

  const handleConfirmDelete = () => {
    if (pendingDeleteId) doDelete(pendingDeleteId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Zones de Livraison</h1>
          <p className="text-muted-foreground mt-2">
            Gestion des zones de livraison et tarification
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/delivery/new">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle zone
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des zones</CardTitle>
          <CardDescription>
            {zones.length} zone(s) de livraison
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Chargement...
            </div>
          ) : zones.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune zone de livraison. Créez-en une pour commencer.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-foreground">Nom</th>
                    <th className="text-left p-4 text-sm font-medium text-foreground">Prix</th>
                    <th className="text-left p-4 text-sm font-medium text-foreground">Statut</th>
                    <th className="text-left p-4 text-sm font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {zones.map((zone) => (
                    <tr key={zone.id} className="border-b border-border hover:bg-muted/50">
                      <td className="p-4 font-medium text-foreground">{zone.name}</td>
                      <td className="p-4 text-sm text-foreground">
                        {zone.price.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            zone.isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {zone.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/delivery/${zone.id}/edit`}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setPendingDeleteId(zone.id)
                              setConfirmOpen(true)
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title="Supprimer cette zone de livraison ?"
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
