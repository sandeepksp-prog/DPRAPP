# Walkthrough: Admin Super-Dashboard (Tab System)

## Overview
A high-level, "Sky Progress" themed dashboard that consolidates all project controls into 4 distinct tabs.

## Tab Architecture

### 1. Work Progress (`WorkProgressView`)
-   **Live Map**: Integrated `VisionPipeLayer` for real-time network status.
-   **KPIs**: Active Sites, Pipe Laid, Financial overview using "Depth" cards.
-   **Activity Feed**: Live updates from the field.

### 2. Material Hub (`MaterialView`)
-   **Total Value**: Inventory valuation breakdown (Pipe vs Fittings).
-   **Safety Stock**: Auto-alerts for critical items.
-   **Store Integration**: Direct link to Store Ledger.

### 3. Finance Console (`FinanceView`)
-   **Burn Charts**: `AreaChart` visualizing Revenue vs Expenditure.
-   **Net Margin**: Real-time margin calculation.
-   **Cashflow**: Pending POs and Cash-in-hand tracking.

### 4. Resource Center (`ResourceView`)
-   **Gang Tracking**: Sub-contractor performance grid.
-   **Manpower**: Attendance rates and safety incident tracking.

## Technical Details
-   **State Management**: `activeTab` state in `admin/page.tsx`.
-   **Dynamic Imports**: `react-leaflet` is lazy-loaded to prevent SSR issues (`window is not defined`).
-   **Theme**: Strict adherence to `#0066CC` (Blue), `#663399` (Violet), and `#A7D3E0` (Sky).

## Deployment
-   **Repo**: [https://github.com/sandeepksp-prog/DPRAPP](https://github.com/sandeepksp-prog/DPRAPP)
-   **Live Demo**: [https://dprapp.vercel.app/admin](https://dprapp.vercel.app/admin)
