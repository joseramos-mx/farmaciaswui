"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronUp, Package, TrendingUp, AlertTriangle, Calendar } from "lucide-react"
import { Play, RefreshCcw } from "lucide-react"

export default function InventarioPage() {
  const [data, setData] = useState([])
  const [showFullTable, setShowFullTable] = useState(false)

  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("InvResponses").select("*").order("fecha", { ascending: false })

      if (error) console.error(error)
      else setData(data)
    }

    fetchData()
  }, [])

  // Obtener estadísticas
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
      case "reducir":
      case "liquidar":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "mantener":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
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

    const fetchData = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("InvResponses")
      .select("*")
      .order("fecha", { ascending: false })

    if (error) console.error(error)
    else setData(data)
    setLoading(false)
  }

const ejecutarWorkflow = async () => {
    setLoading(true)
    const res = await fetch("https://norksrms.app.n8n.cloud/webhook-test/6ab7bb26-79c9-4497-b3f5-95f98380dc62", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accion: "actualizar" }),
    })

    const result = await res.json()
    setData(result) // <- actualiza la tabla
    setLoading(false)
  }

  return (
    <div className="p-6 space-y-6 w-5xl max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventario Inteligente</h1>
          <p className="text-muted-foreground">Gestión automatizada de sugerencias de inventario farmacéutico</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          Última actualización: {data[0] ? new Date(data[0].fecha).toLocaleDateString() : "N/A"}
        </div>
      </div>
        <div className="flex items-center gap-2">
          <Button className="bg-emerald-600 hover:bg-emerald-800 text-white" onClick={ejecutarWorkflow} disabled={loading}>
            <Play /> Ejecutar
          </Button>
          <Button className="bg-indigo-500 hover:bg-indigo-800 text-white" onClick={() => fetchData()} disabled={loading}>
            <RefreshCcw /> Refrescar
          </Button>
        </div>
      {/* Cards de estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sugerencias</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSuggestions}</div>
            <p className="text-xs text-muted-foreground">Sugerencias registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaySuggestions}</div>
            <p className="text-xs text-muted-foreground">Sugerencias de hoy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Más Frecuente</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(suggestionTypes).length > 0
                ? Object.entries(suggestionTypes).sort(([, a], [, b]) => b - a)[0][0]
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Tipo de sugerencia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Únicos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(data.map((item) => item.producto)).size}</div>
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
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                    {getSuggestionIcon(item.tipo_sugerencia)}
                  </div>
                  <div>
                    <p className="font-medium">{item.producto}</p>
                    <p className="text-sm text-muted-foreground truncate max-w-md">{item.motivo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getSuggestionBadgeColor(item.tipo_sugerencia)}>{item.tipo_sugerencia}</Badge>
                  <span className="text-sm text-muted-foreground">{new Date(item.fecha).toLocaleDateString()}</span>
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
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Producto</TableHead>
                    <TableHead>Sugerencia</TableHead>
                    <TableHead className="hidden md:table-cell">Motivo</TableHead>
                    <TableHead className="w-[120px]">Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={index} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{row.producto}</TableCell>
                      <TableCell>
                        <Badge className={getSuggestionBadgeColor(row.tipo_sugerencia)}>{row.tipo_sugerencia}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-md">
                        <span className="truncate block" title={row.motivo}>
                          {row.motivo}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(row.fecha).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
