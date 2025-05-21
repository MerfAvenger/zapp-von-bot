FROM node:lts-alpine3.20 AS base


FROM base AS prepare

WORKDIR /

RUN corepack prepare pnpm@latest --activate
RUN corepack enable pnpm

COPY . .


FROM prepare AS builder

WORKDIR /

RUN pnpm install --frozen-lockfile
RUN pnpm build


FROM prepare AS post-installer

WORKDIR /

COPY --from=builder package.json .
COPY --from=builder pnpm-lock.yaml .

RUN pnpm install --prod --frozen-lockfile


FROM base AS run

WORKDIR /

ARG PORT=3000

RUN addgroup nodegroup --system --gid 101
RUN adduser nodeuser --ingroup nodegroup --system --uid 101

USER 101:101

COPY --from=post-installer . .
COPY --from=builder /dist app

CMD ["node", "app/app.js"]