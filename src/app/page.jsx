import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import MedicationForm from "@/components/medication-form"

async function getMedication(id) {
  const { data, error } = await supabase.from("medications").select("*").eq("id", id).single()

  if (error || !data) {
    return null
  }

  return data
}

export default async function EditMedicationPage({ params }) {
  const medication = await getMedication(params.id)

  if (!medication) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href={`/inventory/${params.id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit {medication.producto}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Item Details</CardTitle>
        </CardHeader>
        <CardContent>
          <MedicationForm medication={medication} />
        </CardContent>
      </Card>
    </div>
  )
}
