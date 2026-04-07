import { AdminLayoutWrapper } from "@/components/admin/admin-layout-wrapper"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Authentication is handled by middleware
  // The middleware will redirect to /admin/login if no session token is found
  // So if we reach here, the user is authenticated (middleware passed)
  
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
}
