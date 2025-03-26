FROM node:lts-slim AS builder
WORKDIR /app
COPY server ./server
WORKDIR /app/server
RUN npm clean-install
RUN npm run build

FROM node:lts-slim
WORKDIR /app
COPY server ./server
WORKDIR /app/server
RUN npm clean-install --omit=dev
COPY --from=builder /app/server/dist ./dist
CMD ["npm", "run", "start"]
