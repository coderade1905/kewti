import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import Papa from "papaparse"

export async function GET(request: Request) {
  try {
    const csvPath = path.join(
      process.cwd(),
      "public",
      "data",
      "ethiopia_admin_boundaries.csv"
    )
    const csvFile = fs.readFileSync(csvPath, "utf8")

    const parsed = Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
    })

    // Create the response with the data
    const response = NextResponse.json(parsed.data)

    // Add CORS headers to allow cross-port fetching in development
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type")

    return response
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load location data" },
      { status: 500 }
    )
  }
}

// Handle the preflight browser check request
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 })
  response.headers.set("Access-Control-Allow-Origin", "*")
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type")
  return response
}
