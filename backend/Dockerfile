FROM node:18-alpine

RUN npm install nodemon -g

WORKDIR /app/backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4040

CMD ["nodemon", "index.js"]
