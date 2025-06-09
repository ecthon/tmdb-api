# Etapa 1: build da aplicação
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: imagem final
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/swagger.json ./swagger.json
COPY --from=build /app/node_modules ./node_modules

# Copia o .env se existir (opcional, pode ser montado via volume)
# COPY .env .

EXPOSE 3333
CMD ["node", "dist/index.js"] 