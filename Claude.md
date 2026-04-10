# Bayyina Teacher Panel — Build Log

## Project Overview
Teacher CRM panel for "Bayyina" education center.  
Stack: React 19, TypeScript, Tailwind CSS, React Router v7, TanStack Query v5, Lucide React.  
Architecture: Feature-Sliced Design (FSD).

---

---

## Sprint 2 — Attendance Table Redesign

### Summary
Complete redesign of the Attendance feature: replaced the simple toggle list with a **20-day grid table** where rows = students, columns = dates, and only today's column is interactive.

### New files

| File | Purpose |
|------|---------|
| `src/shared/lib/dates.ts` | `getLocalDateString`, `getLastNDays`, `parseColumnHeader`, `formatFullDate` — timezone-safe date utilities |
| `src/shared/lib/toast.tsx` | `ToastProvider`, `useToast` hook, `ToastContainer` — context-based toast system (success/error/info), auto-dismiss 3.5s |
| `src/shared/ui/Checkbox/index.tsx` | Generic styled checkbox component (brown theme) |
| `src/features/attendance/attendance-table/model/useAttendanceTable.ts` | Manages 20-day history query, today's local state, bulk mark, submit mutation, present/absent counts |
| `src/features/attendance/attendance-table/ui/AttendanceCell.tsx` | Single cell: green Check (present) or red X (absent); disabled + opacity-50 for past days; interactive for today |
| `src/features/attendance/attendance-table/ui/AttendanceTable.tsx` | Full grid table — sticky name column, scrollable date columns, today column highlighted amber, skeleton loader, legend, submit button |

### Updated files

| File | Change |
|------|--------|
| `tailwind.config.js` | Added `slideInRight` + `fadeIn` keyframe animations for toast |
| `src/shared/api/mock-data.ts` | Added `deterministicHash` + `getMockAttendanceStatus` (85% present rate, reproducible) + `getMockAttendanceHistory` (generates 20-day mock, reads MOCK_ATTENDANCE for today) |
| `src/entities/attendance/model/types.ts` | Added `AttendanceHistory` interface |
| `src/entities/attendance/model/api.ts` | Added `fetchGroupAttendanceHistory`; replaced `submitAttendance` to upsert (overwrite same group+date) |
| `src/app/providers/index.tsx` | Wrapped app with `ToastProvider` |
| `src/pages/attendance/ui/AttendancePage.tsx` | Full rewrite: group selector → attendance table; URL param `?groupId=xxx` for deep-linking from GroupDetails |
| `src/pages/group-details/ui/GroupDetailsPage.tsx` | "Davomat olish" replaced with "Davomatga o'tish" button → navigates to `/attendance?groupId=id`; removed inline form |

### Attendance Table — key design decisions

- **Only TODAY column editable**: `disabled={date !== today}` on every `AttendanceCell`; past cells have `opacity-50 cursor-not-allowed`
- **Today column highlight**: amber background (`bg-amber-100` header, `bg-amber-50/40` cells) with "BUGUN" label
- **Sticky first column**: `position: sticky; left: 0; z-index: 10` with matching row background (avoids see-through on scroll)
- **Sticky header row**: `position: sticky; top: 0; z-index: 20`; corner cell `z-index: 30`
- **Horizontal scroll**: `overflow-x-auto` wrapper; table uses `width: max-content; min-width: 100%`
- **Deterministic mock history**: `djb2` hash of `studentId|date` → no random re-renders; ~85% present rate
- **Today initialization**: history query seeds today's state via `useEffect` + `initializedRef` (avoids double-init race)
- **Upsert on submit**: re-submitting today overwrites previous record in `MOCK_ATTENDANCE`
- **Toast**: success/error feedback after submit via `useToast().success()` / `.error()`
- **URL-based group selection**: `?groupId=xxx` param allows navigation from GroupDetails directly into the attendance table for that group

### Build
```
✓ tsc --noEmit  →  0 errors
✓ vite build    →  360 kB JS (112 kB gzip), 24 kB CSS, 1.86s
```

---

## Sprint 1 — Initial Build

## Actions Performed

### 1. Package Installation
Installed runtime dependencies:
```
npm install react-router-dom @tanstack/react-query lucide-react
```

### 2. Configuration Updates
- **tailwind.config.js** — Added custom `brown` color palette (50–900), `cream` background, `font-sans` (Inter), and `shadow-soft/card/card-hover` utilities. Set `content` glob to include all `src/**/*.{js,ts,jsx,tsx}`.
- **vite.config.ts** — Added path alias `@` → `./src` via `resolve.alias`.
- **tsconfig.app.json** — Added `baseUrl: "."` and `paths: { "@/*": ["./src/*"] }` to match Vite alias.
- **index.html** — Added Google Fonts `Inter` (300/400/500/600/700), changed `lang` to `uz`, updated title to "Bayyina — Teacher Panel".
- **src/index.css** — Replaced boilerplate with `@tailwind` directives, base resets (antialiasing, box-sizing, `cream` background), and a custom `.scrollbar-thin` utility.
- **src/main.tsx** — Cleaned import (removed `.tsx` extension from App import).
- **src/App.tsx** — Replaced boilerplate with `<Providers>` + `<RouterProvider>`.

