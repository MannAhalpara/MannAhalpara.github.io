"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { identity, navLinks } from "@/content/content";
import { getLenis, scrollToTarget } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/motion/Magnetic";
import { Clock } from "./Clock";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [activeId, setActive] = useState<string | null>(null);
  const active = isHome ? activeId : null;
  const [open, setOpen] = useState(false);
  const overlay = useRef<HTMLDivElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);

  // Bracket the section currently in view (a band across the middle of the viewport).
  useEffect(() => {
    if (!isHome) return;
    const els = navLinks
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
          else setActive((a) => (a === e.target.id ? null : a));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [isHome]);

  // Mobile overlay: lock scroll, Escape closes, animate links in.
  useEffect(() => {
    if (!open) return;
    getLenis()?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtn.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    overlay.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      getLenis()?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);
    if (!isHome) return; // let Next navigate to "/#id"
    e.preventDefault();
    window.setTimeout(() => scrollToTarget(id), open ? 50 : 0);
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <>
      <header className="site-header fixed inset-x-0 top-0 z-[100] px-3 pt-3 md:px-[var(--gutter)] md:pt-4">
        <nav
          aria-label="Primary"
          className={cn(
            "mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-4 rounded-full border pr-2 pl-5 backdrop-blur-md transition-colors duration-500",
            open
              ? "border-paper/20 bg-ink/70 text-paper"
              : "border-line-strong bg-paper/80",
          )}
        >
          <Link
            href="/"
            aria-label="Mann Ahalpara — home"
            className="dot text-[22px] leading-none tracking-tight"
            onClick={(e) => {
              if (isHome) {
                e.preventDefault();
                scrollToTarget(0);
              }
            }}
          >
            M/A
          </Link>

          <ul className="mono hidden items-center gap-1 lg:flex">
            {navLinks.map(({ id, label }) => {
              const on = active === id;
              return (
                <li key={id}>
                  <Link
                    href={`/#${id}`}
                    onClick={go(id)}
                    aria-current={on ? "location" : undefined}
                    className={cn(
                      "group relative inline-flex items-center px-2 py-2 transition-colors duration-300",
                      on ? "text-ink" : "text-muted hover:text-ink",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "transition-all duration-300 ease-(--ease-expo)",
                        on
                          ? "text-accent-text opacity-100"
                          : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                      )}
                    >
                      [
                    </span>
                    {label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "transition-all duration-300 ease-(--ease-expo)",
                        on
                          ? "text-accent-text opacity-100"
                          : "translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                      )}
                    >
                      ]
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <Clock className="mono text-muted hidden md:inline" />
            <ThemeToggle />
            <Magnetic className="hidden sm:inline-block">
              <a
                href={identity.resume.href}
                download={identity.resume.filename}
                className="pill pill-accent pill-sm"
                data-cursor="PDF ↓"
              >
                Résumé <span aria-hidden="true">↓</span>
              </a>
            </Magnetic>
            <button
              ref={menuBtn}
              type="button"
              className="mono border-line-strong grid h-9 place-items-center rounded-full border px-3 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div
          ref={overlay}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="bg-ink text-paper fixed inset-0 z-[99] flex flex-col justify-between px-[var(--gutter)] pt-28 pb-8 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map(({ id, label }, i) => (
              <li key={id} className="overflow-hidden">
                <Link
                  href={`/#${id}`}
                  onClick={go(id)}
                  style={{ "--i": i } as React.CSSProperties}
                  className="menu-item display flex items-baseline gap-3 py-[0.05em] text-[clamp(56px,16vw,120px)] leading-[0.95]"
                >
                  <span className="dot text-accent-text text-[14px]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <a
              href={identity.resume.href}
              download={identity.resume.filename}
              className="pill pill-accent"
            >
              Download résumé <span aria-hidden="true">↓</span>
            </a>
            <Clock className="mono text-paper/70" />
          </div>
        </div>
      )}
    </>
  );
}
