FROM node:14-alpine as BUILD

ARG BASE_URL
ENV BASE_URL=${BASE_URL}

ARG MAP_KEY
ENV MAP_KEY=${MAP_KEY}

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build:prod

FROM nginx:1.21-alpine
COPY --from=BUILD  /app/dist/sima /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
