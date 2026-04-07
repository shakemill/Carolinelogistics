export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Login page doesn't need the admin sidebar/header
  return <>{children}</>
}
