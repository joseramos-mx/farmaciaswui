import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { ClipboardList, AlertCircle } from "lucide-react"

async function getInventoryStats() {
  // Get total inventory count
  const { count: totalCount } = await supabase.from("InvResponses").select("*", { count: "exact", head: true })

  // Get count by tipo_sugerencia
  const { data: sugerenciasData } = await supabase
    .from("InvResponses")
      .select("tipo_sugerencia, count:tipo_sugerencia", { count: "exact", head: false });


  // Transform the data for easier use
  const sugerenciasCount = {}
  if (sugerenciasData) {
    sugerenciasData.forEach((item) => {
      sugerenciasCount[item.tipo_sugerencia] = item.count
    })
  }

  return {
    totalCount: totalCount || 0,
    sugerenciasCount,
  }
}

export default async function InventoryStats() {
  const stats = await getInventoryStats()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCount}</div>
          <p className="text-xs text-muted-foreground">Total inventory items</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Suggestions</CardTitle>
          <AlertCircle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(stats.sugerenciasCount).map(([tipo, count]) => (
              <div key={tipo} className="flex justify-between items-center">
                <span className="text-sm">{tipo || "No category"}</span>
                <span className="text-sm font-medium">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
