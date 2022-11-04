FROM node:18.12-alpine

WORKDIR /app

# nodemon все равно установился в package-lock, странно
ARG NODE_ENV=production

COPY package*.json ./
COPY src/ ./

# Наверное такое себе решение, но еще вчера он не ругался, что вышла новая версия нпм
RUN npm install -g npm@8.19.3
RUN npm i

EXPOSE 3001

CMD [ "node", "index.js" ]
