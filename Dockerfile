# Étape de construction de l'application
FROM node:22.14-slim as builder
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Installation des dépendances
COPY package.json package-lock.json ./

RUN npm ci

# Copie des fichiers de l'application
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

# Exécution des commandes Prisma
RUN npx prisma generate
# RUN npx prisma migrate deploy
RUN npx prisma db push
# RUN npx prisma db seed

# Build de l'application
RUN npm run build

# Étape d'exécution
FROM node:22.14-slim as runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Librairies runtime utiles pour Prisma
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Copie des fichiers de l'étape de construction
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Exposition du port
EXPOSE 3000

# Démarrage de l'application
CMD ["node", "server.js"]
