"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  Percent,
  Truck,
  BarChart3,
  Settings,
  LogOut,
  Handshake,
  Mail,
  Image as ImageIcon,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

const menuItems = [
  {
    title: "Tableau de bord",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "MANAGER", "STAFF"] as const,
  },
  {
    title: "Produits",
    href: "/admin/products",
    icon: Package,
    roles: ["ADMIN", "MANAGER", "STAFF"] as const,
  },
  {
    title: "Catégories",
    href: "/admin/categories",
    icon: FolderTree,
    roles: ["ADMIN", "MANAGER"] as const,
  },
  {
    title: "Commandes",
    href: "/admin/orders",
    icon: ShoppingCart,
    roles: ["ADMIN", "MANAGER", "STAFF"] as const,
  },
  {
    title: "Partenaires",
    href: "/admin/partners",
    icon: Handshake,
    roles: ["ADMIN", "MANAGER"] as const,
  },
  {
    title: "Promotions",
    href: "/admin/promotions",
    icon: Percent,
    roles: ["ADMIN", "MANAGER"] as const,
  },
  {
    title: "Livraison",
    href: "/admin/delivery",
    icon: Truck,
    roles: ["ADMIN", "MANAGER"] as const,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    roles: ["ADMIN", "MANAGER"] as const,
  },
  {
    title: "Newsletter",
    href: "/admin/newsletter",
    icon: Mail,
    roles: ["ADMIN", "MANAGER"] as const,
  },
  {
    title: "Hero Slider",
    href: "/admin/hero-slides",
    icon: ImageIcon,
    roles: ["ADMIN", "MANAGER"] as const,
  },
  {
    title: "Blog",
    href: "/admin/blog",
    icon: FileText,
    roles: ["ADMIN", "MANAGER"] as const,
  },
  {
    title: "Utilisateurs",
    href: "/admin/users",
    icon: Users,
    roles: ["ADMIN"] as const,
  },
  {
    title: "Paramètres",
    href: "/admin/settings",
    icon: Settings,
    roles: ["ADMIN"] as const,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { user, hasAnyRole } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/admin/login")
    router.refresh()
  }

  const filteredMenuItems = menuItems.filter((item) =>
    hasAnyRole(item.roles)
  )

  return (
    <div className="w-64 bg-card border-r border-border h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-border">
        <Link href="/admin/dashboard" className="block">
          <div className="relative h-12 w-auto mb-2">
            <Image
              src="/logo.png"
              alt="Caroline Logistics"
              width={180}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.title}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="mb-4 px-4 py-2 bg-muted rounded-lg">
          <p className="text-sm font-medium text-foreground">{user?.name || user?.email}</p>
          <p className="text-xs text-muted-foreground capitalize">{user?.role?.toLowerCase()}</p>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    </div>
  )
}
