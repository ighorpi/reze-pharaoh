FROM node:lts-alpine as base

RUN apk upgrade -U \ 
    && apk add ca-certificates ffmpeg libva-intel-driver \
    && rm -rf /var/cache/*

FROM base AS builder
WORKDIR /app
COPY package*.json .
COPY tsconfig*.json .
COPY .eslintrc.js .
COPY nest*.json .
COPY ./src .
COPY prisma ./prisma
RUN npm ci
RUN npx prisma generate
RUN npm run build
FROM base AS runner
WORKDIR /app
COPY prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci
EXPOSE 3000
ENTRYPOINT [ "npm","run"]
CMD ["start:prod"]