import { Resend } from "resend";
import { contactSchema, fieldErrors, MIN_FILL_MS } from "@/lib/contact-schema";

// Always run on the server per request; never prerendered.
export const dynamic = "force-dynamic";

const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

const json = (body: { ok: boolean; error?: string; fields?: object }, status = 200) =>
  Response.json(body, { status });

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await req.json();
    if (!parsed || typeof parsed !== "object") throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "Invalid request body." }, 400);
  }

  // Spam: honeypot filled, or submitted too fast. Pretend it worked.
  const startedAt = Number(body.startedAt);
  const honeypot = typeof body.company === "string" ? body.company.trim() : "";
  if (honeypot || !Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
    return json({ ok: true });
  }

  const result = contactSchema.safeParse(body);
  if (!result.success) {
    return json({ ok: false, error: "Please check the form.", fields: fieldErrors(result.error) }, 400);
  }
  const { name, email, reason, message } = result.data;

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !from || !to) {
    console.error("[contact] missing RESEND_API_KEY, CONTACT_FROM_EMAIL or CONTACT_TO_EMAIL");
    return json({ ok: false, error: "Email is not configured." }, 500);
  }

  const resend = new Resend(apiKey);
  const sentAt = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Reason: ${reason}`,
    `Sent: ${sentAt} IST`,
    "",
    message,
  ].join("\n");

  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;color:#1E1414">
<p><strong>Name:</strong> ${escapeHtml(name)}<br>
<strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a><br>
<strong>Reason:</strong> ${escapeHtml(reason)}<br>
<strong>Sent:</strong> ${escapeHtml(sentAt)} IST</p>
<p style="white-space:pre-wrap;border-top:1px solid #ddd;padding-top:12px">${escapeHtml(message)}</p>
</div>`;

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `[Portfolio] ${reason} - ${name}`,
      text,
      html,
    });
    if (error) {
      console.error("[contact] send to owner failed:", error.name, error.message);
      return json({ ok: false, error: "Could not send your message." }, 502);
    }
  } catch (err) {
    console.error("[contact] send to owner threw:", err instanceof Error ? err.message : "unknown");
    return json({ ok: false, error: "Could not send your message." }, 502);
  }

  return json({ ok: true });
}
