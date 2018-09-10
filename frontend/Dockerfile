FROM node:carbon

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY tslint.json ./

RUN npm install

COPY src /app/src
COPY public /app/public

EXPOSE 4000

CMD [ "npm", "start" ]