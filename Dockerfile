FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN ls -al
RUN npm install
COPY . .
RUN npm run build
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "start"]
