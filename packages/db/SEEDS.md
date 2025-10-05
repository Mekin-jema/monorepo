# Database Seeds

This package contains seed scripts for the database schemas used in this monorepo.

Files:

- `prisma/seeds/sqliteSeed.ts` - seeds the `Cache` model (SQLite datasource)
- `prisma/seeds/mongoSeed.ts` - seeds the `ActivityLog` model (Mongo datasource)
- `prisma/seeds/postgresSeed.ts` - seeds the `User`, `Account`, and `Session` models (Postgres datasource)
- `prisma/seeds/runAllSeeds.mjs` - JS runner that executes all three seeds in order

Environment variables required:

- `DATABASE_URL_SQLITE` - e.g. `file:./dev.db` (sqlite schema)
- `DATABASE_URL_MONGO` - MongoDB connection string
- `DATABASE_URL_POSTGRES` - Postgres connection string

Run individiual seeds:

```fish
cd packages/db
pnpm run seeds:sqlite
pnpm run seeds:mongo
pnpm run seeds:postgres
```

Run all seeds with the JS runner (recommended to avoid ts type-check issues):

```fish
cd packages/db/prisma/seeds
node runAllSeeds.mjs
```
