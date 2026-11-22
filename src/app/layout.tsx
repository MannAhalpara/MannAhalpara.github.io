import type { Metadata, Viewport } from "next";
import { ViewTransition } from "react";
import { Cursor } from "@/components/Cursor";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { Preloader } from "@/components/Preloader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Toaster } from "@/components/Toast";
import { Curtain } from "@/components/TransitionLink";
import { ViewTransitionGuard } from "@/components/ViewTransitionGuard";
import { education, identity, positioning } from "@/content/content";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(identity.siteUrl),
  title: {
    default: `${identity.name} - AI/ML Researcher`,
    template: `%s - ${identity.name}`,
  },
  description: identity.oneLiner,
  authors: [{ name: identity.name, url: identity.github }],
  creator: identity.name,
  keywords: [
    "Mann Ahalpara",
    "AI/ML researcher",
    "conversational AI",
    "LLM memory",
    "retrieval-augmented generation",
    "information retrieval",
    "NTU Sentic",
  ],
  openGraph: {
    type: "website",
    title: `${identity.name} - AI/ML Researcher`,
    description: identity.oneLiner,
    siteName: identity.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${identity.name} - AI/ML Researcher`,
    description: identity.oneLiner,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F3EEE6" },
    { media: "(prefers-color-scheme: dark)", color: "#160E0E" },
  ],
  width: "device-width",
  initialScale: 1,
};

/**
 * Runs before paint: applies the saved theme, flags motion, and decides whether
 * the preloader shows (first visit per session, motion allowed).
 */
const bootScript = `(function(){try{var d=document.documentElement;var t=localStorage.getItem('theme');if(t==='dark'||t==='light')d.dataset.theme=t;}catch(e){}
try{var d=document.documentElement;var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;if(!rm)d.classList.add('js-motion');var seen=null;try{seen=sessionStorage.getItem('mem-loaded')}catch(e){}if(rm||seen)d.classList.add('no-preloader');setTimeout(function(){d.classList.add('hero-in')},6000);}catch(e){}})();`;

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: identity.name,
  jobTitle: "AI/ML Researcher",
  description: positioning.summary,
  email: `mailto:${identity.email}`,
  url: identity.siteUrl,
  address: { "@type": "PostalAddress", addressLocality: "Ahmedabad", addressCountry: "IN" },
  alumniOf: { "@type": "CollegeOrUniversity", name: education[0].school.split(",")[0] },
  affiliation: { "@type": "Organization", name: "Sentic Team, Nanyang Technological University" },
  knowsAbout: [
    "Large Language Models",
    "Conversational AI",
    "Information Retrieval",
    "Retrieval-Augmented Generation",
  ],
  sameAs: [identity.linkedin, identity.github],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Must stay a raw inline script: it sets theme/motion/preloader flags before
            first paint. It only renders on the server, so keep the page free of hydration
            mismatches, or React re-renders this layout on the client and warns about it. */}
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <noscript>
          <style>{`.preloader{display:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body id="top">
        <a href="#main" className="skip-link mono">
          Skip to content
        </a>
        <div className="bg-grid" aria-hidden="true">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} />
          ))}
        </div>
        <div className="grain-wrap" aria-hidden="true">
          <div className="grain" />
        </div>

        <ViewTransitionGuard />
        <SmoothScroll />
        <Nav />
        <ViewTransition default="page">
          <main id="main" tabIndex={-1} className="relative z-[1] outline-none">
            {children}
          </main>
        </ViewTransition>
        <div className="relative z-[1]">
          <Footer />
        </div>

        <Preloader />
        <Curtain />
        <Cursor />
        <Toaster />
      </body>
    </html>
  );
}
