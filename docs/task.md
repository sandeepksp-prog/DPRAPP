# Task List: "Infra-OS" (Form-Centric Construction ERP)

## Phase 1: Foundation (Complete)
- [x] Initialize Next.js 14 (App Router) project `infra-os` with Tailwind CSS and TypeScript
    - [x] Create project structure
    - [x] Install dependencies (`@supabase/supabase-js`, `react-hook-form`, `lucide-react`, `pdfplumber`, `clsx`, `tailwind-merge`)
    - [x] Configure Tailwind (v4)
- [x] Create Database Schema (`supabase/schema.sql`)
    - [x] `projects` table
    - [x] `boq_items` table
    - [x] `daily_reports` table
    - [x] `report_line_items` table with `metadata` JSONB for discipline specifics
- [x] Implement Logic Form (`DPRForm.tsx`)
    - [x] "Starry Night" Theme (Tailwind)
    - [x] Branching Logic: Pipeline vs Civil vs E&M
    - [x] Auto-updating Summary Generator
- [x] Integrate Supabase Client (`lib/supabaseClient.ts`)

## Phase 2: Admin Dashboard & Analytics (Complete)
- [x] Create Admin Layout (`src/app/admin/layout.tsx`)
    - [x] Sidebar Navigation
    - [x] Top Bar & Responsive Design
- [x] Implement BOQ Tracker (`src/components/admin/BOQTracker.tsx`)
    - [x] Data Grid with Progress Bars
    - [x] Calculate Actual vs Estimate
    - [x] Visual Overrun Alerts
- [x] Build Main Dashboard (`src/app/admin/page.tsx`)
    - [x] KPI Cards (Active Sites, Pipe Laid, Est. Billing)
    - [x] Recent Activity Feed from Daily Reports
- [x] **Populate BOQ Data**
    - [x] Attempted to run `scripts_extract_boq.PY` (Failed: No data found)
    - [x] Build "Bulk Upload" Tool (`src/components/admin/BOQUploader.tsx`)
    - [ ] Action: User to upload CSV via `/admin/settings/import`
- [ ] Connect Real Authentication (Supabase Auth)

## Phase 3: Architecture Pivot (Logic & Analytics) (Complete)
- [x] **Advanced Database Schema** (`supabase/schema.sql`)
    - [x] `projects`: financial_limit, start_date
    - [x] `boq_items`: category (Pipeline, Civil, E&M)
    - [x] `report_entries`: quantity, stage_percentage, meta_data
- [x] **Intelligent Form Engine** (`src/components/forms/LogicForm.tsx`)
    - [x] Dynamic fields based on BOQ Category
    - [x] Auto-summarizer logic
- [x] **Admin Insights Engine** (`src/lib/analytics.ts`)
    - [x] `calculateBillable`
    - [x] `getInventoryStatus`
    - [x] Update Admin Dashboard visuals

## Phase 4: Deployment & Mock Mode (Complete)
- [x] **Mock Data Engine** (`src/lib/mock-db.ts`)
    - [x] Implement `getProjects`, `getBOQItems`, `getDailyReports`, `getAnalytics`
    - [x] Populate with realistic "Babarpur" data
- [x] **Data Provider Layer** (`src/lib/data-provider.ts`)
    - [x] Switch between Supabase and Mock based on `NEXT_PUBLIC_USE_MOCK_DATA`
    - [x] Refactor Admin Dashboard and BOQ Tracker to use Provider
- [x] **Deployment**
    - [x] Create `README_DEPLOY.md`
    - [x] Configure Env Vars (`NEXT_PUBLIC_USE_MOCK_DATA`)
    - [x] Deploy to Vercel (Production)

## Phase 5: Mobile App & Field Use
- [x] Optimize DPR Form for Mobile (`src/components/forms/DPRForm.tsx`)
    - [x] Touch targets (min 44px)
    - [x] Numeric keypads (`type="tel"`)
    - [x] Safe area padding
- [ ] Implement Offline Support (PWA) (Deferred)

## Phase 5: Vision-to-Vector Execution (Complete)
- [x] **Data Extraction Script** (`scripts/vision_scan.js`)
    - [x] Install `@google/generative-ai`
    - [x] Implement image scanning logic
    - [x] Save to `public/maps/vision_data.json`
- [x] **Vector Map Layer** (`src/components/map/VisionPipeLayer.tsx`)
    - [x] Install `react-leaflet`
    - [x] Implement Line Casing style (Main/Dist)

## Phase 6: Deep Professional Rebuild (In Progress)
- [x] **Theme Overhaul** (`src/app/globals.css`)
    - [x] Remove "Starry Night" gradients
    - [x] Implement Slate/Deep-Blue theme
- [x] **Advanced Logic Form** (`src/components/forms/LogicForm.tsx`)
    - [x] Branching Logic (Pipeline/Civil)
    - [x] Auto-Summarizer
- [x] **Dashboard Widgets** (`src/components/admin/DashboardWidgets.tsx`)
    - [x] Financial Card (Fund Utilization)
    - [x] Material Card (Pipe Consumption)

