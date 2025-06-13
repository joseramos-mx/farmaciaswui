import { Suspense } from "react"
import InventoryDashboard from "@/components/inventory-dashboard"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Pharmacy Inventory Control</h1>
      <Suspense fallback={<DashboardSkeleton />}>
        <InventoryDashboard />
      </Suspense>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-96 rounded-lg" />
    </div>
  );
}
