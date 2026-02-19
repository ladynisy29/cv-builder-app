import { streamText, Output } from "ai"
import { z } from "zod"

export async function POST(req: Request) {
  const formData = await req.formData()
  const cvText = formData.get("cvText") as string
  const jobOffer = formData.get("jobOffer") as string

  if (!cvText || !jobOffer) {
    return Response.json(
      { error: "Both CV text and job offer are required." },
      { status: 400 }
    )
  }

  const result = streamText({
    model: "openai/gpt-4o-mini",
    output: Output.object({
      schema: z.object({
        fullName: z.string().describe("The full name of the candidate"),
        title: z
          .string()
          .describe("A professional title tailored to the job offer"),
        email: z.string().describe("Email address from the original CV"),
        phone: z.string().describe("Phone number from the original CV"),
        location: z.string().describe("Location from the original CV"),
        summary: z
          .string()
          .describe(
            "A compelling professional summary tailored to the job offer, 2-4 sentences"
          ),
        sections: z
          .array(
            z.object({
              heading: z
                .string()
                .describe(
                  "Section heading like Experience, Education, Skills, etc."
                ),
              content: z
                .string()
                .describe(
                  "Section content with details tailored to the job offer"
                ),
            })
          )
          .describe(
            "CV sections in order: Experience, Education, Skills, and any other relevant sections"
          ),
      }),
    }),
    system: `You are an expert CV/resume writer. Your task is to create a professionally tailored CV based on the candidate's existing CV and a specific job offer.

Guidelines:
- Preserve all factual information from the original CV (name, contact, dates, companies, education).
- Rewrite the professional summary to directly address the job requirements.
- Reorganize and rephrase experience bullet points to highlight relevant skills and achievements.
- Use strong action verbs and quantified achievements where possible.
- Ensure skills section emphasizes technologies/competencies mentioned in the job offer.
- Keep the tone professional and concise.
- Do NOT fabricate experience or skills not present in the original CV.
- Format experience entries with company name, role, dates, and bullet points.
- If information is missing from the original CV, use an empty string rather than making things up.`,
    prompt: `Here is the candidate's existing CV:

---
${cvText}
---

Here is the job offer they are applying for:

---
${jobOffer}
---

Create a tailored CV that highlights the candidate's most relevant qualifications for this specific role.`,
  })

  return result.toTextStreamResponse()
}
