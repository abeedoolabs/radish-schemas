FROM node:20-slim

RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --production

COPY index.js ./
COPY schemas/ ./schemas/
COPY validators/ ./validators/
COPY prompts/ ./prompts/
COPY server/ ./server/

EXPOSE 3000

CMD ["node", "server/index.js"]
