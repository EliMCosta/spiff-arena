# Developing with Docker Without Rebuilding

SpiffArena is configured for a seamless development experience using Docker containers with live code reloading. This means you can edit code on your local machine and see changes immediately without rebuilding containers.

## Key Benefits

1. **Instant feedback**: Changes to your code are reflected immediately in the running application
2. **No rebuild wait times**: Avoid the time-consuming process of rebuilding Docker images
3. **Consistent environment**: Everyone on the team works with the same development setup
4. **Local development**: All code remains on your local machine for easy editing with your preferred tools

## How Live Code Reloading Works

The development Docker Compose files mount your local code directories into the containers:

```yaml
services:
  spiffworkflow-frontend:
    # ...
    volumes:
      - ./spiffworkflow-frontend:/app

  spiffworkflow-backend:
    # ...
    volumes:
      - ./spiffworkflow-backend:/app

  spiffworkflow-connector:
    # ...
    volumes:
      - ./connector-proxy-demo:/app
```

This means:

- Changes to frontend code trigger React's hot-reloading mechanism
- Changes to backend code trigger Flask's development server to reload
- All changes are immediately available in the running application

## Development Workflow

The recommended workflow for development is:

1. Start the development environment: `make dev-env && make start-dev`
2. Edit code files on your local machine with your preferred editor/IDE
3. See changes reflected immediately in the running application
4. Run tests as needed: `make be-tests-par` or `make run-pyl`

No container rebuilding or restarting is necessary for most code changes!

## When Rebuilding Is Necessary

You only need to rebuild containers in specific cases:

1. When changing dependencies (package.json, pyproject.toml, etc.)
2. When modifying Dockerfiles or Docker Compose configurations
3. When installing new system packages

In these cases, run:

```bash
# For dependency changes
make dev-env

# For Docker configuration changes
docker compose -f docker-compose.yml \
  -f spiffworkflow-backend/dev.docker-compose.yml \
  -f spiffworkflow-frontend/dev.docker-compose.yml \
  -f connector-proxy-demo/dev.docker-compose.yml \
  -f dev.docker-compose.yml \
  build
```

## Troubleshooting

If you encounter issues with live code reloading:

1. Verify that volume mounts are working correctly: `docker compose exec spiffworkflow-backend ls -la /app`
2. Check that development servers are running in watch mode
3. For frontend issues, check the browser console for errors
4. For backend issues, check the container logs: `docker logs spiffworkflow-backend`
5. Try restarting the containers: `make stop-dev && make start-dev`

```{tags} how_to_guide, dev_docs
```
