FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]



FROM node:boron

WORKDIR /usr/src/app

COPY package.json /usr/src/app

COPY package-lock.json /usr/src/app

RUN npm install

RUN npm install pm2 -g

COPY . /usr/src/app

EXPOSE 3000

CMD ["pm2-docker", "start", "process.json"]