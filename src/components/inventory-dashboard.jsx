import { Suspense } from "react"
import InventoryStats from "./inventory-stats"
import InventoryTable from "./inventory-table"
import InventorySearch from "./inventory-search"
import { Skeleton } from "@/components/ui/skeleton"

export default function InventoryDashboard() {
  return (
    <div className="space-y-6">
      <Suspense
        fallback={<Skeleton className="h-32 grid grid-cols-1 md:grid-cols-2 gap-4" />}>
        <InventoryStats />
      </Suspense>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <InventorySearch />
        </div>
        <Suspense fallback={<Skeleton className="h-96" />}>
          <InventoryTable />
        </Suspense>
      </div>
    </div>
  );
}
