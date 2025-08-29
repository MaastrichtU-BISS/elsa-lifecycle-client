FROM node:24-bookworm

RUN apt update && apt upgrade -y

WORKDIR /app
COPY . .

RUN npm install -g pnpm@latest-10

RUN pnpm i
RUN pnpm build

# run as webservice based on Server-Side Rendering of .output folder
EXPOSE 3000
CMD ["node", "server/index.mjs"]