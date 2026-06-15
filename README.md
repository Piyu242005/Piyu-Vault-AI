# Piyu Vault AI

An enterprise-grade, AI-powered personal knowledge intelligence platform.

Piyu Vault AI is a full-stack application leveraging a hybrid architecture with Next.js for a premium frontend experience and FastAPI for a robust backend data layer, including advanced Retrieval-Augmented Generation (RAG) capabilities.

## Architecture

*   **Frontend**: Next.js 15 (App Router), React, Tailwind CSS
*   **Authentication**: Clerk
*   **Database**: PostgreSQL (Neon)
*   **Database Management**: Prisma (Frontend/Source of Truth), SQLAlchemy (Backend)
*   **Backend API**: FastAPI (Python)
*   **Vector Database**: Qdrant
*   **AI Engine**: LangChain, SentenceTransformers (`all-MiniLM-L6-v2`), OpenAI (`gpt-4o-mini`)

## Features

*   **Premium Aesthetic**: A curated "Deploy Piyu" premium glassmorphism and modern UI aesthetic.
*   **Secure Authentication**: Fully protected routing and authentication flows via Clerk.
*   **Data Synchronisation**: Prisma as the single source of truth for the database schema, with SQLAlchemy mapping models for the FastAPI backend.
*   **Semantic Search & RAG**: Local text embedding via `sentence-transformers` coupled with Qdrant for lightning-fast semantic search. LangChain and OpenAI generate contextual answers via Retrieval-Augmented Generation (RAG).
*   **RESTful Core**: Fully documented (Swagger UI) CRUD endpoints for Notes, Documents, and Activity Logs.

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory (based on `.env.example`):

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Database
DATABASE_URL=your_postgresql_url

# AI & Vector DB
OPENAI_API_KEY=your_openai_key
QDRANT_URL=http://localhost:6333
EMBEDDING_MODEL=all-MiniLM-L6-v2
COLLECTION_NAME=piyu_vault
```

Copy the same `.env` file into the `backend/` directory for the FastAPI app.

### 2. Frontend Setup

Install dependencies and generate the Prisma client:

```bash
pnpm install
npx prisma generate
npx prisma db push
```

Run the Next.js development server:

```bash
pnpm run dev
```

### 3. Backend Setup

Start your Qdrant container (if using Docker):

```bash
docker-compose up -d
```

Navigate to the `backend/` directory, create a virtual environment, and install the dependencies:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Run the FastAPI development server:

```bash
uvicorn app.main:app --reload
```

You can view the interactive API documentation at `http://localhost:8000/docs`.

## Roadmap

*   **Version 0.1**: Initial Next.js Scaffold & UI ✅
*   **Version 0.2**: Clerk Auth & PostgreSQL Setup ✅
*   **Version 0.3**: FastAPI CRUD Endpoints & Pydantic Schemas ✅
*   **Version 0.4**: Qdrant Vector Search & AI RAG Integration ✅
*   **Version 0.5**: Frontend & Backend Integration (Coming Soon)
