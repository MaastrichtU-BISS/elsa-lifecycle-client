FROM node:24-bookworm

RUN apt update && apt upgrade -y

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# run as webservice based on Server-Side Rendering of .output folder
EXPOSE 3000
CMD ["node", "server/index.mjs"]