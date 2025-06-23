"use client"

import { useAuth } from "@/hooks/use-auth"
import LoginForm from "../../components/login-form"
import { Loader2 } from "lucide-react"

export default function AuthGuard({ children }) {
  const { user, profile, loading, isAdmin } = useAuth()

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  // Si no hay usuario o no es admin, mostrar login
  if (!user || !isAdmin) {
    return <LoginForm />
  }

  // Si es admin, mostrar el contenido protegido
  return <>{children}</>
}
