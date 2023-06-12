FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY build/ .

EXPOSE 4000

CMD [ "node", "index.js" ]