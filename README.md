# 🔐 Piyu Vault AI

> **Private Knowledge. Secure Intelligence.**
>
> A production-oriented AI knowledge vault for securely storing documents and notes, searching private knowledge with RAG, and managing personal information from one modern workspace.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Supabase-Auth%20%7C%20Postgres%20%7C%20Storage-3ECF8E?logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Qdrant-Vector%20Search-DC244C" alt="Qdrant" />
  <img src="https://img.shields.io/badge/RAG-AI%20Search-7C3AED" alt="RAG" />
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="MIT" />
</p>

## ✨ What is Piyu Vault AI?

Piyu Vault AI is a full-stack private knowledge platform designed around **user-owned data, authenticated access, private storage, and AI-powered retrieval**.

Instead of treating the interface as a static dashboard, the application connects the user experience to real authentication, database records, private object storage, activity logs, and a FastAPI-powered RAG layer.

### Core capabilities

- 🔑 **Supabase Authentication** — email/password signup, verification, sessions and password reset
- 📁 **Private File Vault** — authenticated upload, download and deletion
- 📝 **Notes** — authenticated note CRUD
- 🧠 **AI Search & RAG** — semantic retrieval through Qdrant
- 💬 **AI Chat** — contextual answers from the user's indexed knowledge
- 📊 **Analytics** — activity and content metrics from application data
- 🛡️ **Security** — user-scoped access control and Row Level Security
- ⚙️ **Settings** — account/profile management
- 📝 **Activity Logging** — user-scoped application events

## 🏗️ Production Architecture

```text
                         ┌──────────────────────┐
                         │       GitHub         │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
          ┌─────────────────┐             ┌─────────────────┐
          │ Vercel          │             │ Google Cloud Run│
          │ Next.js 16      │             │ FastAPI         │
          │ Frontend        │────────────▶│ Backend API     │
          └────────┬────────┘             └────────┬────────┘
                   │                               │
                   │                        ┌──────┴──────┐
                   │                        ▼             ▼
                   │                    Qdrant        AI/RAG
                   │                    Vectors       Services
                   │
                   └──────────────────┬────────────────────┐
                                      ▼                    │
                             ┌──────────────────┐          │
                             │     Supabase     │◀─────────┘
                             │                  │
                             │ Auth             │
                             │ PostgreSQL       │
                             │ Private Storage  │
                             │ RLS              │
                             └──────────────────┘
```

## 🧰 Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React, TypeScript, Tailwind CSS |
| Authentication | Supabase Auth |
| Database | Supabase PostgreSQL |
| Backend | FastAPI, Python |
| ORM / Data | SQLAlchemy + PostgreSQL |
| Storage | Supabase Storage (`vault-files`, private) |
| Vector Database | Qdrant |
| RAG | Embeddings + semantic retrieval |
| AI | OpenAI-compatible AI services |
| Deployment | Vercel + Google Cloud Run |
| Source Control | GitHub |

## 🔒 Security Model

Security is designed around authenticated, user-scoped access.

- Supabase Auth manages user identity and sessions.
- PostgreSQL rows are protected with **Row Level Security (RLS)**.
- Private Storage objects are isolated by authenticated user ID.
- FastAPI validates Supabase bearer tokens before accessing protected resources.
- Backend-only secrets stay outside the browser.
- Service-role credentials and AI API keys must never be exposed as `NEXT_PUBLIC_*` variables.

## 📦 Data Model

The Supabase application layer includes:

- `profiles` — user profile information
- `vault_files` — file metadata and ownership
- `notes` — private user notes
- `activity_logs` — authenticated user activity
- `vault-files` — private Supabase Storage bucket

## 🚀 Getting Started

### 1. Clone

```bash
git clone https://github.com/Piyu242005/Piyu-Vault-AI.git
cd Piyu-Vault-AI
```

### 2. Frontend

```bash
npm install
npm run dev
```

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### 3. Backend

```bash
cd backend
python -m venv venv
```

Activate the environment and install dependencies:

