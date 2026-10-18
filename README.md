# Northstar SAT — free SAT study platform

A dark, responsive SAT study dashboard built with React + Vite. It includes:
- Dashboard and study streak overview
- SAT Math + Reading & Writing curriculum
- Original, locally authored practice questions (not copied from College Board or Crackd)
- Practice sessions with explanations
- Mistake notebook with review dates
- Study planner and progress analytics
- Links to official/free study resources
- Local-first storage with optional cross-device sync through Supabase Auth + database

## Important: hosted cross-device sync

The app works immediately in **local demo mode**. Browser storage does not synchronise across devices. To enable real cross-device accounts, connect a free Supabase project:

1. Create a project at https://supabase.com.
2. Open **SQL Editor** and run `supabase/schema.sql`.
3. Copy `.env.example` to `.env.local`.
4. Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from Supabase Project Settings → API.
5. Run locally to test, then deploy to a static host such as Netlify or Vercel.
6. Add the same two environment variables in your hosting provider's project settings and redeploy.
7. In Supabase Auth settings, configure your site's URL and allowed redirect URLs for the deployed domain.

Use only the Supabase **anon/publishable key** in the browser. Never put a `service_role` key in frontend code.

## Run locally (Ubuntu / Linux)

Install a current Node.js LTS release, then:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open the local URL printed by Vite. If you have not configured Supabase, the app remains in local mode.

Build for deployment:

```bash
npm run build
npm run preview
```

The deployable static output is in `dist/`.

## Deploy to Netlify (one option)

1. Push this folder to a private or public Git repository.
2. In Netlify, choose **Add new site → Import an existing project**.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables.
6. Redeploy after setting variables.

Vercel also supports Vite projects with the same build command and output directory.

## Data and privacy notes

- Without Supabase, study data is saved in the current browser on the current device only.
- With Supabase configured and a signed-in account, the app syncs one private JSON study-state record per user.
- The supplied SQL enables Row Level Security. Do not disable it.
- Avoid storing sensitive personal information in notes.
- This project does not use a paid AI API. Explanations for included questions are authored in the question bank. External AI tools can be used separately if desired.

## Current limitations

- The questions included are original starter questions for practice and are not a substitute for official full-length Bluebook tests.
- Score estimates are not calculated from these short quizzes. Use Bluebook for realistic timed tests and official score reporting.
- Authentication is email/password. Depending on Supabase email settings, email confirmation may be required.
# SATStudy
