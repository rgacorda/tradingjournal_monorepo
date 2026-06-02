FROM node:20-alpine AS base

WORKDIR /app

# Install workspace dependencies (backend only)
COPY package.json turbo.json ./
COPY packages/backend/package.json packages/backend/
COPY packages/frontend/package.json packages/frontend/

RUN npm install --workspace=backend --omit=dev

COPY packages/backend packages/backend

WORKDIR /app/packages/backend

RUN mkdir -p uploads/trades

ENV NODE_ENV=production
EXPOSE 8000

CMD ["node", "app.js"]
