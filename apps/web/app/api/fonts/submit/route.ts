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

    const title = formData.get("title")?.toString().trim() || ""
    const name = formData.get("name")?.toString().trim() || ""
    const creator = formData.get("creator")?.toString().trim() || ""
    const license = formData.get("license")?.toString().trim() || "Unknown License"
    const format = formData.get("format")?.toString().trim() || "truetype"
    const website = formData.get("website")?.toString().trim() || "None"

    const files = formData
      .getAll("files")
      .filter((entry): entry is File => entry instanceof File)
    const variantNames = formData
      .getAll("variantNames")
      .map((entry) => entry.toString().trim())
      .filter((entry): entry is string => Boolean(entry))

    if (!title || !name) {
      return NextResponse.json(
        { error: "Font title and slug identifier are required." },
        { status: 400 }
      )
    }

    if (!creator) {
      return NextResponse.json(
        { error: "Creator / Foundry name is required." },
        { status: 400 }
      )
    }

    if (files.length === 0) {
      return NextResponse.json(
        { error: "At least one font file (.ttf, .otf, or .woff2) is required." },
        { status: 400 }
      )
    }

    const firstFile = files[0]
    if (!firstFile) {
      return NextResponse.json(
        { error: "At least one valid font file is required." },
        { status: 400 }
      )
    }

    // Build the registry JSON snippet for easy copy-pasting
    const registrySnippet = JSON.stringify(
      {
        name,
        title,
        creator,
        license,
        format,
        ...(website !== "None" ? { website } : {}),
        variants: files.map((file, idx) => {
          const variantName = variantNames[idx] || `variant-${idx + 1}`
          const ext = file.name.split(".").pop() || "ttf"
          const fileName = `${name}_${variantName}.${ext}`
          return {
            name: variantName,
            file: fileName,
            path: `assets/fonts/${name}/${fileName}`,
            target: `src/fonts/${name}/${fileName}`,
          }
        }),
      },
      null,
      2
    )

    const mainMessage =
      `🔤 <b>New Kewti Font Submission</b>\n\n` +
      `<b>Title:</b> ${title}\n` +
      `<b>Slug:</b> <code>${name}</code>\n` +
      `<b>Created By:</b> ${creator}\n` +
      `<b>License:</b> ${license}\n` +
      `<b>Format:</b> ${format}\n` +
      `<b>Website:</b> ${website}\n` +
      `<b>Variants:</b> ${files.length}\n\n` +
      `<b>Registry Entry:</b>\n<pre><code class="language-json">${registrySnippet}</code></pre>`

    // Helper to send a text message (supports up to 4096 chars)
    const sendTextMessage = async (text: string) => {
      const res = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text,
            parse_mode: "HTML",
          }),
        }
      )

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.description || "Failed to send Telegram message.")
      }
    }

    // Helper to send a document/file to Telegram
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
        throw new Error(errorData.description || "Failed to send font file to Telegram.")
      }
    }

    // Telegram document captions have a strict 1024 character limit.
    // If the JSON registry snippet is long, send metadata as a message first.
    if (mainMessage.length <= 1024) {
      await sendToTelegram(firstFile, mainMessage)
    } else {
      await sendTextMessage(mainMessage)
      const firstVariant = variantNames[0] || "regular"
      await sendToTelegram(
        firstFile,
        `🔤 Variant: <b>${firstVariant}</b> for <code>${name}</code>`
      )
    }

    // Send any additional variant files (e.g. bold, italic, semi-bold)
    for (const [index, file] of files.entries()) {
      if (index === 0) continue

      const variantName = variantNames[index] || `variant-${index + 1}`
      await sendToTelegram(
        file,
        `🔤 Variant: <b>${variantName}</b> for <code>${name}</code>`
      )
    }

    return NextResponse.json({
      success: true,
      message: "Font submitted via Telegram!",
    })
  } catch (error) {
    console.error("Telegram upload error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to submit font.",
      },
      { status: 500 }
    )
  }
}