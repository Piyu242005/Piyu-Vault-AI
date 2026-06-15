# Convert Piyu Vault AI from Next.js-Centric to Python-Centric Architecture

Act as a Senior Python Architect, FastAPI Engineer, and AI Systems Engineer.

Analyze the entire Piyu Vault AI codebase and migrate it to a Python-first architecture while preserving all existing functionality.

## Goal

Transform the project into a production-grade Python application where:

* FastAPI becomes the core backend
* Python handles authentication, business logic, APIs, security, and AI
* PostgreSQL remains the primary database
* Future AI/RAG features are fully supported
* Frontend becomes a thin UI layer

## Target Architecture

Frontend:

* Next.js (UI only)

Backend:

* FastAPI
* Python 3.12+

Database:

* PostgreSQL

ORM:

* SQLAlchemy 2.x

Migrations:

* Alembic

Validation:

* Pydantic v2

Authentication:

* JWT
* Role-Based Access Control

AI Layer:

* LangChain
* OpenAI
* Qdrant

Storage:

* MinIO or Cloudflare R2

Deployment:

* Docker
* Render/Koyeb/Railway

## Migration Tasks

### Authentication

Replace Clerk dependency with Python authentication system.

Implement:

* Login endpoint
* Logout endpoint
* JWT access tokens
* Refresh tokens
* Password hashing using bcrypt
* Invite-only registration
* Role system

Roles:

OWNER
ADMIN
MEMBER

No public sign-ups allowed.

### Database Layer

Convert Prisma schema to:

* SQLAlchemy models
* Alembic migrations

Create models:

User
Document
Note
ActivityLog
SecurityEvent

### API Structure

Create:

app/
├── api/
├── auth/
├── core/
├── db/
├── models/
├── schemas/
├── services/
├── security/
├── storage/
├── ai/
└── main.py

### Security

Implement:

* JWT authentication
* Password hashing
* RBAC permissions
* Audit logs
* Session tracking
* Rate-limit preparation
* Security headers

### Notes Module

Create APIs:

POST /notes
GET /notes
PUT /notes/{id}
DELETE /notes/{id}

### Files Module

Create APIs:

POST /files
GET /files
DELETE /files/{id}

Store metadata in PostgreSQL.

### AI Module Preparation

Create structure for:

* LangChain
* Qdrant
* Embeddings
* Document ingestion

No UI required yet.

### Dockerization

Generate:

Dockerfile
docker-compose.yml

Services:

FastAPI
PostgreSQL

### Environment Variables

Create:

.env.example

Required:

DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
OPENAI_API_KEY=
QDRANT_URL=
QDRANT_API_KEY=

### Deliverables

Generate:

1. Complete FastAPI backend structure
2. SQLAlchemy models
3. Alembic migrations
4. Authentication system
5. RBAC implementation
6. Docker configuration
7. API documentation
8. Migration report

Preserve the existing dashboard UI while moving all backend functionality to Python.

The final result should be a Python-first AI Knowledge Vault suitable for Data Science, AI Engineering, and ML portfolio projects.
