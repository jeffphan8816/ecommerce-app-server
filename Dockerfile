FROM node:16-alpine
# Installing libvips-dev for sharp Compatibility
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY package.json package-lock.json ./
RUN npm config set network-timeout 600000 -g && npm install
ENV PATH /opt/node_modules/.bin:$PATH

WORKDIR /opt/app
COPY . .

# Set the environment variables for PostgreSQL connection
ENV DATABASE_CLIENT=postgres
ENV DATABASE_HOST=strapi.c1dbui73ptva.us-west-1.rds.amazonaws.com
ENV DATABASE_PORT=5432
ENV DATABASE_NAME=strapi
ENV DATABASE_USERNAME=postgres
ENV DATABASE_PASSWORD=swimming123
RUN chown -R node:node /opt/app

RUN npm install pm2 -g

USER node
RUN ["npm", "run", "build"]

EXPOSE 1338

CMD ["pm2-runtime", "npm", "--", "run", "develop"]