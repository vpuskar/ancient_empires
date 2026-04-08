interface QuizTimerProps {
  timeLeft: number;
  maxTime: number;
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

export function QuizTimer({
  timeLeft,
  maxTime,
  empireColor,
}: QuizTimerProps) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const progress = maxTime > 0 ? Math.max(timeLeft, 0) / maxTime : 0;
  const offset = circumference * (1 - progress);
  const isLow = progress <= 0.2;

  return (
    <div
      className="flex items-center gap-4 rounded-[18px] border px-4 py-3"
      style={{
        borderColor: hexToRgba(empireColor, 0.16),
        backgroundColor: 'rgba(26,18,16,0.58)',
      }}
    >
      <div className="relative h-[74px] w-[74px]">
        <svg className="h-[74px] w-[74px] -rotate-90" viewBox="0 0 74 74">
          <circle
            cx="37"
            cy="37"
            r={radius}
            fill="none"
            stroke="rgba(245,230,200,0.1)"
            strokeWidth="6"
          />
          <circle
            cx="37"
            cy="37"
            r={radius}
            fill="none"
            stroke={isLow ? empireColor : '#D4AF37'}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.2s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-display text-xl text-[#F5E6C8]">
          {timeLeft}
        </div>
      </div>
      <div>
        <div className="font-display text-[10px] uppercase tracking-[0.3em] text-[#9A8B70]">
          Time Remaining
        </div>
        <div className="mt-1 font-display text-base text-[#F5E6C8]">
          {maxTime}s per question
        </div>
      </div>
    </div>
  );
}
