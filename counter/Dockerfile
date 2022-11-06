FROM node:18.12-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY /src ./

EXPOSE 3001

CMD [ "node", "index.js" ]