FROM node:16-alpine

WORKDIR /usr/src/app

RUN mkdir -p /usr/src/app/temp

COPY package.json ./
COPY tsconfig.json ./

COPY . ./

RUN npm install

CMD ["npm","run","start"]
