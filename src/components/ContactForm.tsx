"use client";

import { useEffect, useRef, useState } from "react";
import { identity } from "@/content/content";
import {
  CONTACT_REASONS,
  contactSchema,
  fieldErrors,
  type ContactErrors,
  type ContactField,
} from "@/lib/contact-schema";

type Status = "idle" | "sending" | "sent" | "error";

const empty = { name: "", email: "", reason: "", message: "" };

const inputCls =
  "w-full border-0 border-b border-line-strong bg-transparent py-2 font-mono text-[15px] text-ink placeholder:text-muted focus:border-accent-text focus:outline-none aria-[invalid=true]:border-accent-text";

/** Contact form that posts to /api/contact (Resend). Same zod rules as the server. */
export function ContactForm() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const startedAt = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (status === "idle") startedAt.current = Date.now();
  }, [status]);

  const set = (field: ContactField) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const errs = fieldErrors(parsed.error);
      setErrors(errs);
      const first = (Object.keys(values) as ContactField[]).find((k) => errs[k]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          company: honeypot.current?.value ?? "",
          startedAt: startedAt.current,
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        fields?: ContactErrors;
      } | null;
      if (res.ok && data?.ok) {
        setStatus("sent");
        setValues(empty);
        return;
      }
      if (data?.fields && Object.keys(data.fields).length) {
        setErrors(data.fields);
        setStatus("idle");
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  const fieldError = (field: ContactField) =>
    errors[field] ? (
      <span id={`contact-${field}-error`} className="mono text-accent-text tracking-normal normal-case">
        {errors[field]}
      </span>
    ) : null;

  const describedBy = (field: ContactField) =>
    errors[field] ? `contact-${field}-error` : undefined;

  const statusText =
    status === "sending"
      ? "Sending your message."
      : status === "sent"
        ? "Message received. I'll get back to you soon."
        : status === "error"
          ? `Something went wrong. Please email me directly at ${identity.email}.`
          : "";

  return (
    <div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {statusText}
      </p>

      {status === "sent" ? (
        <div className="border-line-strong border-t pt-6">
          <p className="text-[19px] leading-snug md:text-[22px]">
            Message received. I&apos;ll get back to you soon.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mono link-u text-muted hover:text-ink mt-4"
          >
            Send another
          </button>
        </div>
      ) : (
        <form ref={formRef} noValidate onSubmit={onSubmit} className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
          {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="contact-company">Company</label>
            <input
              ref={honeypot}
              id="contact-company"
              name="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <label htmlFor="contact-name" className="mono text-muted">
                Name
              </label>
              {fieldError("name")}
            </div>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              maxLength={100}
              autoComplete="name"
              value={values.name}
              onChange={set("name")}
              aria-invalid={!!errors.name}
              aria-describedby={describedBy("name")}
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <label htmlFor="contact-email" className="mono text-muted">
                Email
              </label>
              {fieldError("email")}
            </div>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              spellCheck={false}
              value={values.email}
              onChange={set("email")}
              aria-invalid={!!errors.email}
              aria-describedby={describedBy("email")}
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <label htmlFor="contact-reason" className="mono text-muted">
                Reason
              </label>
              {fieldError("reason")}
            </div>
            <select
              id="contact-reason"
              name="reason"
              required
              value={values.reason}
              onChange={set("reason")}
              aria-invalid={!!errors.reason}
              aria-describedby={describedBy("reason")}
              className={`${inputCls} cursor-pointer ${values.reason ? "" : "text-muted"}`}
            >
              <option value="" disabled>
                Choose one…
              </option>
              {CONTACT_REASONS.map((r) => (
                <option key={r} value={r} className="bg-surface text-ink">
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <label htmlFor="contact-message" className="mono text-muted">
                Message
              </label>
              {fieldError("message")}
            </div>
            <textarea
              id="contact-message"
              name="message"
              required
              minLength={10}
              maxLength={2000}
              rows={5}
              value={values.message}
              onChange={set("message")}
              aria-invalid={!!errors.message}
              aria-describedby={describedBy("message")}
              className={`${inputCls} resize-y`}
            />
            <span className="mono text-muted self-end text-[10.5px]" aria-hidden="true">
              {values.message.length} / 2000
            </span>
          </div>

          <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={status === "sending"}
              className="pill pill-accent w-fit disabled:cursor-wait disabled:opacity-70"
            >
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
            {status === "error" ? (
              <p className="text-[15px]">
                Something went wrong. Please email me directly at{" "}
                <a href={`mailto:${identity.email}`} className="link-u text-accent-text">
                  {identity.email}
                </a>
                .
              </p>
            ) : null}
          </div>
        </form>
      )}
    </div>
  );
}
