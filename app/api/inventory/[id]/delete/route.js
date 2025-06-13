import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { redirect } from "next/navigation"

export async function POST(request, { params }) {
  try {
    const { error } = await supabase.from("medications").delete().eq("id", params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Redirect to the home page after successful deletion
    redirect("/")
  } catch (error) {
    console.error("Error deleting item:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
