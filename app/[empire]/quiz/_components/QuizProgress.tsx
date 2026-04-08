interface QuizProgressProps {
  current: number;
  total: number;
  difficultyName: string;
  difficultyIcon: string;
  empireColor: string;
}

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized;

  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function QuizProgress({
  current,
  total,
  difficultyName,
  difficultyIcon,
  empireColor,
}: QuizProgressProps) {
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <div
      className="rounded-[18px] border px-5 py-4"
      style={{
        borderColor: hexToRgba(empireColor, 0.16),
        backgroundColor: 'rgba(26,18,16,0.58)',
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-display text-[10px] uppercase tracking-[0.3em] text-[#9A8B70]">
            {'Question '} {current} {' of '} {total}
          </div>
          <div className="mt-2 font-display text-lg text-[#F5E6C8]">
            {difficultyIcon ? `${difficultyIcon} ` : ''}
            {difficultyName}
          </div>
        </div>
        <div className="text-sm text-[#9A8B70]">Answer with 1-4 or A-D</div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[rgba(245,230,200,0.08)]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${empireColor}, #D4AF37)`,
            transition: 'width 0.35s ease',
          }}
        />
      </div>
    </div>
  );
}
