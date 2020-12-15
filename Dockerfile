FROM node:14.15.1-alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY ./src ./src

RUN npm prune --production

USER node

EXPOSE 4000

CMD [ "node", "./src/server.js" ]
