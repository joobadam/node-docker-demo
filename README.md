# 🚀 DevOps Portfolio: Node.js Todo App + Docker + GHCR + GitHub Actions

> This project demonstrates end‑to‑end DevOps skills by building a small Todo application and shipping it as Docker images to GitHub Container Registry (GHCR) using a GitHub Actions CI workflow.

[![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
  - [What This Shows About You](#-what-this-shows-about-you)
  - [Tech Stack](#-tech-stack)
  - [Repository Layout](#-repository-layout)
- [Getting Started](#-getting-started)
  - [Prerequisites](#-prerequisites)
  - [Local Development](#-local-development)
  - [Docker Usage](#-docker-usage)
  - [CI/CD to GHCR](#-cicd-to-ghcr)
- [API Reference](#-api-reference)
- [Security & Hardening](#-security--hardening)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 🎯 About The Project

This project demonstrates end‑to‑end DevOps skills by building a small Todo application and shipping it as Docker images to GitHub Container Registry (GHCR) using a GitHub Actions CI workflow.

**Key Features:**
- ✅ Full-stack Todo application (Node.js API + Next.js UI)
- ✅ Docker containerization with best practices
- ✅ Automated CI/CD pipeline with GitHub Actions
- ✅ Container registry integration (GHCR)
- ✅ Production-ready security configurations

### 💪 What This Shows About You

- 🎨 You can design a simple full‑stack app (Node.js API + Next.js UI)
- 🐳 You can containerize apps with Docker (multi‑stage, non‑root, HEALTHCHECK, volumes)
- 📦 You can publish images to a registry (GHCR) with proper tagging
- 🤖 You can automate builds and pushes with GitHub Actions

### 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| 🔙 **Backend API** | Node.js (Express), better‑sqlite3, pino |
| 💾 **Database** | SQLite (embedded, persisted to volume) |
| 🎨 **Frontend UI** | Next.js (App Router), Tailwind CSS, shadcn/ui |
| 🔄 **CI/CD** | GitHub Actions → GitHub Container Registry (GHCR) |
| 🐳 **Runtime** | Docker (local dev and test) |

### 📁 Repository Layout

```
node-docker-demo/
├── src/                    # Express API (todos CRUD)
├── web/                    # Next.js UI (consumes the API)
├── Dockerfile              # Backend image
├── web/Dockerfile          # Frontend image
└── .github/workflows/
    └── ci.yml              # CI for build + push to GHCR
```

---

## 🚀 Getting Started

### 📦 Prerequisites

Before you begin, ensure you have the following:

- 📦 Node.js 20+
- 🐳 Docker Desktop
- 🐙 GitHub account + repository permissions (to push packages to GHCR)

### 💻 Local Development

#### Backend (port 3000)

```bash
npm install
npm run dev     # or: npm start

# Healthcheck
curl -s http://localhost:3000/healthz | jq .
```

#### Frontend (port 3001)

```bash
cd web
npm install
PORT=3001 npm run dev

# Open http://localhost:3001
```

> 💡 **Note**: The UI calls the API at `http://localhost:3000` by default. To change it, set `NEXT_PUBLIC_API_URL`.

### 🐳 Docker Usage

#### Build Images

```bash
# API
docker build -t ghcr.io/<owner>/<repo>-api:local .

# Web
cd web
docker build -t ghcr.io/<owner>/<repo>-web:local .
```

#### Run Containers

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

#### Healthcheck

```bash
curl -sI http://localhost:3000/healthz
curl -sI http://localhost:3001
```

#### Free Ports (macOS)

If ports 3000/3001 are already in use:

```bash
lsof -ti:3000,3001 | xargs -r kill -9
```

### 🔄 CI/CD to GHCR

**Workflow**: `.github/workflows/ci.yml`

**Triggers:**
- 🤖 **push to main** → build and push images
- 🏷️ **tags v*** → also create version tags
- 🔍 **pull_request** → build only (no push)

**Images pushed:**
- `ghcr.io/<owner>/<repo>-api:latest`, `sha-<SHORT_SHA>`, `vX.Y.Z`
- `ghcr.io/<owner>/<repo>-web:latest`, `sha-<SHORT_SHA>`, `vX.Y.Z`

**Auth**: uses GitHub‑provided `GITHUB_TOKEN`

#### Pull and Run from GHCR

```bash
docker pull ghcr.io/<owner>/<repo>-api:latest
docker pull ghcr.io/<owner>/<repo>-web:latest

docker run -d -p 3000:3000 -v "${PWD}/data":/app/data ghcr.io/<owner>/<repo>-api:latest
docker run -d -p 3001:3001 -e NEXT_PUBLIC_API_URL="http://host.docker.internal:3000" ghcr.io/<owner>/<repo>-web:latest
```

---

## 📡 API Reference

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `GET` | `/healthz` | Health check | `{ status: "ok" }` |
| `GET` | `/todos` | List all todos | Array of todos |
| `GET` | `/todos/:id` | Get one todo | Todo object |
| `POST` | `/todos` | Create todo | `{ title, completed }` → 201 created |
| `PUT` | `/todos/:id` | Update todo | `{ title?, completed? }` → 200 updated |
| `DELETE` | `/todos/:id` | Delete todo | 204 no content |

### Example Usage

```bash
# List todos
curl -s http://localhost:3000/todos | jq .

# Create todo
curl -s -X POST http://localhost:3000/todos \
  -H 'Content-Type: application/json' \
  -d '{"title":"Learn Docker","completed":false}' | jq .
```

---

## 🔒 Security & Hardening

This project implements several security best practices:

- ✅ **Non‑root user** in both images
- ✅ **HEALTHCHECK** in API image
- ✅ **Minimal base image** (Debian slim) + multi‑stage builds
- ✅ **SQLite file persisted** via volume (`/app/data`)

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| 🚫 Ports 3000/3001 already in use | Free ports (see [Free Ports](#-docker-usage) section) |
| 🔄 Next.js dev server still using 3001 | Ensure `PORT` is set; restart dev server |
| 🐳 Docker cannot connect to daemon | Start Docker Desktop |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information.

---

## 🇭🇺 Hungarian Recap (Rövid összefoglaló)

- Ez a projekt egy Todo alkalmazást készít (Express + SQLite + Next.js)
- Dockerrel konténerizáljuk az API‑t és a Web UI‑t
- GitHub Actions workflow automatikusan buildel és pushol a GHCR‑be (`latest`, `sha-<rövid_sha>`, `vX.Y.Z`)
- Helyi futtatás: API 3000‑en, Web 3001‑en; a UI az API‑t a `NEXT_PUBLIC_API_URL` segítségével éri el

---

<p align="right">(<a href="#-devops-portfolio-nodejs-todo-app--docker--ghcr--github-actions">back to top</a>)</p>
