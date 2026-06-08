---
name: PaisaWeb Color Scheme Rules
description: Rules for the colors.ts file to avoid typecheck failures with existing scaffold components
---

# PaisaWeb Color Scheme Rules

## Required Fields
Both `light` and `dark` palettes in `constants/colors.ts` MUST include:

- `foreground` — alias for `text`; required by `components/ErrorFallback.tsx` and `app/+not-found.tsx` which use `useColors()` (the system-scheme hook)
- `warning` — used in `app/(tabs)/accounts.tsx` for credit card utilization color

**Why:** The Expo scaffold's ErrorFallback and +not-found files use `useColors()` which references `colors.foreground`. If we remove `foreground` or rename it, typecheck fails.

## Hook Selection
- `useColors()` (hooks/useColors.ts) — uses system `useColorScheme()`, for scaffold/error components
- `useAppColors()` (hooks/useAppColors.ts) — reads `isDarkMode` from AppContext, for all app screens
