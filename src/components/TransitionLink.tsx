"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, type AnchorHTMLAttributes, type ReactNode } from "react";

type Props = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & { children: ReactNode };

function needsCurtain() {
  return (
    typeof document !== "undefined" &&
    !("startViewTransition" in document) &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Next <Link>. Where the View Transitions API exists, React's <ViewTransition>
 * handles the page change. Elsewhere it plays a curtain before navigating.
 */
export function TransitionLink({ href, onClick, children, ...rest }: Props) {
  const router = useRouter();
  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        if (!needsCurtain()) return;
        e.preventDefault();
        window.dispatchEvent(new Event("curtain:in"));
        window.setTimeout(() => router.push(String(href)), 560);
      }}
    >
      {children}
    </Link>
  );
}

/** Full-screen curtain used by TransitionLink on browsers without view transitions. */
export function Curtain() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const covered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onIn = () => {
      covered.current = true;
      el.classList.remove("is-out");
      void el.offsetWidth;
      el.classList.add("is-in");
    };
    window.addEventListener("curtain:in", onIn);
    return () => window.removeEventListener("curtain:in", onIn);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !covered.current) return;
    covered.current = false;
    el.classList.replace("is-in", "is-out");
    const id = window.setTimeout(() => el.classList.remove("is-out"), 900);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return (
    <div ref={ref} aria-hidden="true" className="curtain bg-ink fixed inset-0 z-[180]">
      <span className="mono text-paper/70 absolute bottom-[var(--gutter)] left-[var(--gutter)]">
        retrieving…
      </span>
    </div>
  );
}
