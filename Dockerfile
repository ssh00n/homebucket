FROM node:20-slim

RUN apt-get update && apt-get install -y python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm install


COPY .env ./

COPY . .


RUN mkdir -p /data/db-data
RUN mkdir -p /data/storage


EXPOSE 8081

# 앱 실행
CMD ["npm", "start"]