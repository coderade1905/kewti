import { NextRequest, NextResponse } from "next/server";
import { decodeImage } from "fayda-decoder";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json(
        { ok: false, error: { message: "No image file provided." } },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    const decoded = await decodeImage(bytes, { includeFace: true });

    return NextResponse.json(decoded);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          message: error instanceof Error ? error.message : "Failed to decode Fayda ID.",
        },
      },
      { status: 500 }
    );
  }
}
