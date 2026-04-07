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
import { ImageUpload } from "@/components/admin/image-upload"
import { RichTextEditor } from "@/components/admin/richtext-editor"

interface Product {
  id: string
  title: string
  description: string | null
  price: number
  dimensions: string | null
  weight: number | null
  stock: number
  tva: number | null
  images: string[]
  categoryId: string | null
  isPartner: boolean
  partnerId: string | null
  externalLink: string | null
  isFeatured: boolean
  isActive: boolean
  category: { id: string; name: string } | null
  partner: { id: string; name: string } | null
}

interface Category {
  id: string
  name: string
}

interface Partner {
  id: string
  name: string
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [partners, setPartners] = useState<Partner[]>([])

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    dimensions: "",
    weight: "",
    stock: "",
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

  // Générer le slug automatiquement à partir du titre
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError("")
        
        if (!productId) {
          setError("ID du produit manquant")
          setLoading(false)
          return
        }
        
        console.log("Fetching product with ID:", productId)
        
        const [productRes, categoriesRes, partnersRes] = await Promise.all([
          fetch(`/api/products/${productId}`),
          fetch("/api/categories"),
          fetch("/api/partners"),
        ])

        if (!productRes.ok) {
          let errorMessage = `Erreur ${productRes.status}`
          let errorDetails = null
          try {
            const errorData = await productRes.json()
            errorMessage = errorData.error || errorMessage
            errorDetails = errorData.details || errorData.fallbackError || null
          } catch {
            errorMessage = `Erreur HTTP ${productRes.status}: ${productRes.statusText}`
          }
          console.error("Product fetch error:", errorMessage, errorDetails)
          
          // Si c'est une erreur de schéma de base de données, donner des instructions
          if (errorDetails?.includes("schema mismatch") || errorDetails?.includes("colonnes")) {
            throw new Error(`${errorMessage}. ${errorDetails}`)
          }
          
          throw new Error(errorMessage)
        }

        const productData = await productRes.json()
        console.log("Product data received:", productData)
        
        if (!productData || !productData.id) {
          throw new Error("Produit non trouvé ou données invalides")
        }
        
        let categoriesData = []
        let partnersData = []
        
        if (categoriesRes.ok) {
          try {
            const data = await categoriesRes.json()
            categoriesData = Array.isArray(data) ? data : (Array.isArray(data.categories) ? data.categories : [])
          } catch (e) {
            console.error("Error parsing categories:", e)
          }
        }
        
        if (partnersRes.ok) {
          try {
            const data = await partnersRes.json()
            partnersData = Array.isArray(data) ? data : (Array.isArray(data.partners) ? data.partners : [])
          } catch (e) {
            console.error("Error parsing partners:", e)
          }
        }

        setProduct(productData)
        setCategories(categoriesData)
        setPartners(partnersData)

        // Gérer les images (peuvent être JSON string ou array)
        let images = []
        if (productData.images) {
          if (Array.isArray(productData.images)) {
            images = productData.images
          } else if (typeof productData.images === 'string') {
            try {
              images = JSON.parse(productData.images)
            } catch {
              images = []
            }
          }
        }

