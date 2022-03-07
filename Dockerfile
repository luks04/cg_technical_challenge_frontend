FROM node:16.13.1-alpine as build

ADD . /home
WORKDIR /home

RUN cd root-app && npm install && npm run build

FROM nginx

COPY --from=build /home/root-app/build/ /usr/share/nginx/html/
