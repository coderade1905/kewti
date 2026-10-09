import { NextResponse } from "next/server"

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

export async function POST(req: Request) {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return NextResponse.json(
        { error: "Telegram bot environment variables are not configured." },
        { status: 500 }
      )
    }

    const formData = await req.formData()

    const title = formData.get("title")?.toString() || ""
    const name = formData.get("name")?.toString() || ""
    const category = formData.get("category")?.toString() || "Uncategorized"
    const website = formData.get("website")?.toString() || "None"
    const svgFile = formData.get("svg") as File | null
    const pngFile = formData.get("png") as File | null

    if (!title || !name) {
      return NextResponse.json(
        { error: "Title and slug identifier are required." },
        { status: 400 }
      )
    }

    if (!svgFile && !pngFile) {
      return NextResponse.json(
        { error: "At least one file (SVG or PNG) is required." },
        { status: 400 }
      )
    }

    // Build the registry JSON snippet to copy-paste easily
    const registrySnippet = JSON.stringify(
      {
        name,
        title,
        files: [
          ...(svgFile
            ? [{ path: `assets/logos/${name}.svg`, target: `src/logos/${name}.svg`, type: "image/svg+xml" }]
            : []),
          ...(pngFile
            ? [{ path: `assets/logos/${name}.png`, target: `src/logos/${name}.png`, type: "image/png" }]
            : []),
        ],
      },
      null,
      2
    )

    const caption = `🎨 <b>New Kewti Logo Submission</b>\n\n` +
      `<b>Title:</b> ${title}\n` +
      `<b>Slug:</b> <code>${name}</code>\n` +
      `<b>Category:</b> ${category}\n` +
      `<b>Website:</b> ${website}\n\n` +
      `<b>Registry Entry:</b>\n<pre><code class="language-json">${registrySnippet}</code></pre>`

    // Helper to send a file to Telegram
    const sendToTelegram = async (file: File, fileCaption?: string) => {
      const tgForm = new FormData()
      tgForm.append("chat_id", TELEGRAM_CHAT_ID!)
      tgForm.append("document", file, file.name)
      if (fileCaption) {
        tgForm.append("caption", fileCaption)
        tgForm.append("parse_mode", "HTML")
      }

      const res = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`,
        {
          method: "POST",
          body: tgForm,
        }
      )

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.description || "Failed to send document to Telegram.")
      }
    }

    // Send primary file with caption
    if (svgFile) {
      await sendToTelegram(svgFile, caption)
      // Send optional PNG as a secondary document
      if (pngFile) {
        await sendToTelegram(pngFile, `🖼️ Raster PNG version for <code>${name}</code>`)
      }
    } else if (pngFile) {
      await sendToTelegram(pngFile, caption)
    }

    return NextResponse.json({ success: true, message: "Logo submitted via Telegram!" })
  } catch (error) {
    console.error("Telegram upload error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit logo." },
      { status: 500 }
    )
  }
}