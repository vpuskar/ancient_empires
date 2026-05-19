import OdysseyHero from '@/components/timeline/odyssey/OdysseyHero';
import OdysseyPanel from '@/components/timeline/odyssey/OdysseyPanel';
import type { EmpireConfig } from '@/lib/empires/config';
import type { TimelineData } from '@/lib/types/timeline';

interface OdysseyCanvasProps {
  empire: EmpireConfig;
  data: TimelineData;
}

export default function OdysseyCanvas({ empire, data }: OdysseyCanvasProps) {
  const activeChapter = data.chapters[0] ?? null;

  return (
    <main className="flex flex-col bg-zinc-950 text-white lg:h-screen lg:flex-row lg:overflow-hidden">
      <section className="h-[50vh] lg:h-full lg:w-[60%]">
        <OdysseyHero empire={empire} chapter={activeChapter} />
      </section>

      <section className="lg:h-full lg:w-[40%] lg:flex-1 lg:overflow-y-auto">
        <OdysseyPanel empire={empire} data={data} />
      </section>
    </main>
  );
}
