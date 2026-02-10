# Infra-OS Deployment Guide

## 1. Environment Setup

Infra-OS supports a **Mock Mode** for preview deployments without a live database.

### Environment Variables
Configure these in your Vercel project settings or `.env.local` for local development.

| Variable | Description | Default / Example |
|----------|-------------|-------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API URL | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key | `your-anon-key` |
| `NEXT_PUBLIC_USE_MOCK_DATA` | Toggle Mock Mode | `true` (Enable) or `false` (Disable) |

## 2. Deploying to Vercel

### Option A: Vercel CLI (Recommended for Preview)
1. Install Vercel CLI: `npm i -g vercel`
2. Run deploy command:
   ```bash
   npx vercel
   ```
3. Follow the prompts. When asked for existing settings, say `N` to override and set env vars if needed.

### Option B: Git Integration
1. Push your code to a GitHub repository.
2. Import the repository in Vercel Dashboard.
3. Add the Environment Variables in the Project Settings.

## 3. Mock Mode Features
When `NEXT_PUBLIC_USE_MOCK_DATA=true`:
- **Dashboard**: Shows data from `Babarpur Village Scheme`.
- **BOQ Tracker**: Lists 90mm/110mm pipes and Civil works.
- **Reporting**: Submitting a report logs to console and mimics success.

## 4. Production Mode
To go live:
1. Set `NEXT_PUBLIC_USE_MOCK_DATA=false`.
2. Ensure Supabase URL/Key are valid.
3. Run the schema migrations from `supabase/schema.sql` in your Supabase SQL Editor.
