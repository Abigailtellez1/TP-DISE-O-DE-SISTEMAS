FROM node:22 AS build

WORKDIR /home/node/app
RUN chown -R node:node /home/node/app

COPY package.json yarn.lock .

ARG NODE_ENV
RUN yarn install --frozen-lockfile

COPY . ./
RUN yarn run build


FROM nginx:1.28-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

COPY --from=build /home/node/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
