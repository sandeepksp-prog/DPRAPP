# PowerPlay Extraction Report (Feb 14, 2026)

## Source: portal.getpowerplay.in

---

## 1. Layout Architecture

| Element | Value |
|---------|-------|
| Sidebar Width | **64px** (icon-only, dark navy `#1B2A4A`) |
| Flyout Width | **200px** (dark panel, appears on icon hover/click) |
| Header Height | **48px** (white, project name + SYNC status + avatar) |
| Content BG | `#F3F4F6` (light gray) |
| Card BG | `#FFFFFF` with `border: 1px solid #E5E7EB`, `shadow: 0 1px 3px rgba(0,0,0,0.08)` |
| Corner Radius | **4px** everywhere (enterprise-sharp, NOT rounded) |

---

## 2. Sidebar Navigation (Icon + Flyout)

The sidebar is a **slim 64px dark column** with white icons. Clicking an icon triggers a **dark flyout panel** showing sub-navigation. This is NOT a traditional full-width sidebar.

### Sidebar Icons (Top → Bottom):
1. **Dashboard** (Grid icon) – `/dashboard`
2. **Reports** (Document icon) – Flyout: Reports
3. **Tasks** (Gantt/List icon) – Flyout: Plan View, Open Issues, List View
4. **Issues** (Warning icon) – Flyout: Issues tracker
5. **Commercial** (Money icon) – Flyout: Indents, Purchase Orders
6. **Tags** (Label icon)
7. **Cloud/Storage** (Cloud icon)
8. **Settings** (Gear icon) – Project settings
9. **Documents** (File icon) – Flyout: Documents
10. **BOQ** (Table icon) – `/budget/boq`

---

## 3. Projects List Page

- **URL**: `/projects`
- **Layout**: Top action bar + responsive card grid (4 columns)
- **Card structure**:
  - Project thumbnail (image/logo)
  - Project name (bold, 16px, dark)
  - Orange progress ring (circular, right-aligned) with `%` inside
  - START DATE / END DATE rows (gray labels)
  - Status chip: `⚡ Active ∨` (green/gold pill with dropdown)
  - Three-dot menu for quick actions
- **Action Bar**: Search input | Project Status dropdown | Filter button
- **Header Buttons**: `+ New Project` (blue filled) | `↓ Export Excel` (blue outline)

---

## 4. Project Dashboard

- **URL**: `/project/[id]/dashboard`
- **Header**: Project name (bold) + "SYNC" status + bell icon + avatar

### Widgets:
1. **Project Status** (full-width card)
   - Semi-circular gauge (gray arc, orange filled)
   - `14% complete` text inside
   - Actual Start/End dates
   - Planned Start/End dates
   - Delay badge: `(175 days delay)` in green text

2. **Task Summary Grid** (3-column inside card)
   - Not Started: Total + Delayed count (red)
   - In Progress: Total + Delayed count (red)
   - Completed: Total + Delayed count

3. **Recent Progress Updates** (right column)
   - Date selector icon
   - "View all updates >" link (blue)
   - Tabs: "Updates on tasks" | "Progress remarks"

4. **Bottom Row**: Deadline Tasks | Schedule Tasks (with delay days in red)

---

## 5. Issues/Tasks Module

- **Flyout Navigation**: Plan View → Open Issues → List View
- **Issues Page**:
  - Search bar + Filter chips (Assigned to, Created by, Tags, Date range, Sort)
  - Summary cards: Open Issues | Closed Issues | All Issues  
  - Tab bar: All Open (0) | Assigned to me (0) | Overdue (0) | Unassigned (0)
  - Empty state: Warning icon with "No issues to show"
  - Pagination: "20 Rows per page" | "Displaying 0-0 of 0"

---

## 6. Commercial Module

- **Flyout Sub-items**: Indents | Purchase Orders
- **Table Pattern**: Dense rows with status badges

---

## 7. Reports Section

- **Reports flyout** shows "Reports" heading
- **Empty State**: Folder+magnifying glass illustration + "No report here"
- **CTA**: Blue filled button "CREATE REPORT"
- Note: "Access reports for up to 15 days from the creation date"

---

## 8. Color Palette (Verified)

| Token | Hex | Usage |
|-------|-----|-------|
| Navy Dark | `#1B2A4A` | Sidebar background |
| Navy | `#1E3A8A` | Headings, flyout active items |
| Blue Primary | `#2563EB` | Buttons, links, active indicators |
| Blue Hover | `#3B82F6` | Hover states |
| Orange | `#F97316` | Progress arcs, accent borders |
| Gray BG | `#F3F4F6` | Page background |
| Gray Border | `#E5E7EB` | Card/table borders |
| Gray Text | `#6B7280` | Secondary text |
| Dark Text | `#1F2937` | Primary headings |
| Green Active | `#16A34A` | Active status chips |
| Red Delay | `#DC2626` | Delayed count text |

---

## 9. Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Page heading | Lato/Roboto | 20px | 700 |
| Card title | Lato/Roboto | 16px | 600 |
| Table header | Lato/Roboto | 11px | 600, uppercase |
| Table cell | Lato/Roboto | 13px | 400 |
| Status badge | Lato/Roboto | 11px | 500 |
| Button text | Lato/Roboto | 13px | 600, uppercase |
| Timestamp | Lato/Roboto | 11px | 400 |

---

## 10. Key UI Patterns to Clone

1. **Slim Icon Sidebar** (64px) with dark flyout on click
2. **Project Cards** with image + orange progress ring
3. **Semi-circular gauge** for project completion %
4. **Task Status Grid** (Not Started | In Progress | Completed)
5. **Filter chip bar** with date range pickers
6. **Dense data tables** with pagination controls
7. **Empty states** with illustration + CTA
8. **"SYNC" badge** next to project name
