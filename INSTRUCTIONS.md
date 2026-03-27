# Step 0: Shared Work — Setup Instructions

Run these commands in your project root (where `package.json` lives).

## 1. Install new dependencies

```bash
npm install framer-motion
npm install next/font   # already included in next — just verify
```

> Don't install leaflet/posthog yet — those go in their own branches.

## 2. Copy files into project

```bash
# Font config
cp lib/fonts.ts → your-project/lib/fonts.ts

# Empire theme
cp lib/empires/theme.ts → your-project/lib/empires/theme.ts

# Stats service
cp lib/services/stats.ts → your-project/lib/services/stats.ts

# Shared UI components (create folder first)
mkdir -p components/ui
cp components/ui/GoldDivider.tsx → your-project/components/ui/GoldDivider.tsx
cp components/ui/RevealOnScroll.tsx → your-project/components/ui/RevealOnScroll.tsx
cp components/ui/EraLabel.tsx → your-project/components/ui/EraLabel.tsx
cp components/ui/EmptyState.tsx → your-project/components/ui/EmptyState.tsx
cp components/ui/index.ts → your-project/components/ui/index.ts

# Update existing files
# ⚠️ MERGE these — don't overwrite blindly:
# - app/layout.tsx → add font imports + className
# - app/globals.css → add @theme tokens + base styles
```

## 3. Update app/layout.tsx

Add these imports at the top:

```tsx
import { fontDisplay, fontBody } from '@/lib/fonts';
```

Add font variables to `<body>`:

```tsx
<body className={`${fontDisplay.variable} ${fontBody.variable} font-body antialiased`}>
```

## 4. Update app/globals.css

Add the `@theme` block with font and color tokens (see globals.css file).

## 5. Store prototypes

```bash
mkdir -p docs/prototypes
cp ancient-empires-landing.jsx docs/prototypes/
cp rulers-encyclopaedia.jsx docs/prototypes/
cp interactive-map.html docs/prototypes/
cp storytelling-chapters.jsx docs/prototypes/
cp horizontal-timeline.jsx docs/prototypes/
```

## 6. Commit to develop

```bash
git checkout develop
git add .
git commit -m "feat: Phase 2 shared work — fonts, theme, shared UI components, stats service"
git push origin develop
```

## 7. Verify

```bash
npm run lint        # should pass
npm run type-check  # should pass
npm run build       # should pass
```

## Done! Ready for Branch 1.

Next: `git checkout -b feature/empire-selector-landing`
