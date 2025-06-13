"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  clave: z.string().min(1, {
    message: "Clave is required.",
  }),
  producto: z.string().min(1, {
    message: "Producto is required.",
  }),
  tipo_sugerencia: z.string().min(1, {
    message: "Please select a tipo sugerencia.",
  }),
  motivo: z.string().optional(),
  fecha: z.date({
    required_error: "Please select a date.",
  }),
})

export default function MedicationForm({ medication }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultValues = {
    clave: medication?.clave || "",
    producto: medication?.producto || "",
    tipo_sugerencia: medication?.tipo_sugerencia || "",
    motivo: medication?.motivo || "",
    fecha: medication?.fecha ? new Date(medication.fecha) : new Date(),
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(values) {
    setIsSubmitting(true)

    try {
      if (medication) {
        // Update existing medication
        await fetch(`/api/inventory/${medication.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })

        router.push(`/inventory/${medication.id}`)
      } else {
        // Create new medication
        const response = await fetch("/api/inventory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })

        const data = await response.json()
        router.push(`/inventory/${data.id}`)
      }

      router.refresh()
    } catch (error) {
      console.error("Error saving item:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="clave"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clave</FormLabel>
                <FormControl>
                  <Input placeholder="Enter clave" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

          <FormField
            control={form.control}
            name="producto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Producto</FormLabel>
                <FormControl>
                  <Input placeholder="Enter producto name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

          <FormField
            control={form.control}
            name="tipo_sugerencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo Sugerencia</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Compra">Compra</SelectItem>
                    <SelectItem value="Venta">Venta</SelectItem>
                    <SelectItem value="Devolución">Devolución</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

          <FormField
            control={form.control}
            name="fecha"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}>
                        {field.value ? format(field.value, "dd/MM/yyyy") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )} />
        </div>

        <FormField
          control={form.control}
          name="motivo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motivo</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter motivo" className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => (medication ? router.push(`/inventory/${medication.id}`) : router.push("/"))}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {medication ? "Update" : "Create"} Item
          </Button>
        </div>
      </form>
    </Form>
  );
}
