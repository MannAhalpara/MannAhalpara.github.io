import { z } from "zod";

/** One schema for the form (client) and the route handler (server), so the rules never drift. */
export const CONTACT_REASONS = [
  "Research collaboration",
  "Internship",
  "Job opportunity",
  "Other",
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100, "Keep it under 100 characters."),
  email: z.string().trim().pipe(z.email("Please enter a valid email address.")),
  reason: z.enum(CONTACT_REASONS, "Please choose a reason."),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters.")
    .max(2000, "Keep it under 2000 characters."),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;
export type ContactErrors = Partial<Record<ContactField, string>>;

/** First error message per field. */
export function fieldErrors(error: z.ZodError): ContactErrors {
  const out: ContactErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as ContactField | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

/** Spam guards: submissions faster than this after the form loaded are dropped. */
export const MIN_FILL_MS = 3000;
