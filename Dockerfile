# Use official Node.js LTS image
FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package*.json ./
RUN pnpm install --prod

COPY . .

# Build Next.js app for production
RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]