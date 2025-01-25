# Utilisation de l'image officielle PostgreSQL
FROM postgres:15-alpine

# Copie des scripts d'initialisation
COPY ./docker/postgres/init.sql /docker-entrypoint-initdb.d/

# Variables d'environnement par défaut
ENV POSTGRES_USER=postgres \
    POSTGRES_PASSWORD=postgres \
    POSTGRES_DB=prepa_cursor_dev

# Exposition du port
EXPOSE 5432 