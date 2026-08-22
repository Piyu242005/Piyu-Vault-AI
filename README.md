# Piyu Vault AI

An enterprise-grade, AI-powered personal knowledge intelligence platform.

Piyu Vault AI is a full-stack application leveraging a hybrid architecture with Next.js for a premium frontend experience and FastAPI for a robust backend data layer, including advanced Retrieval-Augmented Generation (RAG) capabilities.

## Architecture

* **Frontend**: Next.js 16 (App Router), React, Tailwind CSS
* **Authentication**: Clerk
* **Database**: PostgreSQL (Neon)
* **Database Management**: Prisma (Frontend/Source of Truth), SQLAlchemy (Backend)
* **Backend API**: FastAPI
* **Vector Database**: Qdrant
* **AI Engine**: LangChain, SentenceTransformers, OpenAI

## Version 0.5 — Frontend & Backend Integration ✅

The frontend now communicates with FastAPI through an authenticated Next.js server proxy. Clerk session identity is forwarded to FastAPI, where user-owned data is resolved from PostgreSQL instead of using the previous mock user.

### Integrated flows

* **Notes**: authenticated list, create, update and delete from the Next.js UI
* **Files**: authenticated list and delete from the Next.js UI
* **AI / RAG**: semantic search and RAG chat connected to FastAPI
* **Authentication bridge**: Clerk → Next.js proxy → FastAPI → PostgreSQL user
* **User isolation**: Notes and file queries are scoped to the authenticated database user
* **API proxy**: `/api/backend/*` forwards requests to the FastAPI `/api/*` namespace

## Environment Variables

Frontend `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
DATABASE_URL=your_postgresql_url
BACKEND_URL=http://localhost:8000
```

Backend `.env`:

```env
DATABASE_URL=your_postgresql_url
OPENAI_API_KEY=your_openai_key
QDRANT_URL=http://localhost:6333
EMBEDDING_MODEL=all-MiniLM-L6-v2
COLLECTION_NAME=piyu_vault
```

## Local Development

### Frontend

```bash
pnpm install
npx prisma generate
npx prisma db push
pnpm run dev
```

### Backend

```bash
docker-compose up -d
cd backend
python -m venv venv
venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

FastAPI documentation is available at `http://localhost:8000/docs`.

## Roadmap

* **Version 0.1**: Initial Next.js Scaffold & UI ✅
* **Version 0.2**: Clerk Auth & PostgreSQL Setup ✅
* **Version 0.3**: FastAPI CRUD Endpoints & Pydantic Schemas ✅
* **Version 0.4**: Qdrant Vector Search & AI RAG Integration ✅
* **Version 0.5**: Frontend & Backend Integration ✅
* **Version 0.6**: Production storage/upload pipeline, broader user-scoped APIs, testing and deployment hardening
