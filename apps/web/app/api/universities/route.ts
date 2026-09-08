import { NextResponse } from "next/server"
import universityData from "./universities.json"

// Helper function to set CORS headers on any response
function setCorsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*")
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type")
  return response
}

export async function GET() {
  try {
    // Create the response with university data
    const response = NextResponse.json(universityData)

    // Append CORS headers for cross-origin / cross-port requests
    return setCorsHeaders(response)
  } catch (error) {
    const errorResponse = NextResponse.json(
      { error: "Failed to load bank data" },
      { status: 500 }
    )
    return setCorsHeaders(errorResponse)
  }
}

// Handle the preflight browser check request
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 })
  return setCorsHeaders(response)
}