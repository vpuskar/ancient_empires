'use client';

interface ReportErrorProps {
  empire: string;
  page: string;
  context?: Record<string, unknown>;
}

export function ReportError({ empire, page, context }: ReportErrorProps) {
  function handleReport() {
    const issueTitle = encodeURIComponent(`Data error: ${empire} - ${page}`);

    const issueBody = encodeURIComponent(
      `**Page:** ${window.location.href}
**Empire:** ${empire}
**Section:** ${page}
**Context:** ${context ? JSON.stringify(context, null, 2) : 'N/A'}

**Browser:** ${navigator.userAgent}
**Screen:** ${window.screen.width}x${window.screen.height}

---

**What's wrong?**
[Please describe the error - e.g., "Augustus death year should be 14 AD, not 19 AD"]

**Source (if known):**
[Optional: link to Wikipedia, academic source, etc.]`
    );

    const slug = empire.toLowerCase().split(' ')[0];
    const url = `https://github.com/vpuskar/ancient-empires/issues/new?title=${issueTitle}&body=${issueBody}&labels=data-error,${slug}`;

    window.open(url, '_blank');
  }

  return (
    <button
      onClick={handleReport}
      className="flex items-center gap-1 text-xs text-[#8B7355] transition-colors duration-200 hover:text-[#C9A84C]"
      title="Report a data error"
    >
      <svg
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      Report error
    </button>
  );
}
