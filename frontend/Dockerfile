FROM node:20-alpine

WORKDIR /app
copy package*.json ./

RUN npm install

COPY . .

ENV NEXT_TELEMENTRY_DISABLED 1

EXPOSE 3000

RUN npm run build

CMD ["npm", "start"]