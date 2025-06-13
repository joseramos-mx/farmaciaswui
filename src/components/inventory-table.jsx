import { supabase } from "@/lib/supabase"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Eye, Trash2 } from "lucide-react"
import Link from "next/link"

async function getInventory(query, tipo) {
  let queryBuilder = supabase.from("InvResponses").select("*").order("fecha", { ascending: false })

  if (query) {
    queryBuilder = queryBuilder.or(`producto.ilike.%${query}%,clave.ilike.%${query}%`)
  }

  if (tipo && tipo !== "all") {
    queryBuilder = queryBuilder.eq("tipo_sugerencia", tipo)
  }

  const { data, error } = await queryBuilder

  if (error) {
    console.error("Error fetching inventory:", error)
    return []
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

export default async function InventoryTable({ searchParams }) {
  const query = searchParams?.query || ""
  const tipo = searchParams?.tipo || ""

  const InvResponses = await getInventory(query, tipo)

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Clave</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Tipo Sugerencia</TableHead>
            <TableHead>Motivo</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {InvResponses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No items found. Try adjusting your search.
              </TableCell>
            </TableRow>
          ) : (
            InvResponses.map((med) => (
              <TableRow key={med.id}>
                <TableCell className="font-medium">{med.clave}</TableCell>
                <TableCell>{med.producto}</TableCell>
                <TableCell>{getTipoSugerenciaBadge(med.tipo_sugerencia)}</TableCell>
                <TableCell>{med.motivo}</TableCell>
                <TableCell>{med.fecha ? format(new Date(med.fecha), "dd/MM/yyyy") : "N/A"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/inventory/${med.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                    </Link>
                    <Link href={`/inventory/${med.id}/edit`}>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </Link>
                    <form action={`/api/inventory/${med.id}/delete`} method="POST">
                      <Button variant="ghost" size="icon" type="submit">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
