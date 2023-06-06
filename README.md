# 🚀 Getting started with E-commerce App - API Server

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-develop)

```
npm run develop
# or
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-build)

```
npm run build
# or
yarn build
```

## ⚙️ Deployment - Docker compose 
You should clone this repository & the Client repository on your server and put them together in the same directory. Move the docker-compose.yml file to the root directory and run the following command:

    $ docker-compose up -d

Example directory structure:
```
├── e-commerce-app
│   ├── client
│   ├── server
│   └── docker-compose.yml
```
### P/s: You can adjust the API port in the docker-compose.yml and server/config/server.js file. However, you should update the API port in the client app too.