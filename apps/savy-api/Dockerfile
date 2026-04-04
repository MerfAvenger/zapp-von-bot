FROM docker.io/library/node:lts-alpine AS base


FROM base AS prepare

WORKDIR /

RUN corepack prepare pnpm@10 --activate
RUN corepack enable pnpm


FROM prepare AS build

# Use the monorepo application directory.
WORKDIR /build

COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/logger/package.json ./packages/logger/
COPY packages/model/package.json ./packages/model/
COPY apps/discord-client/package.json ./apps/discord-client/

# Install dependencies first (before context copy) to leverage Docker cache.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts

COPY . .
RUN pnpm -r --filter './packages/**' build
RUN pnpm -r build

RUN pnpm deploy --filter=savy-api --prod /apps/savy-api


FROM base AS savy-api

WORKDIR /apps/savy-api

ARG PORT=8080

RUN addgroup nodegroup --system --gid 101
RUN adduser nodeuser --ingroup nodegroup --system --uid 101

USER 101:101

COPY --from=build /apps/savy-api .

EXPOSE ${PORT}

CMD ["node", "dist/app.js"]
