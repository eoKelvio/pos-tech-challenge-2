FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

RUN npx prisma generate

COPY . .

RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app

RUN npm install -g prisma

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

COPY --from=builder /app/dist ./dist

COPY prisma ./prisma

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
USER nestjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/main.js || exit 1

CMD ["npm", "run", "start:prod"]