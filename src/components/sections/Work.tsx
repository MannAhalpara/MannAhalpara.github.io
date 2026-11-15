import { SectionHeader } from "../SectionHeader";
import { WorkGrid } from "../work/WorkGrid";

export function Work() {
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="container-x relative pt-24 pb-4 md:pt-36 md:pb-8"
    >
      <SectionHeader
        id="work"
        kicker="Selected entries / built, deployed, cited"
        title="Work"
        headingId="work-title"
      />
      <WorkGrid />
    </section>
  );
}
