// ProtectedRoute is now a no-op - all routes are accessible without authentication
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
