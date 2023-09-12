FROM node:18-alpine

WORKDIR /app/backend

COPY package*.json ./

RUN npm install

RUN npm install -g nodemon

COPY . .

EXPOSE 4040

CMD ["nodemon", "index.js"]