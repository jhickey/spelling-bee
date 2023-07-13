FROM --platform=linux/amd64 node:19-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm i
COPY . .
RUN npm run build
EXPOSE 3000

CMD npm start
