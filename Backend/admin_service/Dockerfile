FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=4043

EXPOSE 4043

CMD ["npm","start"]