.PHONY: help update run run-rebuild upgrade

CONTAINER_ENGINE := $(shell command -v podman-compose >/dev/null 2>&1 && echo podman-compose || echo docker-compose)

help:
	@echo "Available commands:"
	@echo "  make update       - Fetch and pull latest changes from repository"
	@echo "  make run          - Start services in detached mode"
	@echo "  make run-rebuild  - Start services with rebuild in detached mode"
	@echo "  make upgrade      - Update, rebuild and run services"
	@echo "  make logs-api     - Follow logs for the Savy API"
	@echo "  make logs-client  - Follow logs for the Discord Client"

update:
	git fetch && git pull

run:
	podman-compose -f docker-compose.yaml up -d

run-rebuild:
	podman-compose -f docker-compose.yaml up -d --build --force-recreate

upgrade: update run-rebuild

logs-api:
	$(CONTAINER_ENGINE) logs -f savy-api

logs-client:
	$(CONTAINER_ENGINE) logs -f discord-client