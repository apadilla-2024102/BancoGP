FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable && corepack prepare pnpm@8.10.0 --activate && pnpm install

COPY . .

EXPOSE 3001

CMD ["pnpm", "start"]
