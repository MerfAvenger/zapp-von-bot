FROM docker.io/library/postgres:17-alpine3.21

COPY ./scripts/init.sql /docker-entrypoint-initdb.d/init.sql

CMD ["docker-entrypoint.sh", "postgres"]