## Phase 6.5: Vision Refinement (In Progress)
- [x] **Script Regeneration** (`scripts/vision_scan.js`)
    - [x] Implement specific Gemini prompt (JSON only)
    - [x] Handle missing image gracefully
- [x] **Vector Layer Update** (`src/components/map/VisionPipeLayer.tsx`)
    - [x] Implement requested "Casing" style (Border/Fill)
    - [ ] Verify `vision_data.json` loading

## Phase 7: GitHub Sync (Complete)
- [x] **Configure Remote** (`https://github.com/sandeepksp-prog/DPRAPP.git`)
- [x] **Push Code** (`main` branch)
- [x] **Add Environment Keys** (Groq, HF added to .env.local)

## Phase 8: Final Interface Execution (Complete)
- [x] **User Side (Field App)**
    - [x] Create Field Dashboard (`src/app/page.tsx`)
    - [x] Move Form to `/report/new`
- [x] **Admin Side (Management)**
    - [x] Projects Page (`src/app/admin/projects/page.tsx`)
    - [x] Inventory Page (`src/app/admin/inventory/page.tsx`)
    - [x] Reports Page (`src/app/admin/reports/page.tsx`)

## Phase 9: High-Class Design Polish (Complete)
- [x] **Design System Upgrade** (`src/app/globals.css`)
    - [x] Soften borders (`border-slate-100`) & Shadows (`shadow-sm`)
    - [x] Refine Typography (Inter/Geist)
- [x] **Component Refinement**
    - [x] **Sidebar**: "Framer Realty" inspired layout (`src/app/admin/layout.tsx`)
    - [x] **Stats**: "Delisas" style KPI cards with sparklines
- [x] **Tables**: "Elixir" style clean rows with status pills

## Phase 10: Pastel Design & Animation (Complete)
- [x] **Theme Update** (`src/app/globals.css`)
    - [x] Remove "Deep Purple" heaviness
    - [x] Implement Pastel Palette (Soft Blue, Mint, Peach)
    - [x] Adjust borders/shadows for "High Class" feel
- [x] **Map Animation** (`src/components/map/VisionPipeLayer.tsx`)
    - [x] Add "Pulse" animation to network nodes
    - [x] Implement "Area Covered" radar effect

## Phase 11: Advanced Admin Analytics (Complete)
- [x] **Billing & JMR Reporting** (`src/components/admin/BillingStats.tsx`)
    - [x] JMR Submitted vs Approved
    - [x] Revenue Graphs
- [x] **Labour Management** (`src/components/admin/LabourStats.tsx`)
    - [x] Daily Labour Report (Gang-wise)
    - [x] Fitter Progress Tracking
- [x] **Work Completion** (`src/components/admin/WorkProgress.tsx`)
    - [x] Overall component progress
    - [x] Expenditure Charts

## Phase 12: Sky Progress Theme & Depth UI (Complete)
- [x] **Palette Overhaul** (`src/app/globals.css`)
    - [x] Implement "Sky Progress" colors (#0066CC, #663399, etc.)
    - [x] Retain "Clean Vibe" while adding vibrancy
- [x] **Depth Effects** (`globals.css`)
    - [x] Create "Manually Crafted" depth shadows
    - [x] Implement "Arc/Acre" rounded aesthetic
- [x] **Component Polish**
    - [x] Update Admin Cards for new Depth style
    - [x] Verify Mobile Form readability with new colors

## Phase 13: Admin Super-Dashboard (Complete)
- [x] **Tab System Architecture** (`src/app/admin/page.tsx`)
    - [x] Implement Client-Side Tabs (Work, Material, Billing, Resources)
    - [x] "Sky Progress" Tab Styling (Active/Inactive states)
- [x] **Tab 1: Work Progress**
    - [x] Component-wise progress tracking
    - [x] Map Integration (VisionPipeLayer)
- [x] **Tab 2: Material Consumption**
    - [x] Flowchart-style inventory tracking
    - [x] Link to "Store Data Sheet"
- [x] **Tab 3: Billing & Revenue**
    - [x] Expenditure Burning Charts
    - [x] Revenue vs Cost visualization
- [x] **Tab 4: Resource Tracking**
    - [x] Gang/Fitter performance grid
    - [x] Attendance & Efficiency stats

## Phase 14: Authentication & Entry (Complete)
- [x] **Restructure Routes**
    - [x] Move Field Dashboard to `/field`
    - [x] Create Login Portal at `/`
- [x] **Login Interface** (`src/app/page.tsx`)
    - [x] "Sky Progress" Theme (Glassmorphism)
    - [x] Role Selection (Admin vs Field)
    - [x] PIN Entry Animation

## Phase 15: Form & Onboarding Polish (Complete)
- [x] **UI Alignment (Task 1)**
    - [x] Lock login container height to `h-[550px]` and absolutely center it
    - [x] Add background watermark and scrolling vertical KSPPL typography
- [x] **Dynamic DPR Form & BOQ (Task 2)**
    - [x] Replicate exact Fillout structure using `src/config/dpr-schema.ts`
    - [x] Update `DynamicFormEngine.tsx` to fetch `MOCK_BOQ_ITEMS` and inject Pipeline/Civil dropdown options dynamically
    - [x] Route 'Submit Another' back to Home Tab instead of Form.
