# Olfactory Fragrance Backend

Express API for the Olfactory fragrance storefront.

## Scripts

- `npm run dev` starts the API with `tsx`.
- `npm run build` compiles TypeScript to `dist`.
- `npm start` runs the compiled server.
- `npm test` runs the Vitest suite.
- `npm run lint` type-checks the codebase.

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
