# Piyu Vault AI

An enterprise-grade, AI-powered personal knowledge intelligence platform.

Piyu Vault AI is a full-stack application using Next.js for the frontend, FastAPI for the backend, PostgreSQL for application data, Qdrant for vector search, and an AI/RAG layer for private knowledge retrieval.

## Architecture

* **Frontend**: Next.js 16, React, Tailwind CSS
* **Authentication**: Clerk
* **Database**: PostgreSQL (Neon)
* **ORM**: Prisma + SQLAlchemy
* **Backend API**: FastAPI
* **Storage**: Per-user local storage abstraction (S3-compatible service can be added later)
* **Vector Database**: Qdrant
* **AI Engine**: LangChain, SentenceTransformers, OpenAI

## Version 0.5 — Frontend & Backend Integration ✅

The frontend communicates with FastAPI through an authenticated Next.js server proxy. Clerk identity is forwarded to FastAPI and database queries are scoped to the authenticated user.

## Version 0.6 — Storage, Uploads & Hardening ✅

### Implemented

* **Secure file upload**: authenticated multipart upload with a configurable 25 MB default limit
* **Per-user storage isolation**: uploaded files are stored under a user-specific directory with path-traversal protection
* **Download pipeline**: authenticated download endpoint streams the original file safely
* **Delete cleanup**: database records and physical storage are removed together
* **Activity logging**: uploads and deletions are recorded and activity queries are user-scoped
* **Text ingestion**: supported text/code files are automatically sent to the Qdrant ingestion pipeline with user and document metadata
* **Files UI**: upload, refresh, download and delete actions are connected to the backend
* **Testing foundation**: storage helper tests cover naming, persistence, deletion and size limits
* **Dependency hardening**: multipart upload, Qdrant/LangChain adapters and pytest dependencies are declared explicitly

### Environment Variables

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
STORAGE_ROOT=./storage
MAX_FILE_SIZE=26214400
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
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Run storage tests with:

```bash
pytest
```

FastAPI documentation is available at `http://localhost:8000/docs`.

## Roadmap

* **Version 0.1**: Initial Next.js Scaffold & UI ✅
* **Version 0.2**: Clerk Auth & PostgreSQL Setup ✅
* **Version 0.3**: FastAPI CRUD Endpoints & Pydantic Schemas ✅
* **Version 0.4**: Qdrant Vector Search & AI RAG Integration ✅
* **Version 0.5**: Frontend & Backend Integration ✅
* **Version 0.6**: Storage, Uploads & Hardening ✅
* **Version 0.7**: Production object storage, background ingestion jobs, observability and CI/CD
