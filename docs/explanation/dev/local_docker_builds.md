# Using Local Code for Docker Builds

SpiffArena is configured to always build and run using local code instead of pulling pre-built images from a registry. This approach offers several advantages:

1. **Always up-to-date**: You're always working with the latest code from your local repository
2. **Local modifications**: You can make changes to the code and see them reflected in the running application
3. **Offline development**: You can develop without needing to pull images from external registries
4. **Consistent environment**: Everyone on the team works with the same build process

## How It Works

The `docker-compose.yml` file is configured to build images from local directories instead of pulling them from a registry:

```yaml
services:
  spiffworkflow-frontend:
    container_name: spiffworkflow-frontend
    build:
      context: ./spiffworkflow-frontend
      dockerfile: Dockerfile
    # ...

  spiffworkflow-backend:
    container_name: spiffworkflow-backend
    build:
      context: ./spiffworkflow-backend
      dockerfile: Dockerfile
    # ...

  spiffworkflow-connector:
    container_name: spiffworkflow-connector
    build:
      context: ./connector-proxy-demo
      dockerfile: Dockerfile
    # ...
```

## Running with Local Builds

To run the application with local builds:

```bash
# Clone the repository
git clone https://github.com/sartography/spiff-arena.git
cd spiff-arena

# Build and run the containers
docker compose build
docker compose up
```

You can also use the provided script:

```bash
./bin/run_arena_with_docker_compose
```

Or use the make command for a more comprehensive development setup:

```bash
make
```

## Development Workflow

When working with local Docker builds:

1. Make changes to the code in your local repository
2. Rebuild the containers with `docker compose build`
3. Restart the containers with `docker compose up`

For a more streamlined development experience, you can use the development Docker Compose files and the Makefile:

```bash
# Set up the development environment
make dev-env

# Start the development servers
make start-dev

# Stop the development servers
make stop-dev
```

## Troubleshooting

If you encounter issues with the local builds:

1. Make sure you have the latest version of Docker and Docker Compose installed
2. Check that all required files are present in your local repository
3. Try cleaning the Docker cache with `docker system prune`
4. Ensure you have sufficient disk space for building the images

```{tags} how_to_guide, dev_docs
```
