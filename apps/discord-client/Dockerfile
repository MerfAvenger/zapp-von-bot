FROM node:lts-alpine3.20 AS base


FROM base AS prepare

WORKDIR /

RUN corepack prepare pnpm@latest --activate
RUN corepack enable pnpm


FROM prepare AS build

WORKDIR /build

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm -r build

RUN pnpm deploy --filter=discord-client --prod /apps/discord-client


FROM base AS discord-client

WORKDIR /apps/discord-client

ARG PORT=8083

RUN addgroup nodegroup --system --gid 101
RUN adduser nodeuser --ingroup nodegroup --system --uid 101

USER 101:101

COPY --from=build /apps/discord-client .

EXPOSE ${PORT}

CMD ["node", "dist/app.js"]