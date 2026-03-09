import pdf from "pdf-parse"

const MAX_PDF_SIZE_BYTES = 5 * 1024 * 1024
const ALLOWED_CONTENT_TYPES = new Set(["application/pdf", "application/octet-stream"])

function hasPdfSignature(bytes: Uint8Array) {
  if (bytes.length < 5) return false
  return (
    bytes[0] === 0x25 && // %
    bytes[1] === 0x50 && // P
    bytes[2] === 0x44 && // D
    bytes[3] === 0x46 && // F
    bytes[4] === 0x2d // -
  )
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type")?.toLowerCase() || ""
    if (![...ALLOWED_CONTENT_TYPES].some((allowed) => contentType.startsWith(allowed))) {
      return Response.json(
        {
          error:
            "Invalid content type. Please upload a PDF as application/pdf or application/octet-stream.",
        },
        { status: 415 }
      )
    }

    const contentLengthHeader = req.headers.get("content-length")
    if (contentLengthHeader) {
      const contentLength = Number(contentLengthHeader)
      if (Number.isFinite(contentLength) && contentLength > MAX_PDF_SIZE_BYTES) {
        return Response.json(
          { error: "PDF is too large. Maximum size is 5MB." },
          { status: 413 }
        )
      }
    }

    const arrayBuffer = await req.arrayBuffer()
    if (arrayBuffer.byteLength === 0) {
      return Response.json({ error: "Empty request body." }, { status: 400 })
    }
    if (arrayBuffer.byteLength > MAX_PDF_SIZE_BYTES) {
      return Response.json(
        { error: "PDF is too large. Maximum size is 5MB." },
        { status: 413 }
      )
    }

    const bytes = new Uint8Array(arrayBuffer)
    if (!hasPdfSignature(bytes)) {
      return Response.json(
        { error: "Invalid PDF file. The uploaded file is not a valid PDF." },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(arrayBuffer)

    const data = await pdf(buffer)
    const text = data.text || ""

    return Response.json({ text })
  } catch (error) {
    console.error("PDF parsing error:", error)
    return Response.json(
      { error: "Failed to parse PDF. Please ensure the file is a valid PDF." },
      { status: 400 }
    )
  }
}
