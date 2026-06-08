---
name: PaisaWeb App Architecture
description: Key architectural decisions for the PaisaWeb personal finance tracker Expo app
---

# PaisaWeb Architecture

## State Management
- `context/AppContext.tsx` is the single source of truth for all app state
- AppProvider wraps the entire app in `app/_layout.tsx`
- AsyncStorage (v2.2.0) persists all state; loads on mount (isLoaded flag prevents flash)
- Seed data is used as initial state and overridden by AsyncStorage on mount

## Color Theming
- `constants/colors.ts` exports both `dark` and `light` palettes + `radius`
- `hooks/useAppColors.ts` reads `isDarkMode` from AppContext (NOT system useColorScheme)
- `hooks/useColors.ts` still uses system useColorScheme — used by ErrorFallback/+not-found only
- Dark mode is default (isDarkMode: true in initial state)

## Navigation
- 5 tabs: Dashboard (index), Accounts, Budget, Wealth, MonthEnd
- "AllCommitmentsView" and "AllTransactionsView" are rendered as full-screen RN `<Modal>` components inside `app/(tabs)/index.tsx` (Dashboard)
- They are triggered by `app.setActiveTab("all_commitments")` / `app.setActiveTab("all_transactions")`

## Modals
- All 7 CRUD modals (Tx, Account, Budget, Commitment, Goal, Investment, Task) are in `components/GlobalModals.tsx`
- GlobalModals is rendered from `app/(tabs)/_layout.tsx` (outside the Tabs component, after it)
- Modal state (open/close, form, editing item) all lives in AppContext

## Charts
- `components/Charts.tsx` uses `react-native-svg` (pre-installed) for SVG line + donut charts
- No external chart library needed

## Custom Picker
- `components/SelectPicker.tsx` — Modal + FlatList approach (more consistent than @react-native-picker/picker)
- Supports grouped options via `group` field on SelectOption

## Core Accounting Engine
- `applyTransactionToAccounts(tx, revert?)` — mutates account balances
- `applyTransactionToInvestments(tx, revert?)` — mutates investment totals for TRANSFER type
- Both called on add, update (revert old first), and delete operations
- `markCommitmentPaid` auto-generates a Transaction (EXPENSE or TRANSFER) and marks commitment isPaid=true
