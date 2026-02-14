# Walkthrough: Authentication & Admin Super-Dashboard

## Overview
A complete system overhaul introducing a **Login Portal** and a **4-Tab Super-Dashboard**.

## 1. Authentication & Entry (`/`)
-   **Login Portal**: A "Sky Progress" themed entry screen with glassmorphism effects.
-   **Role Selection**:
    -   **Project Manager**: PIN `admin` -> Redirects to `/admin`.
    -   **Field Engineer**: PIN `1234` -> Redirects to `/field`.
-   **Field Dashboard**: Moved to `/field` to secure the entry point.

## 2. Admin Super-Dashboard (`/admin`)
### Tab Architecture
-   **Work Progress**: Live Map & KPIs.
-   **Material Hub**: Inventory Analysis & Store Link.
-   **Finance Console**: Expenditure Burn Charts & Net Margin.
-   **Resource Center**: Sub-contractor & Labour tracking.

## Technical Details
-   **Routes**:
    -   `/`: Login Portal
    -   `/field`: Field Dashboard
    -   `/admin`: Admin Dashboard
-   **State**: Client-side PIN validation (Mock) for immediate access.
-   **Theme**: Consistently applied `#0066CC` and `#663399` palette.

## Deployment
-   **Repo**: [https://github.com/sandeepksp-prog/DPRAPP](https://github.com/sandeepksp-prog/DPRAPP)
-   **Live Demo**: [https://dprapp.vercel.app/](https://dprapp.vercel.app/)
