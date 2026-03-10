import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import type { ExtractedJob } from "./types";

const extractionSchema = z.object({
  job_role: z.string(),
  company_name: z.string(),
  experience_years: z.string().nullable(),
  location: z.string().nullable(),
  date_posted: z.string().nullable(),
  salary_min: z.number().nullable(),
  salary_max: z.number().nullable(),
  description_summary: z.string().nullable(),
  required_skills: z.array(z.string()),
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function extractJobInfo(pageContent: string): Promise<ExtractedJob> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const prompt = `Extract job posting information from the following webpage content.
Return a JSON object with these exact keys:
- job_role (string): the job title
- company_name (string): the hiring company
- experience_years (string or null): e.g. "3-5", "5+", "Entry level"
- location (string or null): city/state/country or "Remote"
- date_posted (string or null): ISO date YYYY-MM-DD if found
- salary_min (number or null): annual salary lower bound in USD (whole dollars)
- salary_max (number or null): annual salary upper bound in USD (whole dollars)
- description_summary (string): 2-3 sentence summary of the role
- required_skills (string[]): list of key technical skills/requirements

If a field cannot be determined from the content, use null.

Webpage content:
${pageContent}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Extract JSON from the response (handle markdown code blocks)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("AI did not return valid JSON");
  }

  const parsed = JSON.parse(jsonMatch[0]);
  const validated = extractionSchema.parse(parsed);

  return validated;
}
