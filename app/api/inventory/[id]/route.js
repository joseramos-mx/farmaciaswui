import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function PUT(request, { params }) {
  try {
    const data = await request.json()

    const { data: medication, error } = await supabase
      .from("medications")
      .update(data)
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(medication);
  } catch (error) {
    console.error("Error updating item:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { error } = await supabase.from("medications").delete().eq("id", params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting item:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
