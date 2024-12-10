FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=50051

EXPOSE 50051

CMD ["npm","start"]