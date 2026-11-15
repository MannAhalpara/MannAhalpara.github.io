import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Achievements } from "@/components/sections/Achievements";
import { AskMemory } from "@/components/sections/AskMemory";
import { Experience } from "@/components/sections/Experience";
import { Publication } from "@/components/sections/Publication";
import { Research } from "@/components/sections/Research";
import { Stack } from "@/components/sections/Stack";
import { Work } from "@/components/sections/Work";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Research />
      <Publication />
      <Work />
      <Experience />
      <Stack />
      <AskMemory />
      <Achievements />
    </>
  );
}
