import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request) {
  try {
    const data = await request.json()

    const { data: medication, error } = await supabase.from("medications").insert([data]).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(medication, { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
