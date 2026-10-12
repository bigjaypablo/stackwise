# Stackwise

Tools tested before you pay. A mobile-first review site for crypto, AI, and SaaS tools, plus an editorial desk with admin, editor, and writer roles.

## Run it

```bash
npm install
npm run dev
```

The dev server listens on port **8080**.

```bash
npm run build
npm run typecheck
```

Demo mode is the default. Leave the Supabase variables empty and everything stays in this browser (`localStorage`).

### Demo logins

Password for all three: `demo1234`

| Email | Role |
| --- | --- |
| admin@demo.com | admin |
| editor@demo.com | editor |
| writer@demo.com | writer |

Open the desk at `/admin` (it is not linked in the public nav). A demo banner stays visible while Supabase is not configured.

- **Writer** — create and edit their own stories. Status can be draft or in review. Cannot publish or delete.
- **Editor** — edit every story, publish or unpublish, manage categories, view and export subscribers.
- **Admin** — everything above, plus affiliate links, Top Picks, and the team.

Role checks run in the data layer, not only in the buttons.

## Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run [`supabase/schema.sql`](supabase/schema.sql). It creates `profiles`, `posts`, `categories`, `tools`, `affiliates`, and `subscribers`, turns on row level security, and adds a signup trigger that inserts a profile with role `writer`.
3. In Authentication, allow email/password sign-up. For a quick local test, turn off “confirm email”.
4. Copy `.env.example` to `.env.local` and set:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SITE_URL=https://your-domain.example
```

Use the **anon** key only. Do not put the `service_role` key in any frontend env var.

5. Restart the dev server. The demo banner disappears and sign-in uses Supabase Auth.
6. Create the first account from `/admin/login` (“Create a writer account”), then promote it in the SQL editor:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

New sign-ups stay writers until an admin changes the role on the Team screen. Deactivate removes access without deleting the auth user (that needs the service role, which this app does not use).

Affiliate links on the public site always come from the `affiliates` table (or the demo list) and use `rel="sponsored nofollow noopener"`.

## Deploy on Vercel

1. Push the repo to GitHub.
2. Import it in Vercel. Framework preset: Vite (this workspace also builds with the included TanStack Start / Nitro setup).
3. Add the same `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_SITE_URL` environment variables.
4. Deploy. `npm run build` is the production build.

Set `VITE_SITE_URL` to the real origin so canonical URLs are absolute. Update the host inside `public/sitemap.xml` if you want a fully qualified sitemap.

## Notes

- Sample stories are marked as placeholders in the article body.
- Affiliate URLs in the seed point at `example.com`. Replace them before a real launch.
- `public/robots.txt` disallows `/admin`.
