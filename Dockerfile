FROM node:16.13.1-alpine as build

ADD . /home
WORKDIR /home

RUN npm install -g npm@8.5.3
RUN cd root-app && npm install && npm run build

FROM nginx

CMD [ "npm", "start"]

# COPY --from=build /home/root-app/build /usr/share/nginx/html/

# COPY default.conf.template /etc/nginx/conf.d/default.conf.template
# COPY nginx.conf /etc/nginx/nginx.conf
# COPY /home/root-app/build/ /usr/share/nginx/html

# CMD /bin/bash -c "envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'
