import type { Metadata } from "next";
import { PixelSpider } from "@/components/PixelSpider";
import { SpiderWeb } from "@/components/SpiderWeb";
import { TransitionLink } from "@/components/TransitionLink";

// Layout template appends " - Mann Ahalpara".
export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[100svh] flex-col items-center justify-center gap-10 pt-28 pb-16 md:flex-row md:gap-16">
      <div className="relative aspect-square w-full max-w-[360px] shrink-0 md:max-w-[460px] lg:max-w-[540px]">
        <SpiderWeb className="absolute inset-0 h-full w-full" />
        {/* Spider keeps a fixed size; only the web scales. */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[128px] md:w-[168px] [&>svg]:h-auto [&>svg]:w-full">
            <PixelSpider size={168} />
          </div>
        </div>
      </div>

      <div className="text-center md:text-left">
        <p className="display text-[clamp(96px,14vw,160px)]">404</p>
        <h1 className="serif mt-4 max-w-[22ch] text-[clamp(26px,3vw,40px)] leading-tight">
          This page got caught in the web.
        </h1>
        <p className="text-muted mt-3">It may have moved, or never existed.</p>
        <div className="mt-8">
          <TransitionLink href="/" className="pill pill-accent">
            <span aria-hidden="true">←</span> Back to the index
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
