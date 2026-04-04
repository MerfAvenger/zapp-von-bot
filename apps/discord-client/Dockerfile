FROM docker.io/library/node:lts-alpine AS base


FROM base AS prepare

WORKDIR /

RUN corepack prepare pnpm@10 --activate
RUN corepack enable pnpm


FROM prepare AS build

WORKDIR /build

COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY apps/discord-client/package.json ./apps/discord-client/package.json

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile

COPY apps/discord-client/ ./apps/discord-client/

RUN pnpm -r --filter discord-client... build
RUN pnpm deploy --filter=discord-client --prod /apps/discord-client


FROM base AS discord-client

WORKDIR /apps/discord-client

ARG PORT=8083

RUN addgroup nodegroup --system --gid 101
RUN adduser nodeuser --ingroup nodegroup --system --uid 101

# Create runtime directory with correct permissions
RUN mkdir -p /apps/discord-client/runtime && \
    chown -R 101:101 /apps/discord-client/runtime

USER 101:101

COPY --from=build /apps/discord-client .

EXPOSE ${PORT}

CMD ["node", "dist/app.js"]