FROM node:24-alpine AS build

ARG DATABASE_URL=$DATABASE_URL

WORKDIR /app

COPY package-lock.json ./
COPY package.json ./
COPY prisma ./prisma
COPY tsconfig.json ./
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY src ./src
COPY public ./public

RUN npm install

RUN npx prisma generate

RUN npm run build

FROM node:24-alpine
WORKDIR /app

COPY package.json package-lock.json ./
COPY --from=build /app/.output ./.output
COPY --from=build /app/prisma ./prisma
RUN npm install --omit=dev

EXPOSE 3000

CMD ["npm", "start"]