```bash
pip install -r requirements.txt
```

Run FastAPI:

```bash
uvicorn app.main:app --reload
```

API documentation:

```text
http://localhost:8000/docs
```

### 4. Backend environment

Configure backend-only secrets in the server environment:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_private_service_role_key
SUPABASE_STORAGE_BUCKET=vault-files
DATABASE_URL=your_database_url
QDRANT_URL=your_qdrant_url
COLLECTION_NAME=piyu_vault
OPENAI_API_KEY=your_private_ai_key
MAX_FILE_SIZE=26214400
FRONTEND_URL=http://localhost:3000
```

> **Never commit `.env` files or expose service-role, database, Qdrant, or AI secrets to the browser.**

## ☁️ Deployment

### Frontend — Vercel

Set the frontend environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=https://piyu-vault-ai.vercel.app
NEXT_PUBLIC_BACKEND_URL=https://your-cloud-run-service.run.app
```

### Backend — Google Cloud Run

Deploy the `backend/` service separately and configure the backend-only environment variables there.

After deployment, set the resulting Cloud Run URL as:

```env
NEXT_PUBLIC_BACKEND_URL=https://your-cloud-run-service.run.app
```

### Supabase Auth URLs

For production, configure the Supabase Auth **Site URL** and allowed redirect URLs to the deployed Vercel domain. Keep localhost redirect URLs only for development.

## 🧪 Testing

Frontend:

```bash
npm run build
```

Backend:

```bash
pytest
```

FastAPI health/API documentation can be checked at `/docs` when the backend is running.

## 📁 Repository Structure

```text
Piyu-Vault-AI/
├── src/                 # Next.js frontend
│   ├── app/             # Application routes
│   ├── components/      # Reusable UI
│   └── lib/             # Supabase/API helpers
├── backend/             # FastAPI backend
│   └── app/
│       ├── api/         # Protected API routes
│       ├── models/      # Database models
│       ├── schemas/     # Pydantic schemas
│       └── services/    # Storage, RAG and AI services
├── supabase/            # Supabase migrations/configuration
├── public/              # Static assets
├── package.json
└── vercel.json
```

## 🗺️ Project Status

| Capability | Status |
|---|---|
| Supabase Auth | ✅ Implemented |
| Email verification | ✅ Implemented |
| Password reset | ✅ Implemented |
| PostgreSQL + RLS | ✅ Implemented |
| Private Storage | ✅ Implemented |
| File CRUD | ✅ Implemented |
| Notes CRUD | ✅ Implemented |
| Activity logging | ✅ Implemented |
| Qdrant RAG | ✅ Implemented |
| AI search/chat API | ✅ Implemented |
| Vercel frontend | 🚀 Deployment-ready |
| Cloud Run backend | 🚀 Deployment-ready |
| Production E2E validation | 🔄 Final validation |

## 🛣️ Roadmap

- [x] Replace legacy Clerk authentication with Supabase Auth
- [x] Move application data to Supabase PostgreSQL
- [x] Configure private Supabase Storage
- [x] Add user-scoped RLS policies
- [x] Connect file and note operations to real backend services
- [x] Connect AI retrieval to authenticated users
- [ ] Complete Cloud Run production deployment
- [ ] Add production observability and monitoring
- [ ] Add background ingestion workers
- [ ] Expand automated end-to-end test coverage

## 🎯 Why this project exists

Piyu Vault AI was built as a practical exploration of **secure personal knowledge management + RAG**.

The goal is to combine a modern full-stack application with real authentication, private data storage, semantic search, and AI-assisted knowledge retrieval in one deployable system.

## 👨‍💻 Author

**Piyush Ramteke**

Data Scientist • Python • AI/ML • RAG

- GitHub: [@Piyu242005](https://github.com/Piyu242005)
- LinkedIn: [@piyu24](https://www.linkedin.com/in/piyu24)

---

<p align="center">
  <strong>Piyu Vault AI</strong><br />
  Private Knowledge. Secure Intelligence.
</p>
