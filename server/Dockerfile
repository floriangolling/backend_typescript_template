FROM node:lts-slim AS builder
WORKDIR /app
COPY server ./server
COPY shared/ ./shared
WORKDIR /app/server
RUN npm clean-install
RUN npm run build

FROM node:lts-slim
WORKDIR /app
COPY server ./server
COPY shared/ ./shared
WORKDIR /app/server
RUN npm clean-install --omit=dev
COPY --from=builder /app/server/dist ./dist
EXPOSE 3000
CMD ["npm", "run", "prod"]
