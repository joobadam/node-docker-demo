DevOps Portfolio: Node.js Todo App + Docker + GHCR + GitHub Actions

Overview

This project demonstrates end‑to‑end DevOps skills by building a small Todo application and shipping it as Docker images to GitHub Container Registry (GHCR) using a GitHub Actions CI workflow.

What this shows about you

- You can design a simple full‑stack app (Node.js API + Next.js UI)
- You can containerize apps with Docker (multi‑stage, non‑root, HEALTHCHECK, volumes)
- You can publish images to a registry (GHCR) with proper tagging
- You can automate builds and pushes with GitHub Actions

Tech Stack

- Backend API: Node.js (Express), better‑sqlite3, pino
- Database: SQLite (embedded, persisted to volume)
- Frontend UI: Next.js (App Router), Tailwind CSS, shadcn/ui
- CI/CD: GitHub Actions → GitHub Container Registry (GHCR)
- Runtime: Docker (local dev and test)

Repo layout

- src/ … Express API (todos CRUD)
- web/ … Next.js UI (consumes the API)
- Dockerfile … backend image
- web/Dockerfile … frontend image
- .github/workflows/ci.yml … CI for build + push to GHCR

Prerequisites

- Node.js 20+
- Docker Desktop
- GitHub account + repository permissions (to push packages to GHCR)

Local development (no Docker)

Backend (port 3000)

```bash
npm install
npm run dev     # or: npm start
# Healthcheck
curl -s http://localhost:3000/healthz | jq .
```

Frontend (port 3001)

```bash
cd web
npm install
PORT=3001 npm run dev
# Open http://localhost:3001
```

Note: The UI calls the API at http://localhost:3000 by default. To change it, set NEXT_PUBLIC_API_URL.

API endpoints (quick reference)

- GET /healthz → { status: "ok" }
- GET /todos → list todos
- GET /todos/:id → get one
- POST /todos → { title, completed } → 201 created
- PUT /todos/:id → { title?, completed? } → 200 updated
- DELETE /todos/:id → 204 no content

Example

```bash
curl -s http://localhost:3000/todos | jq .
curl -s -X POST http://localhost:3000/todos \
  -H 'Content-Type: application/json' \
  -d '{"title":"Learn Docker","completed":false}' | jq .
```

Docker (local)

Build images

```bash
# API
docker build -t ghcr.io/<owner>/<repo>-api:local .

# Web
cd web
docker build -t ghcr.io/<owner>/<repo>-web:local .
```

Run containers

```bash
# API on 3000 (persist DB to ./data)
docker run -d --name todo-api \
  -p 3000:3000 \
  -v "${PWD}/data":/app/data \
  ghcr.io/<owner>/<repo>-api:local

# Web on 3001 (point UI to API)
docker run -d --name todo-web \
  -p 3001:3001 \
  -e NEXT_PUBLIC_API_URL="http://host.docker.internal:3000" \
  ghcr.io/<owner>/<repo>-web:local
```

Healthcheck

```bash
curl -sI http://localhost:3000/healthz
curl -sI http://localhost:3001
```

Ports in use? Free them on macOS

```bash
lsof -ti:3000,3001 | xargs -r kill -9
```

CI/CD to GHCR

- Workflow: .github/workflows/ci.yml
- Triggers:
  - push to main → build and push images
  - tags v* → also create version tags
  - pull_request → build only (no push)
- Images pushed:
  - ghcr.io/<owner>/<repo>-api:latest, sha-<SHORT_SHA>, vX.Y.Z
  - ghcr.io/<owner>/<repo>-web:latest, sha-<SHORT_SHA>, vX.Y.Z
- Auth: uses GitHub‑provided GITHUB_TOKEN

Pull and run from GHCR

```bash
docker pull ghcr.io/<owner>/<repo>-api:latest
docker pull ghcr.io/<owner>/<repo>-web:latest

docker run -d -p 3000:3000 -v "${PWD}/data":/app/data ghcr.io/<owner>/<repo>-api:latest
docker run -d -p 3001:3001 -e NEXT_PUBLIC_API_URL="http://host.docker.internal:3000" ghcr.io/<owner>/<repo>-web:latest
```

Security & hardening notes

- Non‑root user in both images
- HEALTHCHECK in API image
- Minimal base image (Debian slim) + multi‑stage builds
- SQLite file persisted via volume (/app/data)

Troubleshooting

- 3000/3001 already in use → free ports (see above)
- Next.js dev server still using 3001 → ensure PORT is set; restart dev server
- Docker cannot connect to daemon → start Docker Desktop

Hungarian recap (Rövid összefoglaló)

- Ez a projekt egy Todo alkalmazást készít (Express + SQLite + Next.js)
- Dockerrel konténerizáljuk az API‑t és a Web UI‑t
- GitHub Actions workflow automatikusan buildel és pushol a GHCR‑be (`latest`, `sha-<rövid_sha>`, `vX.Y.Z`)
- Helyi futtatás: API 3000‑en, Web 3001‑en; a UI az API‑t a `NEXT_PUBLIC_API_URL` segítségével éri el

License

MIT
# Node Docker Todo API (JavaScript)

Simple Express + SQLite (better-sqlite3) Todo API.

## Run locally

```bash
npm install
npm run dev
# or
npm start
```

- Healthcheck: `GET http://localhost:3000/healthz`
- List: `GET http://localhost:3000/todos`
- Get by id: `GET http://localhost:3000/todos/1`
- Create: `POST http://localhost:3000/todos` JSON: `{ "title": "Task", "completed": false }`
- Update: `PUT http://localhost:3000/todos/1` JSON: `{ "title": "New", "completed": true }`
- Delete: `DELETE http://localhost:3000/todos/1`

## Notes
- Data stored in `data/todos.sqlite`
- Logs are JSON (pino). For pretty logs: `LOG_LEVEL=info` and pipe through `pino-pretty` if needed.

## Docker

API build and run

```bash
docker build -t ghcr.io/<owner>/<repo>-api:local .
docker run -p 3000:3000 -v "$PWD/data":/app/data ghcr.io/<owner>/<repo>-api:local
```

Web build and run

```bash
cd web
docker build -t ghcr.io/<owner>/<repo>-web:local .
docker run -p 3001:3001 -e NEXT_PUBLIC_API_URL="http://host.docker.internal:3000" ghcr.io/<owner>/<repo>-web:local
```

## Pull from GHCR

```bash
docker pull ghcr.io/<owner>/<repo>-api:latest
docker pull ghcr.io/<owner>/<repo>-web:latest
```
