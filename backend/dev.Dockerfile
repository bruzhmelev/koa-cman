FROM node:carbon

WORKDIR /app
RUN npm install -g nodemon
COPY package*.json ./
RUN npm install

EXPOSE 4000

CMD nodemon --legacy-watch --watch src ./src/index.js
