FROM node:lts-alpine3.20 AS base


FROM base AS prepare

WORKDIR /

RUN corepack prepare pnpm@latest --activate
RUN corepack enable pnpm

FROM prepare AS builder

# Use the monorepo application directory.
WORKDIR /build

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm -r build

RUN pnpm deploy --filter=savy-api --prod /apps/savy-api

FROM base AS savy-api

WORKDIR /apps/savy-api

ARG PORT=3000

RUN addgroup nodegroup --system --gid 101
RUN adduser nodeuser --ingroup nodegroup --system --uid 101

USER 101:101

COPY --from=builder /apps/savy-api .

CMD ["node", "dist/app.js"]