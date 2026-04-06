FROM node:20-slim

RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install root package (schemas, validators, prompts)
COPY package.json package-lock.json ./
RUN npm ci --production

COPY index.js ./
COPY schemas/ ./schemas/
COPY validators/ ./validators/
COPY prompts/ ./prompts/

# Install and build SvelteKit app
WORKDIR /app/server
COPY server/package.json server/package-lock.json* ./
RUN npm ci
COPY server/ ./
RUN npm run build

WORKDIR /app
EXPOSE 3000

ENV PORT=3000
ENV HOST=0.0.0.0

CMD ["node", "server/build/index.js"]
