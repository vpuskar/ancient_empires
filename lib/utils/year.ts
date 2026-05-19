export function formatYear(year: number): string {
  return year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
}

export function formatYearRange(
  start: number | null,
  end: number | null
): string {
  if (start === null) {
    if (end === null) return '';
    return `until ${formatYear(end)}`;
  }
  if (end === null) return `${formatYear(start)} – present`;
  return `${formatYear(start)} – ${formatYear(end)}`;
}
