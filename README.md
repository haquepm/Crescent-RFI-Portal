# Crescent RFI Portal

Standalone **Request for Inspection** application for KBC-06 and future project-wise inspection tracking. This repository is independent of the Crescent Management Dashboard frontend and subcontractor billing application.

## Stack
- Next.js 15 / React 19 / TypeScript
- Supabase Auth + database using the existing Dashboard Supabase project
- Vercel deployment

## Local setup
1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from the existing Dashboard Supabase project. Do not use the subcontractor billing project.
5. Run `npm run dev` and open `http://localhost:3000`.

## Current foundation
- Independent application shell and dashboard.
- Dashboard reads from `public.rfis` and displays live status counts.
- Supabase browser/server clients and session-refresh middleware.
- Dashboard is read-only at this stage. RFI creation, inspection workflows, role administration and production RLS hardening are next stages.

## Database tables
- `rfi_checklist_templates`
- `rfis`
- `rfi_checklist_responses`
- `rfi_inspections`
- `rfi_status_history`

The seeded checklist data currently contains 83 checklist items across 8 activity categories. Additional structured sheets (such as BBS, tremie charts and pour cards) should be implemented as dedicated forms after the initial checklist workflow.

## Security
- Never commit `.env.local`, service-role keys, or database passwords.
- The current initial RLS policies are permissive for authenticated users. Replace them with role-aware policies and protected audit history before production.
- Never expose Supabase service-role credentials in browser code.

## Deployment
Import this repository as a new Vercel project. Set the two Supabase environment variables for Production, Preview and Development as appropriate, then deploy after login and authorization checks are complete.
