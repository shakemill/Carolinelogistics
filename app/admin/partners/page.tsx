"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

interface Partner {
  id: string
  name: string
  logo: string | null
  contact: string | null
  commissionRate: number
  isActive: boolean
  _count: {
    products: number
  }
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const fetchPartners = async () => {
    try {
      const res = await fetch("/api/partners")
      const data = await res.json()
      setPartners(data)
    } catch (error) {
      console.error("Error fetching partners:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPartners()
  }, [])

  const doDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/partners/${id}`, { method: "DELETE" })
      if (res.ok) fetchPartners()
      else {
        const error = await res.json()
        alert(error.error || "Erreur lors de la suppression")
      }
    } catch (error) {
      console.error("Error deleting partner:", error)
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
          <h1 className="text-3xl font-bold text-foreground">Partenaires</h1>
          <p className="text-muted-foreground mt-2">
            Gestion des partenaires et commissions
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/partners/new">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau partenaire
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des partenaires</CardTitle>
          <CardDescription>
            {partners.length} partenaire(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Chargement...
            </div>
          ) : partners.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun partenaire. Créez-en un pour commencer.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-foreground">Nom</th>
                    <th className="text-left p-4 text-sm font-medium text-foreground">Commission</th>
                    <th className="text-left p-4 text-sm font-medium text-foreground">Produits</th>
                    <th className="text-left p-4 text-sm font-medium text-foreground">Statut</th>
                    <th className="text-left p-4 text-sm font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {partners.map((partner) => (
                    <tr key={partner.id} className="border-b border-border hover:bg-muted/50">
                      <td className="p-4">
                        <div className="font-medium text-foreground">{partner.name}</div>
                        {partner.contact && (
                          <div className="text-sm text-muted-foreground">{partner.contact}</div>
                        )}
                      </td>
                      <td className="p-4 text-sm text-foreground">
                        {partner.commissionRate}%
                      </td>
                      <td className="p-4 text-sm text-foreground">
                        {partner._count.products}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            partner.isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {partner.isActive ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/partners/${partner.id}/edit`}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setPendingDeleteId(partner.id)
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
        title="Supprimer ce partenaire ?"
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
