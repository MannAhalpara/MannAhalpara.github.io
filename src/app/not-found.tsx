import type { Metadata } from "next";
import { NotFoundGlitch } from "@/components/NotFoundGlitch";
import { TransitionLink } from "@/components/TransitionLink";

export const metadata: Metadata = { title: "Memory not found" };

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[100svh] flex-col justify-center pt-28 pb-16">
      <p className="mono text-muted mb-6">ERR_404 / retrieval returned 0 passages</p>
      <NotFoundGlitch />
      <h1 className="display mt-8 text-[clamp(52px,10vw,180px)]">Memory not found</h1>
      <p className="serif text-muted mt-4 max-w-[30ch] text-[clamp(24px,2.6vw,38px)] leading-tight">
        This page was never written — or it was selectively forgotten.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <TransitionLink href="/" className="pill pill-ink">
          Back to index <span aria-hidden="true">→</span>
        </TransitionLink>
        <TransitionLink href="/#work" className="pill pill-outline">
          Work
        </TransitionLink>
      </div>
    </section>
  );
}
