# Walkthrough: Sky Progress & Depth UI

## Overview
A visual overhaul implementing a specific "Sky Progress" palette and "Depth" UI effects to create a vibrant, high-class dashboard experience.

## 1. "Sky Progress" Palette
- **Primary Blue**: `#0066CC` (Calm Tracking) - Used for key actions and approved states.
- **Secondary Violet**: `#663399` - Used for headings and subtle accents.
- **Sky Pastel**: `#A7D3E0` - Used for backgrounds and "submitted" states.
- **Clean Green**: `#90EE90` - Used for success indicators and high efficiency.
- **Golden Yellow**: `#FFD700` - Used for warnings and mid-level status.

## 2. "Depth" UI System
- **Arc Corners**: Highly rounded `rounded-3xl` (2rem) corners for an organic feel.
- **Manual Depth Shadows**: Multi-layered box-shadows (`--shadow-depth-1`, `--shadow-depth-2`) that provide a physical "lift" to cards.
- **Gloss Highlights**: Subtle top-border gradients simulating light reflection.

## 3. Updated Components
- **Dashboard Widgets**: Now utilize `.card-depth` with hover-lift effects.
- **Billing Stats**: Bar chart updated to Blue/Sky theme.
- **Labour Stats**: Progress bars updated to Green/Gold theme.

## Deployment
- **Repo**: [https://github.com/sandeepksp-prog/DPRAPP](https://github.com/sandeepksp-prog/DPRAPP)
- **Live Demo**: [https://dprapp.vercel.app/](https://dprapp.vercel.app/)
