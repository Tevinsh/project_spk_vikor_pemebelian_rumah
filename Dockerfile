FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install --save mysql2

COPY . .

CMD ["node","app.js"]
