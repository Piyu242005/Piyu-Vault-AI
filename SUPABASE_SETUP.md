# Supabase Setup

## 1. Create the project
Create a Supabase project and copy the project URL, anon key, service-role key, and Postgres connection string.

## 2. Apply the schema
From the repository root, after installing the Supabase CLI, run:

```bash
supabase db push --db-url "$DATABASE_URL"
```

The migration creates the application tables, profile synchronization trigger, RLS policies, and the private `vault-files` Storage bucket.

## 3. Configure environment variables
Copy `.env.example` to `.env.local` for Next.js and configure the same server variables for FastAPI. Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.

Required browser variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Required FastAPI variables:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET=vault-files`
- `DATABASE_URL`

## 4. Authentication
Supabase Auth now replaces Clerk. Enable Email/Password in Supabase Authentication. If email confirmation is enabled, configure the Site URL and redirect URLs for the deployed application.

## 5. Run locally

```bash
pnpm install
pnpm dev

cd backend
python -m pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## 6. Validate

```bash
pnpm lint
pnpm build

cd backend
pytest -q
```

The repository CI workflow runs the frontend lint/build and backend tests on pushes and pull requests.
