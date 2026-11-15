"use client";

import { identity } from "@/content/content";
import { toast } from "./Toast";

/** Big email link: click copies to the clipboard (falls back to mailto). */
export function CopyEmail({ className }: { className?: string }) {
  const onClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!navigator.clipboard) return; // let mailto: work
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(identity.email);
      toast("Email copied to clipboard");
    } catch {
      window.location.href = `mailto:${identity.email}`;
    }
  };
  return (
    <a
      href={`mailto:${identity.email}`}
      onClick={onClick}
      data-cursor="COPY"
      className={className}
      aria-label={`Copy email address ${identity.email}`}
    >
      {identity.email}
    </a>
  );
}
