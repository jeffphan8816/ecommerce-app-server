FROM node:14

WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . .

# ENV BE_ENV=${BE_ENV}

ENV PORT=1338

EXPOSE 1338

CMD ["npm", "start"]