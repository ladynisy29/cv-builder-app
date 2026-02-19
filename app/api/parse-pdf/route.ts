import pdf from "pdf-parse"

export async function POST(req: Request) {
  try {
    const arrayBuffer = await req.arrayBuffer()
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