### 3. FSD Directory Structure Created
```
src/
├── app/
│   ├── providers/
│   │   ├── AuthProvider.tsx     ← React context for auth state + localStorage
│   │   └── index.tsx            ← Combines QueryClientProvider + AuthProvider
│   └── router/
│       └── index.tsx            ← createBrowserRouter with all 5 routes
│
├── pages/
│   ├── login/ui/LoginPage.tsx          ← Centered luxury login card
│   ├── groups/ui/GroupsPage.tsx        ← Grid of group cards
│   ├── group-details/ui/GroupDetailsPage.tsx  ← Students table + attendance inline
│   └── attendance/ui/AttendancePage.tsx       ← Group picker → attendance form
│
├── widgets/
│   ├── sidebar/ui/Sidebar.tsx          ← Desktop + mobile drawer sidebar
│   ├── header/ui/Header.tsx            ← Page header with back button + action slot
│   └── dashboard-layout/ui/DashboardLayout.tsx  ← Auth guard + sidebar + scrollable main
│
├── features/
│   ├── auth/login/
│   │   ├── model/useLogin.ts    ← Form state, validation, mock auth flow
│   │   └── ui/LoginForm.tsx     ← Email + password inputs with show/hide
│   └── attendance/take-attendance/
│       ├── model/useAttendance.ts  ← Per-student toggle, markAll, useMutation
│       └── ui/AttendanceForm.tsx   ← Interactive attendance list + summary
│
├── entities/
│   ├── user/model/
│   │   ├── types.ts             ← User, AuthState interfaces
│   │   └── auth-store.ts        ← localStorage get/set/clear helpers
│   ├── group/model/
│   │   ├── types.ts             ← Group, Student, GroupSchedule interfaces
│   │   └── api.ts               ← fetchGroups, fetchGroupById (mock)
│   ├── student/model/types.ts   ← Re-exports Student from group
│   └── attendance/model/
│       ├── types.ts             ← AttendanceRecord, AttendanceEntry, AttendanceStatus
│       └── api.ts               ← fetchAttendanceByGroup, submitAttendance (mock)
│
└── shared/
    ├── api/mock-data.ts         ← 3 groups, 28 students, MOCK_TEACHER, simulateDelay
    ├── config/routes.ts         ← ROUTES const + groupDetailsPath helper
    ├── lib/cn.ts                ← Lightweight classnames utility
    └── ui/
        ├── Button/index.tsx     ← 4 variants × 3 sizes, loading state
        ├── Input/index.tsx      ← Label, error, hint, leftIcon, rightIcon
        ├── Card/index.tsx       ← Card + CardHeader components
        ├── Badge/index.tsx      ← 5 color variants
        ├── Skeleton/index.tsx   ← Skeleton, CardSkeleton, TableRowSkeleton
        ├── Spinner/index.tsx    ← Spinner + PageSpinner
        └── EmptyState/index.tsx ← Icon + title + description + action
```

### 4. Mock Data (src/shared/api/mock-data.ts)
- **MOCK_TEACHER**: Aziz Karimov / aziz@bayyina.uz
- **MOCK_GROUPS**: 3 groups with 28 students total
  - "Boshlang'ich guruh A" — 12 students, Mon/Wed/Fri 09:00–10:30
  - "O'rta guruh B" — 9 students, Tue/Thu 11:00–12:30
  - "Ilg'or guruh C" — 7 students, all weekdays 14:00–15:00
- **simulateDelay()**: wraps any value in a 600ms (configurable) Promise to simulate API latency

### 5. Authentication Flow
- `AuthProvider` reads `bayyina_auth` from `localStorage` on mount (session persistence).
- `useLogin` hook: validates email/password, simulates 900ms API call, accepts `aziz@bayyina.uz` or `aziz` as username with any password ≥ 3 chars.
- `DashboardLayout` guards all dashboard routes — redirects to `/login` if not authenticated.
- Logout clears localStorage and redirects to `/login`.

### 6. Pages & Features

#### Login Page (`/login`)
- Luxury centered card on `cream` background with decorative blurred circles.
- Shows "Demo:" credentials hint.
- Redirects to `/groups` if already authenticated.

#### Groups Page (`/groups`)
- Responsive 1–3 column grid of group cards.
- Loading: 3 `CardSkeleton` placeholders.
- Empty/error states handled.
- Click → navigate to `/groups/:id`.

#### Group Details Page (`/groups/:id`)
- Back button to `/groups`.
- 3 info stat cards (student count, days, time).
- Students table with avatar initials, phone (hidden on mobile).
- "Davomat olish" button opens `AttendanceForm` inline within the same page.

#### Attendance Page (`/attendance`)
- Two-step flow: select group → fill attendance.
- "Guruhni o'zgartirish" link to go back to group picker.
- Date displayed in Uzbek locale.

#### Attendance Form (Feature)
- Toggle per student between "Keldi" / "Kelmadi".
- "Barchasi keldi" / "Barchasi kelmadi" bulk actions.
- Live counter: `X keldi · Y kelmadi`.
- Success screen with `CheckCircle` after mutation completes.

### 7. Design System
- **Palette**: Brown 50–900 scale + `cream` (#faf7f5) background.
- **Typography**: Inter (Google Fonts), antialiased.
- **Shadows**: `shadow-soft` (subtle), `shadow-card` (medium), `shadow-card-hover` (hover lift).
- **Radius**: `rounded-xl` (inputs/badges), `rounded-2xl` (cards), `rounded-3xl` (login card).
- **Sidebar**: 256px fixed on desktop; slide-in drawer with backdrop blur on mobile.

### 8. Build Verification
```
✓ npx tsc --noEmit    → 0 errors
✓ npx vite build      → 351 kB JS (109 kB gzip), 19 kB CSS, built in ~1.7s
```

---

## How to Run
```bash
npm run dev      # Development server (http://localhost:5173)
npm run build    # Production build → dist/
npm run preview  # Preview production build
```

Demo credentials:
- Email: `aziz@bayyina.uz` (or just `aziz`)
- Password: any 3+ characters
