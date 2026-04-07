"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { ImageUpload } from "@/components/admin/image-upload"
import { RichTextEditor } from "@/components/admin/richtext-editor"

interface Category {
  id: string
  name: string
}

interface Partner {
  id: string
  name: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [partners, setPartners] = useState<Partner[]>([])

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    dimensions: "",
    weight: "",
    stock: "0",
    tva: "",
    images: [] as string[],
    categoryId: "",
    isPartner: false,
    partnerId: "",
    externalLink: "",
    isFeatured: false,
    isActive: true,
    seoTitle: "",
    seoDescription: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, partnersRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/partners"),
        ])

        const categoriesData = await categoriesRes.json()
        const partnersData = await partnersRes.json()

        setCategories(categoriesData)
        setPartners(partnersData)
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Générer le slug automatiquement à partir du titre
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleNameChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: formData.slug || generateSlug(title),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSaving(true)

    try {
      const payload = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        description: formData.description || null,
        price: parseFloat(formData.price),
        dimensions: formData.dimensions || null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        stock: parseInt(formData.stock) || 0,
        tva: formData.tva ? parseFloat(formData.tva) : null,
        images: formData.images,
        categoryId: formData.categoryId || null,
        isPartner: formData.isPartner,
        partnerId: formData.isPartner && formData.partnerId ? formData.partnerId : null,
        externalLink: formData.isPartner && formData.externalLink ? formData.externalLink : null,
        isFeatured: formData.isFeatured,
        isActive: formData.isActive,
        seoTitle: formData.seoTitle || null,
        seoDescription: formData.seoDescription || null,
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Erreur lors de la création")
      }

      router.push("/admin/products")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Erreur lors de la sauvegarde")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>Chargement...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nouveau produit</h1>
          <p className="text-muted-foreground mt-2">
            Créer un nouveau produit dans le catalogue
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>Détails de base du produit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL) *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  placeholder="auto-généré depuis le titre"
                />
                <p className="text-xs text-muted-foreground">
                  Version URL-friendly du titre (ex: "smartphone-premium-x12")
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(value) => setFormData({ ...formData, description: value })}
                  placeholder="Entrez la description du produit..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock *</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tva">TVA (%)</Label>
                  <Input
                    id="tva"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.tva}
                    onChange={(e) => setFormData({ ...formData, tva: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Poids (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  placeholder="ex: 20x30x15 cm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId">Catégorie</Label>
                <select
                  id="categoryId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                >
                  <option value="">Aucune catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Options et statut</CardTitle>
              <CardDescription>Configuration du produit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <ImageUpload
                  images={formData.images}
                  onChange={(images) => setFormData({ ...formData, images })}
                  maxImages={10}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPartner"
                    checked={formData.isPartner}
                    onChange={(e) => setFormData({ ...formData, isPartner: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="isPartner" className="cursor-pointer">
                    Produit partenaire
                  </Label>
                </div>

                {formData.isPartner && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="partnerId">Partenaire *</Label>
                      <select
                        id="partnerId"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={formData.partnerId}
                        onChange={(e) => setFormData({ ...formData, partnerId: e.target.value })}
                        required={formData.isPartner}
                      >
                        <option value="">Sélectionner un partenaire</option>
                        {partners.map((partner) => (
                          <option key={partner.id} value={partner.id}>
                            {partner.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="externalLink">Lien externe *</Label>
                      <Input
                        id="externalLink"
                        type="url"
                        value={formData.externalLink}
                        onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
                        placeholder="https://..."
                        required={formData.isPartner}
                      />
                    </div>
                  </>
                )}

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="isFeatured" className="cursor-pointer">
                    Produit en vedette
                  </Label>
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
                    Produit actif
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Optimisation SEO</CardTitle>
              <CardDescription>Métadonnées pour les moteurs de recherche</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">Titre SEO</Label>
                <Input
                  id="seoTitle"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  placeholder="Titre optimisé pour les moteurs de recherche (50-60 caractères)"
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.seoTitle.length}/60 caractères
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoDescription">Description SEO</Label>
                <Textarea
                  id="seoDescription"
                  value={formData.seoDescription}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  rows={3}
                  placeholder="Description optimisée pour les moteurs de recherche (150-160 caractères)"
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.seoDescription.length}/160 caractères
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {error && (
          <Card className="mt-6 border-destructive">
            <CardContent className="pt-6">
              <div className="text-sm text-destructive">{error}</div>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/products">Annuler</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Création..." : "Créer le produit"}
          </Button>
        </div>
      </form>
    </div>
  )
}
