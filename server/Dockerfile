FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production
COPY . .
RUN mkdir -p logs
RUN chown -R node:node /app
USER node
EXPOSE 5000
CMD ["node", "src/server.js"]

