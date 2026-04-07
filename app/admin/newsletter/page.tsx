"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useToast } from "@/components/ui/use-toast"
import { Mail, Search, Download, Trash2, Loader2, Users, CheckCircle2, TrendingUp } from "lucide-react"
import { format } from "date-fns"

interface Subscriber {
  id: string
  email: string
  consent: boolean
  createdAt: string
}

interface NewsletterStats {
  total: number
  withConsent: number
  newSubscribers: number
}

interface NewsletterData {
  subscribers: Subscriber[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  stats: NewsletterStats
}

export default function NewsletterPage() {
  const [data, setData] = useState<NewsletterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<{ id: string; email: string } | null>(null)
  const { toast } = useToast()

  const fetchSubscribers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "50",
        ...(search && { search }),
      })

      const response = await fetch(`/api/newsletter?${params}`)
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des abonnés")
      }

      const result = await response.json()
      setData(result)
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de charger les abonnés",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscribers()
  }, [page])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (page === 1) {
        fetchSubscribers()
      } else {
        setPage(1)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [search])

  const doDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const response = await fetch(`/api/newsletter/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Erreur lors de la suppression")
      toast({ variant: "success", title: "Succès", description: "Abonné supprimé avec succès" })
      fetchSubscribers()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer l'abonné",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
      setConfirmOpen(false)
      setPendingDelete(null)
    }
  }

  const handleConfirmDelete = () => {
    if (pendingDelete) doDelete(pendingDelete.id)
  }

  const handleExport = async () => {
    try {
      const response = await fetch("/api/newsletter/export")
      if (!response.ok) {
        throw new Error("Erreur lors de l'export")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        variant: "success",
        title: "Export réussi",
        description: "Le fichier CSV a été téléchargé",
      })
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'exporter les données",
        variant: "destructive",
      })
    }
  }

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Newsletter</h1>
          <p className="text-muted-foreground mt-2">
            Gestion des abonnés à la newsletter
          </p>
        </div>
        <Button onClick={handleExport}>
          <Download className="w-5 h-5 mr-2" />
          Exporter CSV
        </Button>
      </div>

      {/* Statistics */}
      {data?.stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total abonnés</CardTitle>
              <div className="rounded-lg bg-primary/10 p-2">
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Abonnés actifs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avec consentement</CardTitle>
              <div className="rounded-lg bg-green-500/10 p-2">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.withConsent}</div>
              <p className="text-xs text-muted-foreground">
                {data.stats.total > 0
                  ? Math.round((data.stats.withConsent / data.stats.total) * 100)
                  : 0}
                % du total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nouveaux (30j)</CardTitle>
              <div className="rounded-lg bg-blue-500/10 p-2">
                <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.newSubscribers}</div>
              <p className="text-xs text-muted-foreground">
                Derniers 30 jours
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Abonnés</CardTitle>
          <CardDescription>
            Liste des abonnés à la newsletter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher par email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : data && data.subscribers.length > 0 ? (
            <>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                        Consentement
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                        Date d'inscription
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.subscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 shrink-0">
                              <Mail className="w-5 h-5 text-primary" />
                            </div>
                            {subscriber.email}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {subscriber.consent ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Oui
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                              Non
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {format(new Date(subscriber.createdAt), "dd/MM/yyyy HH:mm")}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setPendingDelete({ id: subscriber.id, email: subscriber.email })
                              setConfirmOpen(true)
                            }}
                            disabled={deletingId === subscriber.id}
                            className="text-destructive hover:text-destructive"
                          >
                            {deletingId === subscriber.id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Affichage de {(data.pagination.page - 1) * data.pagination.limit + 1} à{" "}
                    {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} sur{" "}
                    {data.pagination.total} abonnés
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={data.pagination.page === 1}
                    >
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                      disabled={data.pagination.page === data.pagination.totalPages}
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-4">
                <Mail className="w-12 h-12 text-primary/60" />
              </div>
              <p className="text-base font-medium text-foreground">Aucun abonné trouvé</p>
              <p className="text-sm mt-1">Utilisez la recherche ou revenez plus tard</p>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title="Supprimer l'abonné"
        message={pendingDelete ? `Êtes-vous sûr de vouloir supprimer l'abonné ${pendingDelete.email} ?` : ""}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setConfirmOpen(false)
          setPendingDelete(null)
        }}
      />
    </div>
  )
}
