# DEVELOPMENT BUILD
FROM node:19.4-alpine AS development
WORKDIR /server/app
COPY package.json ./
COPY yarn.lock ./
COPY prisma ./prisma/
COPY ./ ./
RUN yarn install --production=false
RUN yarn build

FROM node:19.4-alpine AS production
WORKDIR /server/app
COPY package.json ./
COPY yarn.lock ./
COPY prisma ./prisma/
RUN yarn install --production=true
RUN npx prisma generate
COPY ./ ./
COPY --from=development /server/app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/src/main"]