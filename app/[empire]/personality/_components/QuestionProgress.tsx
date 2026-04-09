interface QuestionProgressProps {
  current: number;
  total: number;
  dimension: string;
  empireColor: string;
}

export function QuestionProgress({
  current,
  total,
  dimension,
  empireColor,
}: QuestionProgressProps) {
  const progress = total > 0 ? ((current + 1) / total) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4">
        <div className="font-display text-[10px] uppercase tracking-[0.3em] text-[#9A8B70]">
          Question {current + 1} of {total}
        </div>
        <div className="font-body text-[12px] italic text-[#6B5B47]">
          {dimension}
        </div>
      </div>

      <div className="mt-3 h-[2px] w-full overflow-hidden rounded-full bg-[rgba(184,134,11,0.1)]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${empireColor}, #B8860B)`,
            transition: 'width 0.5s ease',
          }}
        />
      </div>
    </div>
  );
}
