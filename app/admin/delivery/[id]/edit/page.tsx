"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

interface DeliveryZone {
  id: string
  name: string
  price: number
  isActive: boolean
}

export default function EditDeliveryZonePage() {
  const router = useRouter()
  const params = useParams()
  const zoneId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [zone, setZone] = useState<DeliveryZone | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    isActive: true,
  })

  useEffect(() => {
    const fetchZone = async () => {
      try {
        setLoading(true)
        setError("")

        if (!zoneId) {
          setError("ID de la zone manquant")
          setLoading(false)
          return
        }

        const res = await fetch(`/api/delivery/zones/${zoneId}`)

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Zone de livraison non trouvée")
          }
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || `Erreur ${res.status}`)
        }

        const zoneData = await res.json()

        if (!zoneData || !zoneData.id) {
          throw new Error("Données de zone invalides")
        }

        setZone(zoneData)
        setFormData({
          name: zoneData.name || "",
          price: zoneData.price?.toString() || "",
          isActive: zoneData.isActive !== false,
        })
      } catch (err: any) {
        console.error("Error fetching zone:", err)
        setError(err.message || "Erreur lors du chargement")
      } finally {
        setLoading(false)
      }
    }

    if (zoneId) {
      fetchZone()
    }
  }, [zoneId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSaving(true)

    try {
      // Validation
      if (!formData.name.trim()) {
        throw new Error("Le nom est requis")
      }
      if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
        throw new Error("Le prix doit être un nombre positif")
      }

      const payload = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        isActive: formData.isActive,
      }

      const res = await fetch(`/api/delivery/zones/${zoneId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Erreur lors de la mise à jour")
      }

      router.push("/admin/delivery")
      router.refresh()
    } catch (err: any) {
      console.error("Error saving zone:", err)
      setError(err.message || "Erreur lors de la sauvegarde")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Chargement de la zone...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !zone) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Erreur</h1>
            <p className="text-muted-foreground mt-2">
              Impossible de charger la zone de livraison
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/admin/delivery">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Link>
          </Button>
        </div>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-destructive font-medium">{error}</div>
            <div className="text-sm text-muted-foreground mt-4">
              <p><strong>ID de la zone:</strong> {zoneId}</p>
            </div>
            <div className="pt-4">
              <Button variant="outline" asChild>
                <Link href="/admin/delivery">Retour à la liste des zones</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Modifier la zone de livraison</h1>
          <p className="text-muted-foreground mt-2">
            {zone?.name}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/delivery">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informations de la zone</CardTitle>
            <CardDescription>Modifiez les détails de la zone de livraison</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Zone Paris"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Prix (€) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                placeholder="5.00"
              />
              <p className="text-xs text-muted-foreground">
                Prix de livraison pour cette zone en euros
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Zone active
              </Label>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="mt-6 border-destructive">
            <CardContent className="pt-6">
              <div className="text-sm text-destructive">{error}</div>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/delivery">Annuler</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </form>
    </div>
  )
}
