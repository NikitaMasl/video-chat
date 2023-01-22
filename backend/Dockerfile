FROM node:18-alpine3.16

RUN apk add git

RUN rm -rf /var/cache/apk/*

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN npm ci

COPY . /app

RUN npm run build

ENTRYPOINT ["npm", "start"]
