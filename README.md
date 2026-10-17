# Lensque

Photography portfolio for Saish. Next.js (App Router) with Supabase for photo storage, the database and the admin login.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home: hero, latest frames, four categories, enquiry call to action |
| `/work` | Portfolio with category filters (`?c=Portraits`) |
| `/work/[id]` | One photo, with prev/next and more from the same category |
| `/about` | About Saish |
| `/admin` | Photo library: upload, rename, change category, publish, feature, delete |
| `/admin/login` | Admin sign in |

Enquiries go to Instagram DMs (`https://ig.me/m/<handle>`).

## Set up Supabase

1. Create a project at supabase.com.
2. In the SQL editor, run `supabase/migrations/0001_init.sql`. It creates the `photos` table, the `photos` storage bucket, and row-level security so only admins can write.
3. Authentication → Users → add a user with your email and a password.
4. Allow that user as an admin (SQL editor):
   ```sql
   insert into public.admins (email) values ('you@example.com');
   ```
5. Copy `.env.example` to `.env.local` and fill in the project URL and anon key (Project settings → API).

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000. Sign in at `/admin/login`, upload photos (they arrive as drafts), then publish them. Mark up to three as Featured to choose what shows on the home page.

## How photos flow

Uploads go from the browser straight to the Supabase `photos` bucket (so large files don't pass through the server), then a server action records the row. Visitors only ever see rows where `published = true`, enforced by row-level security, not just by the page code.
