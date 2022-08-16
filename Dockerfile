FROM node:16-alpine

WORKDIR /app

COPY package.json .

RUN npm install --only-prod

COPY /dist ./dist

EXPOSE 5000

ENTRYPOINT [ "npm", "start" ]
