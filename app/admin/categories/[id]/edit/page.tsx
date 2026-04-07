"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { LogoUpload } from "@/components/admin/logo-upload"

interface Category {
  id: string
  name: string
  slug: string
  parentId: string | null
  image: string | null
  description: string | null
  seoTitle: string | null
  seoDescription: string | null
  parent: { id: string; name: string } | null
}

interface CategoryOption {
  id: string
  name: string
}

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const categoryId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [category, setCategory] = useState<Category | null>(null)
  const [categories, setCategories] = useState<CategoryOption[]>([])

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parentId: "",
    image: "",
    description: "",
    seoTitle: "",
    seoDescription: "",
  })

  // Générer le slug automatiquement à partir du nom
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleSlugChange = (slug: string) => {
    // Normaliser le slug en temps réel lors de la saisie manuelle
    const normalized = generateSlug(slug)
    setFormData({ ...formData, slug: normalized })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [categoryRes, categoriesRes] = await Promise.all([
          fetch(`/api/categories/${categoryId}`),
          fetch("/api/categories"),
        ])

        if (!categoryRes.ok) {
          throw new Error("Catégorie non trouvée")
        }

        const categoryData = await categoryRes.json()
        const categoriesData = await categoriesRes.json()

        setCategory(categoryData)
        // Exclure la catégorie actuelle et ses enfants de la liste des parents possibles
        const filteredCategories = categoriesData.filter(
          (cat: CategoryOption) => cat.id !== categoryId
        )
        setCategories(filteredCategories)

        setFormData({
          name: categoryData.name || "",
          slug: categoryData.slug || "",
          parentId: categoryData.parentId || "",
          image: categoryData.image || "",
          description: categoryData.description || "",
          seoTitle: categoryData.seoTitle || "",
          seoDescription: categoryData.seoDescription || "",
        })
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement")
      } finally {
        setLoading(false)
      }
    }

    if (categoryId) {
      fetchData()
    }
  }, [categoryId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSaving(true)

    try {
      // Validation
      if (!formData.name.trim()) {
        throw new Error("Le nom est requis")
      }

      // Normaliser l'URL de l'image si elle existe
      let imageUrl = formData.image || null
      if (imageUrl && imageUrl.trim() && !imageUrl.startsWith("http") && !imageUrl.startsWith("/")) {
        imageUrl = `/${imageUrl}`
      }
      if (imageUrl && !imageUrl.trim()) {
        imageUrl = null
      }

      // S'assurer que le slug est toujours valide
      const finalSlug = formData.slug.trim() || generateSlug(formData.name)
      if (!finalSlug) {
        throw new Error("Le slug est requis")
      }

      const payload = {
        name: formData.name.trim(),
        slug: finalSlug,
        parentId: formData.parentId || null,
        image: imageUrl,
        description: formData.description?.trim() || null,
        seoTitle: formData.seoTitle?.trim() || null,
        seoDescription: formData.seoDescription?.trim() || null,
      }

      const res = await fetch(`/api/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        let errorMessage = errorData.error || "Erreur lors de la mise à jour"
        
        // Afficher les détails de validation si disponibles
        if (errorData.details && Array.isArray(errorData.details)) {
          const validationErrors = errorData.details
            .map((err: any) => `${err.path || 'champ'}: ${err.message}`)
            .join('\n')
          errorMessage = `${errorMessage}\n\nDétails:\n${validationErrors}`
        } else if (errorData.message) {
          errorMessage = errorData.message
        }
        
        throw new Error(errorMessage)
      }

      router.push("/admin/categories")
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

  if (error && !category) {
    return (
      <div className="space-y-6">
        <div className="text-destructive">{error}</div>
        <Button asChild>
          <Link href="/admin/categories">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux catégories
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Modifier la catégorie</h1>
          <p className="text-muted-foreground mt-2">
            {category?.name}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/categories">
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
              <CardDescription>Détails de base de la catégorie</CardDescription>
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
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  URL-friendly version du nom (ex: "electronique" pour "Électronique")
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentId">Catégorie parente</Label>
                <select
                  id="parentId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                >
                  <option value="">Aucune (catégorie racine)</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {category?.parent && (
                  <p className="text-xs text-muted-foreground">
                    Parent actuel: {category.parent.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Image et SEO</CardTitle>
              <CardDescription>Image de la catégorie et optimisation SEO</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <LogoUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoTitle">Titre SEO</Label>
                <Input
                  id="seoTitle"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  placeholder="Titre optimisé pour les moteurs de recherche"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoDescription">Description SEO</Label>
                <Textarea
                  id="seoDescription"
                  value={formData.seoDescription}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  rows={3}
                  placeholder="Description optimisée pour les moteurs de recherche"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {error && (
          <Card className="mt-6 border-destructive">
            <CardContent className="pt-6">
              <div className="text-sm text-destructive font-medium mb-2">Erreur</div>
              <div className="text-sm text-destructive whitespace-pre-wrap">{error}</div>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/categories">Annuler</Link>
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
