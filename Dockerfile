FROM node:16-alpine

WORKDIR /usr/src/app

RUN mkdir -p /usr/src/app/temp

COPY . ./

RUN npm install

ENV PORT=8080

EXPOSE ${PORT}

CMD ["npm","run","start"]
