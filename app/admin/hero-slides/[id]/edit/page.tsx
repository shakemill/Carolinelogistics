"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ImageUpload } from "@/components/admin/image-upload"

export default function EditHeroSlidePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    image: "",
    ctaText: "",
    ctaLink: "",
    badge: "",
    order: 0,
    isActive: true,
  })

  useEffect(() => {
    const fetchSlide = async () => {
      try {
        const res = await fetch(`/api/hero-slides/${id}`)
        if (!res.ok) throw new Error("Slide non trouvé")
        const data = await res.json()
        setFormData({
          title: data.title || "",
          subtitle: data.subtitle || "",
          description: data.description || "",
          image: data.image || "",
          ctaText: data.ctaText || "",
          ctaLink: data.ctaLink || "",
          badge: data.badge || "",
          order: data.sortOrder ?? 0,
          isActive: data.isActive ?? true,
        })
      } catch (e: any) {
        setError(e.message || "Erreur")
      } finally {
        setLoading(false)
      }
    }
    fetchSlide()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!formData.title.trim()) {
      setError("Le titre est requis")
      return
    }
    if (!formData.image) {
      setError("L'image est requise")
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/hero-slides/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          subtitle: formData.subtitle || null,
          description: formData.description || null,
          ctaText: formData.ctaText || null,
          ctaLink: formData.ctaLink || null,
          badge: formData.badge || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erreur lors de la mise à jour")
      }

      router.push("/admin/hero-slides")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Erreur")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/hero-slides">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div className="text-muted-foreground">Chargement...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/hero-slides">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Modifier le slide</h1>
          <p className="text-muted-foreground mt-1">Modifier le contenu du slide hero</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Contenu du slide</CardTitle>
            <CardDescription>Titre, image et call-to-action</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Découvrez nos Produits de Qualité"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="subtitle">Sous-titre / Badge texte</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Nouvelle Collection 2026"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Courte description..."
                rows={3}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Image *</Label>
              <div className="mt-2">
                <ImageUpload
                  images={formData.image ? [formData.image] : []}
                  onChange={(urls) => setFormData({ ...formData, image: urls[0] || "" })}
                  maxImages={1}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ctaText">Texte du bouton</Label>
                <Input
                  id="ctaText"
                  value={formData.ctaText}
                  onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                  placeholder="Voir la Boutique"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="ctaLink">Lien du bouton</Label>
                <Input
                  id="ctaLink"
                  value={formData.ctaLink}
                  onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                  placeholder="/boutique"
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="badge">Badge (ex: -30%)</Label>
              <Input
                id="badge"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="-30%"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="order">Ordre d&apos;affichage</Label>
              <Input
                id="order"
                type="number"
                min={0}
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="mt-2"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="isActive">Slide actif (visible sur le site)</Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={saving}>
                {saving ? "Enregistrement..." : "Enregistrer"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/hero-slides">Annuler</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
