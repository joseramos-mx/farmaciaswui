import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

async function getMedication(id) {
  const { data, error } = await supabase.from("medications").select("*").eq("id", id).single()

  if (error || !data) {
    return null
  }

  return data
}

function getTipoSugerenciaBadge(tipo) {
  switch (tipo) {
    case "Compra":
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-800 hover:bg-green-100">Compra
                  </Badge>
      );
    case "Venta":
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Venta
                  </Badge>
      );
    case "Devolución":
      return (
        <Badge
          variant="outline"
          className="bg-amber-100 text-amber-800 hover:bg-amber-100">Devolución
                  </Badge>
      );
    default:
      return <Badge variant="outline">{tipo || "N/A"}</Badge>;
  }
}

export default async function MedicationPage({ params }) {
  const medication = await getMedication(params.id)

  if (!medication) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{medication.producto}</h1>
        </div>
        <Link href={`/inventory/${params.id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Item
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Clave</p>
                <p className="text-lg font-medium">{medication.clave}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Producto</p>
                <p className="text-lg font-medium">{medication.producto}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tipo Sugerencia</p>
                <div className="mt-1">{getTipoSugerenciaBadge(medication.tipo_sugerencia)}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fecha</p>
                <p>{medication.fecha ? format(new Date(medication.fecha), "dd/MM/yyyy") : "N/A"}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Motivo</p>
              <p className="mt-1 p-3 bg-gray-50 rounded-md">{medication.motivo || "No motivo provided"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
