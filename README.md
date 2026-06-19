# Olfactory Fragrance - Backend

REST API for the Olfactory Fragrance e-commerce platform, built with Node.js, Express, TypeScript, and Prisma ORM, deployed to AWS EKS via Jenkins CI/CD.

## Stack
- Node.js 20 + Express + TypeScript
- Prisma ORM 7 (with `@prisma/adapter-pg` driver adapter)
- Supabase PostgreSQL (pooled connection)
- Vitest (mocked unit tests - no live DB dependency in CI)
- Docker (multi-stage build)
- Helm chart for Kubernetes deployment

## API
- `GET /api/health`
- `GET /api/fragrances?family=woody&isBestseller=true&isNew=false`
- `GET /api/fragrances/:slug`
- `GET /api/discovery-sets`
- `GET /api/discovery-sets/:slug`
- `GET /api/articles?category=essay`
- `GET /api/articles/:slug`
- `POST /api/promos/validate`
- `POST /api/orders`

## Local Development
```bash
npm install
npx prisma generate
npm run dev
```

## Testing
Unit tests mock the Prisma client at the module boundary. no live database connection required:
```bash
npm test
```


## Infrastructure
Deployed on AWS EKS (private subnets, NAT Gateway egress) via Jenkins CI/CD. See infrastructure repo:
https://github.com/qezman/Terraform-EKS-Helm-Jenkins

<!-- ## Live
- App: https://qossim005.online
- Health check: https://qossim005.online/api/health -->