FROM node:20
RUN apt-get update
RUN apt-get install nano
ARG DISABLE_CACHE
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm install --production
EXPOSE 3000
CMD ["npm", "run", "start"]