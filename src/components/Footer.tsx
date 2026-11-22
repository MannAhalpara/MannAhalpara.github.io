"use client";

import { usePathname } from "next/navigation";
import { footer, identity, sections } from "@/content/content";
import { scrollToTarget } from "@/lib/scroll";
import { Magnetic } from "@/motion/Magnetic";
import { RevealText } from "@/motion/RevealText";
import { Clock } from "./Clock";
import { CopyEmail } from "./CopyEmail";

export function Footer() {
  const pathname = usePathname();
  const mem = sections.find((s) => s.id === "contact")!;
  // project case studies end on their own links, without the contact block
  if (pathname.startsWith("/work/")) return null;
  return (
    <footer
      id="contact"
      aria-labelledby="contact-title"
      className="relative overflow-hidden pt-24 md:pt-36"
    >
      <div className="container-x">
        <p className="mono border-line-strong mb-10 flex items-center gap-3 border-t pt-4">
          <span className="dot text-[13px]">{mem.mem}</span>
          <span className="text-muted">
            / Contact — open to {identity.openTo.join(", ").toLowerCase()}
          </span>
        </p>

        <h2 id="contact-title" className="display text-[clamp(52px,11.2vw,250px)] leading-[0.9]">
          <RevealText as="span" type="chars" className="block">
            {footer.ctaLine1}
          </RevealText>
          <span className="mt-[0.06em] block">
            <span className="bg-accent text-accent-ink box-decoration-clone px-[0.06em]">
              <RevealText as="span" type="chars" delay={0.15}>
                {footer.ctaLine2}
              </RevealText>
            </span>
          </span>
        </h2>

        <div className="mt-16 grid grid-cols-12 gap-x-4 gap-y-10 md:mt-24">
          <div className="col-span-12 lg:col-span-7">
            <p className="mono text-muted mb-3">Write to</p>
            <CopyEmail className="serif link-u text-[clamp(30px,5.2vw,84px)] leading-none break-all sm:break-normal" />
            <p className="mono text-muted mt-3">Click to copy</p>
          </div>
          <div className="col-span-12 flex flex-col gap-6 lg:col-span-5 lg:items-end">
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Magnetic>
                <a
                  href={identity.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill pill-outline"
                  data-cursor="OPEN ↗"
                >
                  LinkedIn <span aria-hidden="true">↗</span>
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href={identity.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill pill-outline"
                  data-cursor="OPEN ↗"
                >
                  GitHub <span aria-hidden="true">↗</span>
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href={identity.resume.href}
                  download={identity.resume.filename}
                  className="pill pill-accent"
                  data-cursor="PDF ↓"
                >
                  Résumé <span aria-hidden="true">↓</span>
                </a>
              </Magnetic>
            </div>
            <a
              href={identity.resume.href}
              target="_blank"
              rel="noopener"
              className="mono link-u text-muted hover:text-ink"
              data-cursor="OPEN ↗"
            >
              Open résumé in a new tab ↗
            </a>
          </div>
        </div>

        <div className="mono border-line-strong mt-24 grid grid-cols-2 gap-y-4 border-t py-6 md:grid-cols-4">
          <span className="text-muted">{identity.location}</span>
          <Clock className="md:text-center" />
          <span className="text-muted col-span-2 md:col-span-1 md:text-center">
            {footer.credit}
          </span>
          <a
            href="#top"
            className="link-u col-span-2 w-fit justify-self-start md:col-span-1 md:justify-self-end"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget(0);
              document.getElementById("main")?.focus({ preventScroll: true });
            }}
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
