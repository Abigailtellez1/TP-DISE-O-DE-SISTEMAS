FROM node:lts AS build

WORKDIR /home/node/app
RUN chown -R node:node /home/node/app

COPY package.json .

ARG NODE_ENV
RUN yarn install

COPY . ./
RUN yarn run build


FROM nginx:stable

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

COPY --from=build /home/node/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
