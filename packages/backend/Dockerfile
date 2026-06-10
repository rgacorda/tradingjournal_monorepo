FROM node:20-alpine

WORKDIR /app

COPY package.json turbo.json ./
COPY packages/backend/package.json ./packages/backend/
COPY packages/frontend/package.json ./packages/frontend/

RUN npm install --workspace=backend --omit=dev

COPY packages/backend ./packages/backend

RUN mkdir -p packages/backend/uploads/trades

ENV NODE_ENV=production
EXPOSE 8000

WORKDIR /app/packages/backend
CMD ["node", "app.js"]
