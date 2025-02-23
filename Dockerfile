FROM node:20-slim

RUN apt-get update && apt-get install -y python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm install


COPY .env ./

COPY . .


RUN mkdir -p db
RUN mkdir -p storage


EXPOSE 8081

# 앱 실행
CMD ["npm", "start"]