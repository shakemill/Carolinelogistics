"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { LogoUpload } from "@/components/admin/logo-upload"

export default function NewPartnerPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    contact: "",
    commissionRate: "0",
    isActive: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSaving(true)

    try {
      const payload = {
        name: formData.name,
        logo: formData.logo || null,
        contact: formData.contact || null,
        commissionRate: parseFloat(formData.commissionRate) || 0,
        isActive: formData.isActive,
      }

      const res = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Erreur lors de la création")
      }

      router.push("/admin/partners")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Erreur lors de la sauvegarde")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nouveau partenaire</h1>
          <p className="text-muted-foreground mt-2">
            Créer un nouveau partenaire
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/partners">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informations du partenaire</CardTitle>
            <CardDescription>Détails du partenaire et commission</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <LogoUpload
                value={formData.logo}
                onChange={(url) => setFormData({ ...formData, logo: url })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact</Label>
              <Textarea
                id="contact"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                rows={3}
                placeholder="Email, téléphone, adresse..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="commissionRate">Taux de commission (%) *</Label>
                <Input
                  id="commissionRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.commissionRate}
                  onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Statut</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    Partenaire actif
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-destructive mt-6">
            <CardContent className="pt-6">
              <div className="text-sm text-destructive">{error}</div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/partners">Annuler</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Création..." : "Créer le partenaire"}
          </Button>
        </div>
      </form>
    </div>
  )
}
