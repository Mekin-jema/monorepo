<div align="center">

# E‑commerce Monorepo

Next.js apps + Node microservices + Prisma + Kafka — all in one Turborepo.

</div>

## Overview

This monorepo hosts a small e‑commerce platform composed of two Next.js apps (Admin and Client) and three backend services (Product, Order, Payment). Shared packages provide database access, authentication helpers, Kafka client utilities, and common configs. Development is orchestrated with pnpm and Turborepo, and local infra (Postgres, MongoDB, Kafka) is provided via Docker Compose.

Highlights
- Monorepo tooling: Turborepo + pnpm workspaces
- Frontend: Next.js 15, React 19, Tailwind CSS 4
- Backend: Express (Product), Fastify (Order), Hono (Payment)
- Data: Prisma clients for Auth/Postgres, Product, Order; MongoDB replicaset; SQLite (optional)
- Messaging: Kafka cluster (3 brokers) + Kafka UI

## Repository layout

```
apps/
	admin/            # Next.js Admin app (port 3000)
	client/           # Next.js Client app (port 3001)
	product-service/  # Express service (port 3002)
	order-service/    # Fastify service (port 3003)
	payment-service/  # Hono service (port 3004)
packages/
	db/               # Prisma clients, schema, seeds (auth/product/order)
	auth/             # Auth helpers (server & client)
	kafka/            # KafkaJS wrapper utilities
	ui/               # Shared UI components (if used)
	types/            # Shared types
	eslint-config/    # Shared ESLint configs
	typescript-config/# Shared TSConfigs
```

See also: `docker-compose.yml`, `turbo.json`, `pnpm-workspace.yaml` in the repo root.

## Tech stack

- Next.js, React, Tailwind CSS
- Node.js (Express, Fastify, Hono)
- Prisma, PostgreSQL, MongoDB, SQLite
- Kafka (KafkaJS), Kafka UI
- Turborepo, pnpm, TypeScript

## Architecture (high‑level)

```
[Client (Next.js)] ─┐                 ┌─> [Kafka UI]
										├─> [API services]┼─> [Kafka (3 brokers)]
[Admin (Next.js)] ──┘                 │
																			├─> [PostgreSQL]
																			└─> [MongoDB RS]

API services:
	- product-service (Express)
	- order-service (Fastify)
	- payment-service (Hono)

Shared packages:
	- @repo/db (Prisma for auth/product/order)
	- @repo/auth, @repo/kafka, @repo/ui, @repo/types
```

## Getting started

Prerequisites
- Node.js >= 18
- pnpm >= 9
- Docker (optional but recommended for local DBs/Kafka)

Setup
1) Install dependencies
	 - pnpm install
2) Configure environment
	 - cp .env.example .env
	 - Adjust values as needed (ports, secrets, OAuth keys)
3) Start infra (databases, Kafka) in Docker
	 - pnpm run docker:up:build
	 - Kafka UI at http://localhost:8080; Postgres at localhost:5432; Mongo at localhost:27017
4) Generate Prisma clients
	 - pnpm -F @repo/db generate
5) Migrate or deploy Prisma schemas
	 - Dev migrations: pnpm -F @repo/db migrate
	 - Deploy (CI/prod style): pnpm -F @repo/db deploy
6) Seed sample data (optional)
	 - pnpm -F @repo/db seedsall

Run everything (all apps/services)
- pnpm dev  (runs "turbo run dev" across the workspace)

