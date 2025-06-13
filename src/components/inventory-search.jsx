"use client"

import { useState } from "react"
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

export default function InventorySearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");

useEffect(() => {
  const query = searchParams.get("query");
  if (query !== searchQuery) {
    setSearchQuery(query || "");
  }
}, [searchParams]);
  const [tipoSugerencia, setTipoSugerencia] = useState(searchParams.get("tipo") || "all")

  const handleSearch = (e) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (searchQuery) params.set("query", searchQuery)
    if (tipoSugerencia !== "all") params.set("tipo", tipoSugerencia)

    router.push(`/?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-grow">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by producto or clave..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <Select value={tipoSugerencia} onValueChange={setTipoSugerencia}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Compra">Compra</SelectItem>
            <SelectItem value="Venta">Venta</SelectItem>
            <SelectItem value="Devolución">Devolución</SelectItem>
          </SelectContent>
        </Select>

        <Button type="submit">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
    </form>
  );
}
