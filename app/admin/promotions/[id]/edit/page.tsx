"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Search } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  title: string
}

interface Category {
  id: string
  name: string
}

export default function EditPromotionPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [productSearch, setProductSearch] = useState("")
  const [categorySearch, setCategorySearch] = useState("")

  const [formData, setFormData] = useState({
    type: "PRODUCT",
    name: "",
    startDate: "",
    endDate: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    isActive: true,
    productIds: [] as string[],
    categoryIds: [] as string[],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [promotionRes, productsRes, categoriesRes] = await Promise.all([
          fetch(`/api/promotions/${id}`),
          fetch("/api/products?limit=1000"),
          fetch("/api/categories"),
        ])

        if (!promotionRes.ok) {
          throw new Error("Promotion non trouvée")
        }

        const promotionData = await promotionRes.json()
        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()

        // Format dates for datetime-local input
        const formatDateForInput = (dateStr: string) => {
          const date = new Date(dateStr)
          return date.toISOString().slice(0, 16)
        }

        setFormData({
          type: promotionData.type || "PRODUCT",
          name: promotionData.name || "",
          startDate: formatDateForInput(promotionData.startDate),
          endDate: formatDateForInput(promotionData.endDate),
          discountType: promotionData.discountType || "PERCENTAGE",
          discountValue: promotionData.discountValue?.toString() || "",
          isActive: promotionData.isActive ?? true,
          productIds: promotionData.products?.map((p: any) => p.product?.id || p.productId) || [],
          categoryIds: promotionData.categories?.map((c: any) => c.category?.id || c.categoryId) || [],
        })

        setProducts(productsData.products || productsData || [])
        setCategories(Array.isArray(categoriesData) ? categoriesData : [])
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSaving(true)

    try {
      // Validation
      if (!formData.name.trim()) {
        throw new Error("Le nom est requis")
      }
      if (!formData.startDate) {
        throw new Error("La date de début est requise")
      }
      if (!formData.endDate) {
        throw new Error("La date de fin est requise")
      }
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        throw new Error("La date de fin doit être après la date de début")
      }
      if (!formData.discountValue || parseFloat(formData.discountValue) <= 0) {
        throw new Error("La valeur de réduction doit être positive")
      }
      if (formData.discountType === "PERCENTAGE" && parseFloat(formData.discountValue) > 100) {
        throw new Error("Le pourcentage de réduction ne peut pas dépasser 100%")
      }

      // Convertir les dates au format ISO pour l'API
      const startDateISO = new Date(formData.startDate).toISOString()
      const endDateISO = new Date(formData.endDate).toISOString()

      const payload = {
        type: formData.type,
        name: formData.name.trim(),
        startDate: startDateISO,
        endDate: endDateISO,
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        isActive: formData.isActive,
        productIds: formData.productIds,
        categoryIds: formData.categoryIds,
      }

      const res = await fetch(`/api/promotions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Erreur lors de la mise à jour")
      }

      router.push("/admin/promotions")
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
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/promotions">
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Modifier la promotion</h1>
          <p className="text-muted-foreground mt-2">
            Modifier les détails de la promotion
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/promotions">
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
              <CardDescription>Détails de base de la promotion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Promotion été 2024"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <select
                  id="type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="HOT_DEAL">Offre flash</option>
                  <option value="WEEKLY">Promotion hebdomadaire</option>
                  <option value="PRODUCT">Promotion produit</option>
                  <option value="CATEGORY">Promotion catégorie</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Date de début *</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Date de fin *</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountType">Type de réduction *</Label>
                <select
                  id="discountType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  required
                >
                  <option value="PERCENTAGE">Pourcentage (%)</option>
                  <option value="FIXED">Montant fixe (€)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountValue">
                  Valeur de réduction * ({formData.discountType === "PERCENTAGE" ? "%" : "€"})
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  step={formData.discountType === "PERCENTAGE" ? "1" : "0.01"}
                  min="0"
                  max={formData.discountType === "PERCENTAGE" ? "100" : undefined}
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                  required
                  placeholder={formData.discountType === "PERCENTAGE" ? "20" : "10"}
                />
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
                  Promotion active
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Produits et catégories</CardTitle>
              <CardDescription>
                Sélectionnez les produits ou catégories concernés par cette promotion
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Produits</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un produit..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="pl-10 mb-2"
                  />
                </div>
                <div className="border border-input rounded-md p-3 max-h-60 overflow-y-auto smooth-scroll">
                  {(() => {
                    const filteredProducts = products.filter((product) =>
                      product.title.toLowerCase().includes(productSearch.toLowerCase())
                    )
                    return filteredProducts.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        {productSearch ? "Aucun produit trouvé" : "Aucun produit disponible"}
                      </p>
                    ) : (
                      filteredProducts.map((product) => (
                        <div key={product.id} className="flex items-center space-x-2 py-1 hover:bg-muted/50 rounded px-2 transition-colors">
                          <input
                            type="checkbox"
                            id={`product-${product.id}`}
                            checked={formData.productIds.includes(product.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  productIds: [...formData.productIds, product.id],
                                })
                              } else {
                                setFormData({
                                  ...formData,
                                  productIds: formData.productIds.filter((pid) => pid !== product.id),
                                })
                              }
                            }}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label
                            htmlFor={`product-${product.id}`}
                            className="cursor-pointer text-sm flex-1"
                          >
                            {product.title}
                          </Label>
                        </div>
                      ))
                    )
                  })()}
                </div>
                {formData.productIds.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {formData.productIds.length} produit(s) sélectionné(s)
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Catégories</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une catégorie..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="pl-10 mb-2"
                  />
                </div>
                <div className="border border-input rounded-md p-3 max-h-60 overflow-y-auto smooth-scroll">
                  {(() => {
                    const filteredCategories = categories.filter((category) =>
                      category.name.toLowerCase().includes(categorySearch.toLowerCase())
                    )
                    return filteredCategories.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        {categorySearch ? "Aucune catégorie trouvée" : "Aucune catégorie disponible"}
                      </p>
                    ) : (
                      filteredCategories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2 py-1 hover:bg-muted/50 rounded px-2 transition-colors">
                          <input
                            type="checkbox"
                            id={`category-${category.id}`}
                            checked={formData.categoryIds.includes(category.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  categoryIds: [...formData.categoryIds, category.id],
                                })
                              } else {
                                setFormData({
                                  ...formData,
                                  categoryIds: formData.categoryIds.filter((cid) => cid !== category.id),
                                })
                              }
                            }}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label
                            htmlFor={`category-${category.id}`}
                            className="cursor-pointer text-sm flex-1"
                          >
                            {category.name}
                          </Label>
                        </div>
                      ))
                    )
                  })()}
                </div>
                {formData.categoryIds.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {formData.categoryIds.length} catégorie(s) sélectionnée(s)
                  </p>
                )}
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
            <Link href="/admin/promotions">Annuler</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </form>

      <style jsx global>{`
        .smooth-scroll {
          scroll-behavior: smooth;
        }
        .smooth-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .smooth-scroll::-webkit-scrollbar-track {
          background: hsl(var(--muted));
          border-radius: 4px;
        }
        .smooth-scroll::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground));
          border-radius: 4px;
        }
        .smooth-scroll::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--foreground) / 0.5);
        }
      `}</style>
    </div>
  )
}