Run a single target
- Admin app: pnpm --filter ./apps/admin dev  (http://localhost:3000)
- Client app: pnpm --filter ./apps/client dev (http://localhost:3001)
- Product service: pnpm --filter ./apps/product-service dev (http://localhost:3002)
- Order service: pnpm --filter ./apps/order-service dev   (http://localhost:3003)
- Payment service: pnpm --filter ./apps/payment-service dev (http://localhost:3004)

## Environment variables

Environment is shared via Turborepo (see `turbo.json > globalEnv`). Copy `.env.example` and tweak as needed.

Core DB URLs
- DATABASE_URL_POSTGRES: Postgres (auth) — matches docker-compose
- DATABASE_URL_MONGO: MongoDB replica set (authSource=admin, replicaSet=rs0)
- DATABASE_URL_SQLITE: Optional SQLite file for local/testing

Frontend/base URLs
- NEXT_PUBLIC_BASE_URL, NEXT_PUBLIC_API_URL, APP1_URL, APP2_URL

OAuth/Email/Storage
- GITHUB_CLIENT_ID/SECRET, GOOGLE_CLIENT_ID/SECRET
- EMAIL_USER/EMAIL_PASS
- CLOUDINARY_URL, NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL, NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

Analytics/Security/Payments
- NEXT_PUBLIC_POSTHOG_KEY, ARCJET_KEY, CHAPA_SECRET_KEY

Auth
- BETTER_AUTH_SECRET, BETTER_AUTH_URL

See `.env.example` for working local defaults.

## Services

- apps/admin (Next.js, port 3000)
	- Admin dashboard UI
	- README: `apps/admin/README.md`

- apps/client (Next.js, port 3001)
	- Storefront UI
	- README: `apps/client/README.md`

- apps/product-service (Express, port 3002)
	- Product catalog (CRUD, categories, inventory sync, Kafka events)

- apps/order-service (Fastify, port 3003)
	- Order management (checkout, status, Kafka consumers)

- apps/payment-service (Hono, port 3004)
	- Payment endpoints/simulation

## Packages

- @repo/db
	- Prisma clients for: auth (Postgres/Mongo), product, order
	- Commands: `generate`, `migrate` (auth/order), `deploy` (auth/product/order), `studio:*`, `seeds:*`, `seedsall`

- @repo/auth
	- Shared auth server/client helpers built on better-auth

- @repo/kafka
	- KafkaJS utilities for producing/consuming

- @repo/ui, @repo/types, @repo/eslint-config, @repo/typescript-config
	- Shared UI, types, lint, and TSConfigs across the monorepo

## Local infrastructure (Docker)

`docker-compose.yml` starts:
- PostgreSQL 16 (user: postgres_user, pass: postgres_pass, db: authdb)
- MongoDB 7 with replica set (user: mongo_user, pass: mongo_pass, db: mongotest)
- Kafka cluster (3 brokers) + Kafka UI on :8080
- Portainer (optional) on :9000

Useful root scripts
- pnpm run docker:up       # docker-compose up
- pnpm run docker:up:build # docker-compose up -d --build

## Prisma quick reference

From repo root (workspace filter):
- Generate: pnpm -F @repo/db generate
- Dev migrate: pnpm -F @repo/db migrate
- Deploy migrations: pnpm -F @repo/db deploy
- Open Studio: pnpm -F @repo/db studio  (auth:5554, product:5556, order:5557)
- Seed all: pnpm -F @repo/db seedsall

Note: The `migrate` script currently applies for auth/order schemas. Product uses `deploy` (check `packages/db/package.json`).

## Troubleshooting

- Prisma generate/migrate fails
	- Ensure `.env` exists and DB URLs are correct
	- If using Docker, wait a few seconds after `docker:up:build` for DBs to be ready
	- Mongo needs replica set initiated (handled by `mongo-init-replica` service)

- Ports already in use
	- Admin 3000, Client 3001, Product 3002, Order 3003, Payment 3004, Kafka UI 8080, Portainer 9000

- Kafka not reachable from services
	- Use internal broker names when running in Docker network; for local dev from host, use advertised listeners on 9094/9095/9096 (see compose)

## Contributing

- Use pnpm and Node >= 18
- Keep packages typed: `pnpm run check-types`
- Lint: `pnpm run lint`
- Prefer shared configs from `packages/*`

---

Happy hacking! If you spot gaps or have ideas, open a PR or issue.

