"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ChevronDown,
  ChevronUp,
  Package,
  TrendingUp,
  AlertTriangle,
  Calendar,
  RefreshCcw,
  Play,
  LogOut,
  User,
} from "lucide-react"
import LoginForm from "@/components/login-form"

export default function InventarioApp() {
  // Estados de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  // Estados de la aplicación
  const [data, setData] = useState([])
  const [showFullTable, setShowFullTable] = useState(false)
  const [loading, setLoading] = useState(false)

  // Datos de ejemplo para cuando no hay conexión a Supabase
  const sampleData = [
    {
      producto: "Paracetamol 500mg",
      tipo_sugerencia: "comprar",
      motivo: "Stock bajo, alta rotación en temporada de gripe",
      fecha: new Date().toISOString(),
      existencias: 2,
    },
    {
      producto: "Ibuprofeno 400mg",
      tipo_sugerencia: "mantener",
      motivo: "Stock adecuado para demanda actual",
      fecha: new Date(Date.now() - 86400000).toISOString(),
      existencias: 10,
    },
    {
      producto: "Jarabe para la tos",
      tipo_sugerencia: "reducir",
      motivo: "Baja rotación, próximo a vencer",
      fecha: new Date(Date.now() - 172800000).toISOString(),
      existencias: 23,
    },
    {
      producto: "Vitamina C 1000mg",
      tipo_sugerencia: "comprar",
      motivo: "Aumento de demanda estacional",
      fecha: new Date(Date.now() - 259200000).toISOString(),
      existencias: 5,
    },
    {
      producto: "Antihistamínico",
      tipo_sugerencia: "mantener",
      motivo: "Rotación estable durante todo el año",
      fecha: new Date(Date.now() - 345600000).toISOString(),
      existencias: 11,
    },
  ]

  // Función para manejar login exitoso
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData)
    setIsAuthenticated(true)
    // Cargar datos inmediatamente después del login
    fetchData()
  }

  // Función para manejar logout
  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    setData([])
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: supabaseData, error } = await supabase
        .from("InvResponses")
        .select("*")
        .order("fecha", { ascending: false })

      if (error) {
        console.error("Error de Supabase:", error)
        // Usar datos de ejemplo si hay error
        setData(sampleData)
      } else {
        setData(supabaseData && supabaseData.length > 0 ? supabaseData : sampleData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      // Usar datos de ejemplo en caso de error
      setData(sampleData)
    }
    setLoading(false)
  }

  const ejecutarWorkflow = async () => {
    setLoading(true)
    try {
      // Intentar llamar al webhook
      const response = await fetch("https://norksrms.app.n8n.cloud/webhook/6ab7bb26-79c9-4497-b3f5-95f98380dc62", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "actualizar" }),
      })

      if (response.ok) {
        const result = await response.json()
        if (result && Array.isArray(result)) {
          setData(result)
        }
        alert("Workflow ejecutado exitosamente!")
      } else {
        throw new Error("Error en la respuesta del servidor")
      }
    } catch (error) {
      console.error("Error ejecutando workflow:", error)

    }

    // Refrescar datos después de ejecutar
    await fetchData()
    setLoading(false)
  }

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />
  }

  // Calcular estadísticas
  const recentSuggestions = data.slice(0, 5)
  const totalSuggestions = data.length
  const todaySuggestions = data.filter((item) => {
    const today = new Date().toDateString()
    const itemDate = new Date(item.fecha).toDateString()
    return today === itemDate
  }).length

  const suggestionTypes = data.reduce((acc, item) => {
    acc[item.tipo_sugerencia] = (acc[item.tipo_sugerencia] || 0) + 1
    return acc
  }, {})

  const getSuggestionBadgeColor = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case "comprar":
      case "reabastecer":
        return "bg-red-100 text-red-800 border-red-200"
      case "mantener":
      case "liquidar":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "evitar":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
        case "estacional":
        return "bg-purple-100 text-purple-800 border-purple-200"
    }
  }

  const getSuggestionIcon = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case "comprar":
      case "reabastecer":
        return <TrendingUp className="h-4 w-4" />
      case "reducir":
      case "liquidar":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 w-full max-w-7xl mx-auto">
      {/* Header con información de usuario y logout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Inventario Inteligente</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Gestión automatizada de sugerencias de inventario farmacéutico
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Última actualización:</span>
            <span className="sm:hidden">Actualizado:</span>
            {data[0] ? new Date(data[0].fecha).toLocaleDateString() : "N/A"}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{currentUser?.name || currentUser?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="text-xs hover:bg-red-400 hover:text-white">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline ml-1 ">Salir</span>
            </Button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              className="bg-emerald-600 hover:bg-emerald-800 text-white flex-1 sm:flex-none text-sm"
              onClick={ejecutarWorkflow}
              disabled={loading}
              size="sm"
            >
              <Play className="h-4 w-4" />
              <span className="hidden xs:inline ml-1">Ejecutar</span>
            </Button>
            <Button
              className="bg-indigo-500 hover:bg-indigo-800 text-white flex-1 sm:flex-none text-sm"
              onClick={fetchData}
              disabled={loading}
              size="sm"
            >
              <RefreshCcw className="h-4 w-4" />
              <span className="hidden xs:inline ml-1">Refrescar</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Sugerencias</CardTitle>
            <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="text-lg sm:text-2xl font-bold">{totalSuggestions}</div>
            <p className="text-xs text-muted-foreground">Sugerencias registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Hoy</CardTitle>
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="text-lg sm:text-2xl font-bold">{todaySuggestions}</div>
            <p className="text-xs text-muted-foreground">Sugerencias de hoy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Más Frecuente</CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="text-lg sm:text-2xl font-bold">
              {Object.keys(suggestionTypes).length > 0
                ? Object.entries(suggestionTypes).sort(([, a], [, b]) => b - a)[0][0]
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Tipo de sugerencia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Productos Únicos</CardTitle>
            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="text-lg sm:text-2xl font-bold">{new Set(data.map((item) => item.producto)).size}</div>
            <p className="text-xs text-muted-foreground">Productos diferentes</p>
          </CardContent>
        </Card>
      </div>

      {/* Sugerencias Recientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Sugerencias Recientes
          </CardTitle>
          <CardDescription>Las 5 sugerencias más recientes del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentSuggestions.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors gap-3 sm:gap-0"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 flex-shrink-0">
                    {getSuggestionIcon(item.tipo_sugerencia)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base truncate">{item.producto} <Badge className="bg-blue-100 text-blue-950 text-xs rounded pl-2">{item.existencias}</Badge></p>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-1">
                      {item.motivo}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0">
                  <Badge className={`${getSuggestionBadgeColor(item.tipo_sugerencia)} text-xs`}>
                    {item.tipo_sugerencia}
                  </Badge>
                  <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(item.fecha).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Botón para mostrar tabla completa */}
      <div className="flex justify-center">
        <Button variant="outline" onClick={() => setShowFullTable(!showFullTable)} className="flex items-center gap-2">
          {showFullTable ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Ocultar tabla completa
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Ver tabla completa ({totalSuggestions} registros)
            </>
          )}
        </Button>
      </div>

      {/* Tabla completa */}
      {showFullTable && (
        <Card>
          <CardHeader>
            <CardTitle>Historial Completo de Sugerencias</CardTitle>
            <CardDescription>Todas las sugerencias del sistema ordenadas por fecha</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px] sm:w-[200px]">Producto</TableHead>
                      <TableHead className="min-w-[100px] sm:w-[120px]">existencias</TableHead>
                      <TableHead className="min-w-[100px]">Sugerencia</TableHead>
                      <TableHead className="hidden lg:table-cell min-w-[200px]">Motivo</TableHead>
                      <TableHead className="min-w-[100px] sm:w-[120px]">Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((row, index) => (
                      <TableRow key={index} className="hover:bg-muted/50">
                        <TableCell className="font-medium text-sm">
                          <div className="truncate max-w-[120px] sm:max-w-none" title={row.producto}>
                            {row.producto}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2" title={row.existencias}>
                            {row.existencias}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getSuggestionBadgeColor(row.tipo_sugerencia)} text-xs`}>
                            <span className="hidden sm:inline">{row.tipo_sugerencia}</span>
                            <span className="sm:hidden">{row.tipo_sugerencia.substring(0, 3)}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell max-w-md">
                          <span className="truncate block text-sm" title={row.motivo}>
                            {row.motivo}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs sm:text-sm">
                          <div className="whitespace-nowrap">{new Date(row.fecha).toLocaleDateString()}</div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
