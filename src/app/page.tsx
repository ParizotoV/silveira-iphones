import { CtaBand } from "@/components/home/CtaBand";
import { Differentials } from "@/components/home/Differentials";
import { Generations } from "@/components/home/Generations";
import { Showcase } from "@/components/home/Showcase";
import { HeroExperience } from "@/components/hero/HeroExperience";

export default function HomePage() {
  return (
    <>
      <HeroExperience />
      <Showcase />
      <Differentials />
      <Generations />
      <CtaBand />
    </>
  );
}