        setFormData({
          title: productData.title || "",
          slug: productData.slug || generateSlug(productData.title || ""),
          description: productData.description || "",
          price: productData.price?.toString() || "",
          dimensions: productData.dimensions || "",
          weight: productData.weight?.toString() || "",
          stock: productData.stock?.toString() || "0",
          tva: productData.tva?.toString() || "",
          images: images,
          categoryId: productData.categoryId || "",
          isPartner: productData.isPartner || false,
          partnerId: productData.partnerId || "",
          externalLink: productData.externalLink || "",
          isFeatured: productData.isFeatured || false,
          isActive: productData.isActive !== false,
          seoTitle: productData.seoTitle || "",
          seoDescription: productData.seoDescription || "",
        })
      } catch (err: any) {
        console.error("Error fetching product:", err)
        setError(err.message || "Erreur lors du chargement")
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchData()
    }
  }, [productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSaving(true)

    try {
      // Validation basique
      if (!formData.title.trim()) {
        throw new Error("Le titre est requis")
      }
      
      if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
        throw new Error("Le prix doit être un nombre positif")
      }
      
      if (formData.isPartner && !formData.partnerId) {
        throw new Error("Un partenaire est requis pour les produits partenaires")
      }
      
      if (formData.isPartner && !formData.externalLink) {
        throw new Error("Un lien externe est requis pour les produits partenaires")
      }

      const payload = {
        title: formData.title.trim(),
        slug: (formData.slug || generateSlug(formData.title)).trim(),
        description: formData.description || null,
        price: parseFloat(formData.price),
        dimensions: formData.dimensions?.trim() || null,
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
        seoTitle: formData.seoTitle?.trim() || null,
        seoDescription: formData.seoDescription?.trim() || null,
      }

      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        let errorMessage = "Erreur lors de la mise à jour"
        try {
          const errorData = await res.json()
          errorMessage = errorData.error || errorMessage
          if (errorData.details) {
            errorMessage += `: ${errorData.details}`
          }
        } catch {
          errorMessage = `Erreur HTTP ${res.status}: ${res.statusText}`
        }
        throw new Error(errorMessage)
      }

      const updatedProduct = await res.json()
      console.log("Product updated successfully:", updatedProduct)

      router.push("/admin/products")
      router.refresh()
    } catch (err: any) {
      console.error("Error saving product:", err)
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
            <p className="text-muted-foreground">Chargement du produit...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !product && !loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Erreur</h1>
            <p className="text-muted-foreground mt-2">
              Impossible de charger le produit
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux produits
            </Link>
          </Button>
        </div>
        
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Erreur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-destructive font-medium">{error}</div>
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>ID du produit:</strong> {productId}</p>
              {error.includes("schema mismatch") || error.includes("colonnes") ? (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                  <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                    ⚠️ Migration de base de données requise
                  </p>
                  <p className="text-yellow-700 dark:text-yellow-300 mb-2">
                    Les nouveaux champs SEO (slug, seoTitle, seoDescription) n'existent pas encore dans la base de données.
                  </p>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    Pour résoudre ce problème, exécutez :
                  </p>
                  <code className="block mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded text-xs">
                    pnpm db:push
                  </code>
                </div>
              ) : (
                <>
                  <p className="mt-2">Vérifiez que :</p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>Le produit existe dans la base de données</li>
                    <li>L'ID est correct</li>
                    <li>La connexion à la base de données fonctionne</li>
                    <li>Le serveur MySQL est démarré</li>
                  </ul>
                </>
              )}
            </div>
            <div className="pt-4">
              <Button variant="outline" asChild>
                <Link href="/admin/products">Retour à la liste des produits</Link>
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
          <h1 className="text-3xl font-bold text-foreground">Modifier le produit</h1>
          <p className="text-muted-foreground mt-2">
            {product?.title}
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
                  onChange={(e) => {
                    const newTitle = e.target.value
                    // Générer le slug automatiquement si le slug actuel est vide ou correspond à l'ancien slug
                    const currentSlug = formData.slug || generateSlug(product?.title || "")
                    const shouldAutoGenerate = !formData.slug || currentSlug === generateSlug(product?.title || "")
                    
                    setFormData({ 
                      ...formData, 
                      title: newTitle,
                      slug: shouldAutoGenerate ? generateSlug(newTitle) : formData.slug
                    })
                  }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL) *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => {
                    // Normaliser le slug en temps réel
                    const normalized = generateSlug(e.target.value)
                    setFormData({ ...formData, slug: normalized })
                  }}
                  required
                  placeholder="smartphone-premium-x12"
                />
                <p className="text-xs text-muted-foreground">
                  Version URL-friendly du titre (ex: "smartphone-premium-x12"). Généré automatiquement à partir du titre.
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
            {saving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </form>
    </div>
  )
}
