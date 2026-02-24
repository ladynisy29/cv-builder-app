AI-powered CV tailoring tool built with Next.js and the Vercel AI SDK.

CV Forge allows users to upload their existing CV, paste a job description, and generate a professionally tailored resume optimized for that specific role — without fabricating experience.

---

## Features

* Upload existing CV (PDF) and Job description
* AI-powered resume rewriting
* Tailors CV to a specific job description
* Preserves factual information (no hallucinated experience)
* Structured JSON output using Zod schema validation
* Built with Next.js App Router
* Clean modern UI with shadcn/ui + Tailwind

---

## Tech Stack

* **Next.js 14 (App Router)**
* **TypeScript**
* **Vercel AI SDK**
* **OpenAI (gpt-4o-mini)**
* **Zod (schema validation)**
* **Tailwind CSS**
* **shadcn/ui**

---

## 📂 Project Structure

```
app/
 ├── api/
 │   ├── generate-cv/route.ts   # AI CV generation endpoint
 │   └── parse-pdf/route.ts     # PDF text extraction endpoint
 ├── page.tsx                   # Main UI
components/
 ├── file-upload.tsx
 ├── cv-preview.tsx
 ├── step-indicator.tsx
```

---

##  How It Works

1. User uploads a CV (PDF)
2. PDF is parsed into raw text
3. User pastes job description
4. Backend sends both to OpenAI using structured schema output
5. AI returns a validated CV object
6. Frontend renders the tailored CV

---

##  AI Architecture

The project uses `generateObject()` from the Vercel AI SDK to ensure:

* Strict schema validation via Zod
* No malformed JSON
* No manual parsing
* Reliable structured responses

Example:

```ts
const { object } = await generateObject({
  model: openai("gpt-4o-mini"),
  schema: CVSchema,
  system: "...",
  prompt: "...",
})
```

---

## Installation

Clone the repo:

```bash
git clone https://github.com/yourusername/cv-forge.git
cd cv-forge
```

Install dependencies:

```bash
npm install
```

Install OpenAI provider:

```bash
npm install @ai-sdk/openai
```

Create `.env.local`:

```
OPENAI_API_KEY=your_openai_key_here
```

Run the dev server:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

##Environment Variables

```
OPENAI_API_KEY=
```

---

## Future Improvements

* Export generated CV as PDF
* ATS keyword optimization scoring
* Multiple CV templates
* Cover letter generation
* User authentication & saved CV history
* Deployment to Vercel

---

## ⚠️ Limitations

* Relies on quality of input CV
* AI does not fabricate missing experience
* PDF parsing accuracy depends on formatting

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first.


