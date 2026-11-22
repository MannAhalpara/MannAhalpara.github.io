import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { TickB } from "@/components/SectionHeader";
import { TransitionLink } from "@/components/TransitionLink";
import { SystemDiagram } from "@/components/work/SystemDiagram";
import { projects } from "@/content/content";
import { RevealText } from "@/motion/RevealText";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: p.name,
    description: `${p.tagline} ${p.problem}`,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title: p.title, description: p.tagline },
  };
}

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="pill pill-outline"
      data-cursor="OPEN ↗"
    >
      {children} <span aria-hidden="true">↗</span>
    </a>
  );
}

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const index = projects.findIndex((x) => x.slug === slug);
  const p = projects[index];
  if (!p) notFound();
  const isLast = index === projects.length - 1;
  const next = isLast ? null : projects[index + 1]!;
  // back to this project's card in the Work grid on the home page
  const backHref = `/#project-${p.slug}`;

  const meta: [string, string | null][] = [
    ["Year", p.year],
    ["Role", p.role],
    ["Category", p.category.join(" · ")],
  ];

  return (
    <article className="pt-28 md:pt-36">
      {/* hero */}
      <header className="container-x">
        <nav aria-label="Breadcrumb" className="mb-10">
          <TransitionLink
            href={backHref}
            aria-label="Back to Work"
            className="mono text-muted hover:text-ink inline-flex items-center gap-2 transition-colors"
          >
            <span className="link-u">Work</span>
            <span aria-hidden="true">/</span>
            <span className="dot text-ink">MEM_05.{String(index + 1).padStart(2, "0")}</span>
          </TransitionLink>
        </nav>
        <RevealText
          as="h1"
          type="lines"
          className="display max-w-[16ch] text-[clamp(56px,10.5vw,190px)]"
        >
          {p.name}
        </RevealText>
        <p className="mt-6 max-w-[60ch] text-[19px] md:text-[22px]">{p.title}</p>
        <p className="serif text-muted mt-4 max-w-[30ch] text-[clamp(26px,2.8vw,40px)] leading-tight">
          {p.tagline}
        </p>

        <div className="border-line-strong mt-10 grid grid-cols-12 gap-x-4 gap-y-8 border-t pt-6">
          <dl className="mono col-span-12 grid grid-cols-[auto_1fr] gap-x-8 gap-y-2 md:col-span-5">
            {meta
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-muted">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
          </dl>
          <div className="col-span-12 md:col-span-7">
            {p.stack.length > 0 && (
              <ul className="flex flex-wrap gap-1.5" aria-label="Stack">
                {p.stack.map((s) => (
                  <li key={s} className="tag tracking-normal normal-case">
                    {s}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              {p.links.github && <ExtLink href={p.links.github}>GitHub</ExtLink>}
              {p.links.live && <ExtLink href={p.links.live}>Live demo</ExtLink>}
              {p.links.paper && <ExtLink href={p.links.paper}>Paper</ExtLink>}
              {p.links.kaggle && <ExtLink href={p.links.kaggle}>Kaggle</ExtLink>}
            </div>
          </div>
        </div>
      </header>

      {/* preview */}
      <div className="container-x mt-14">
        <div className="ticked bg-surface relative aspect-[16/9] overflow-hidden md:aspect-[21/9]">
          <TickB />
          <ViewTransition name={`preview-${p.slug}`} share="morph" default="none">
            <Image
              src={`/work/${p.slug}/preview.png`}
              alt=""
              fill
              priority
              sizes="100vw"
              className="dither object-cover"
            />
          </ViewTransition>
          <p className="mono bg-paper/85 text-muted absolute bottom-3 left-3 px-2 py-1">
            Abstract preview - not a screenshot
          </p>
        </div>
      </div>

      {/* body */}
      <div className="container-x mt-24 space-y-24 md:mt-32 md:space-y-32">
        <section aria-labelledby="problem" className="grid grid-cols-12 gap-x-4 gap-y-6">
          <h2 id="problem" className="mono text-muted col-span-12 md:col-span-3">
            01 / Problem
          </h2>
          <RevealText
            as="p"
            className="serif col-span-12 text-[clamp(30px,3.6vw,56px)] leading-[1.08] md:col-span-9"
          >
            {p.problem}
          </RevealText>
        </section>

        <section aria-labelledby="approach" className="grid grid-cols-12 gap-x-4 gap-y-6">
          <h2 id="approach" className="mono text-muted col-span-12 md:col-span-3">
            02 / Approach
          </h2>
          <ol className="divide-line-strong border-line-strong col-span-12 divide-y border-y md:col-span-9">
            {p.approach.map((a, i) => (
              <li key={i} className="grid grid-cols-[3rem_1fr] py-5 text-[18px] leading-relaxed">
                <span className="dot text-muted">{String(i + 1).padStart(2, "0")}</span>
                {a}
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="architecture" className="grid grid-cols-12 gap-x-4 gap-y-6">
          <h2 id="architecture" className="mono text-muted col-span-12 md:col-span-3">
            03 / Architecture
          </h2>
          <div className="col-span-12 md:col-span-9">
            <SystemDiagram id={p.slug} name={p.name} diagram={p.architecture} figure={1} />
          </div>
        </section>

        <section aria-labelledby="details" className="grid grid-cols-12 gap-x-4 gap-y-6">
          <h2 id="details" className="mono text-muted col-span-12 md:col-span-3">
            04 / Key details
          </h2>
          <ul className="col-span-12 space-y-3 md:col-span-9">
            {p.details.map((d, i) => (
              <li key={i} className="grid grid-cols-[1.6rem_1fr] text-[18px] leading-relaxed">
                <span aria-hidden="true" className="text-muted">
                  -
                </span>
                {d}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="results" className="grid grid-cols-12 gap-x-4 gap-y-6">
          <h2 id="results" className="mono text-muted col-span-12 md:col-span-3">
            05 / Results &amp; signals
          </h2>
          <dl className="col-span-12 grid grid-cols-2 gap-4 md:col-span-9 lg:grid-cols-4">
            {p.metrics.map((m) => (
              <div
                key={m.label}
                className="ticked bg-surface/60 flex min-h-[150px] flex-col justify-between p-4"
              >
                <TickB />
                <dd className="dot order-1 text-[clamp(28px,3.2vw,48px)] leading-none break-words">
                  {m.value}
                </dd>
                <dt className="mono text-muted order-2 mt-4">{m.label}</dt>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="links" className="grid grid-cols-12 gap-x-4 gap-y-6">
          <h2 id="links" className="mono text-muted col-span-12 md:col-span-3">
            06 / Links
          </h2>
          <div className="col-span-12 flex flex-wrap gap-3 md:col-span-9">
            {p.links.github && <ExtLink href={p.links.github}>Source on GitHub</ExtLink>}
            {p.links.live && <ExtLink href={p.links.live}>Live demo</ExtLink>}
            {p.links.paper && <ExtLink href={p.links.paper}>Read the paper</ExtLink>}
            {p.links.kaggle && <ExtLink href={p.links.kaggle}>Dataset on Kaggle</ExtLink>}
            {!p.links.github && !p.links.live && !p.links.paper && !p.links.kaggle && (
              <p className="text-muted">Repository link coming soon.</p>
            )}
          </div>
        </section>
      </div>

      {/* next project, or back to Work after the last one */}
      {next ? (
        <TransitionLink
          href={`/work/${next.slug}`}
          data-cursor="NEXT"
          className="group border-line-strong hover:bg-ink hover:text-paper mt-32 block border-y transition-colors duration-500"
        >
          <div className="container-x flex flex-col gap-4 py-12 md:flex-row md:items-end md:justify-between md:py-20">
            <div>
              <p className="mono text-muted group-hover:text-paper/60 mb-4">Next entry →</p>
              <p className="display text-[clamp(56px,10vw,170px)]">{next.name}</p>
            </div>
            <p className="text-muted group-hover:text-paper/70 max-w-[36ch] text-[17px]">
              {next.tagline}
            </p>
          </div>
        </TransitionLink>
      ) : (
        <TransitionLink
          href={backHref}
          data-cursor="BACK"
          className="group border-line-strong hover:bg-ink hover:text-paper mt-32 block border-y transition-colors duration-500"
        >
          <div className="container-x flex flex-col gap-4 py-12 md:flex-row md:items-end md:justify-between md:py-20">
            <div>
              <p className="mono text-muted group-hover:text-paper/60 mb-4">
                That&apos;s every entry · back to the index
              </p>
              <p className="display text-[clamp(56px,10vw,170px)]">
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-500 group-hover:-translate-x-3"
                >
                  ←
                </span>{" "}
                Back to work
              </p>
            </div>
            <p className="text-muted group-hover:text-paper/70 max-w-[36ch] text-[17px]">
              Return to the home page, right where you left the project grid.
            </p>
          </div>
        </TransitionLink>
      )}
    </article>
  );
}
