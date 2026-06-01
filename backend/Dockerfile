FROM node:20-alpine

WORKDIR /backend

COPY package*.json ./

RUN npm install

COPY . . 

ENV PORT=3000
ENV NODE_ENV="development"
ENV JWT_ACCESS_TOKEN_EXPIRES_IN = 15m
ENV JWT_REFRESH_TOKEN_EXPIRES_IN = 5d

EXPOSE 3000

CMD ["npm", "start"]
