FROM postgres:17.4-alpine3.20

COPY ./scripts/init.sql /docker-entrypoint-initdb.d/init.sql

CMD ["docker-entrypoint.sh", "postgres"]