FROM node:24-bookworm

WORKDIR /app
COPY . .

RUN npm install -g pnpm@latest-10

RUN pnpm i
RUN pnpm build

# run as webservice based on Server-Side Rendering of .output folder
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]