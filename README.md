# spiff-arena

SpiffArena is a low(ish)-code software development platform for building, running, and monitoring executable diagrams.
It is intended to support Citizen Developers and to enhance their ability to contribute to the software development process.
Using tools that look a lot like flow-charts and spreadsheets, it is possible to capture complex rules in a way that everyone in your organization can see, understand, and directly execute.

Please visit the [SpiffWorkflow website](https://www.spiffworkflow.org) for a [Getting Started Guide](https://www.spiffworkflow.org/posts/articles/get_started/) to see how to use SpiffArena and try it out.
There are also additional articles, videos, and tutorials about SpiffArena and its components, including SpiffWorkflow, Service Connectors, and BPMN.js extensions.



## Development Setup

SpiffArena is designed to be developed entirely using Docker containers. This approach ensures a consistent development environment and eliminates the need to install dependencies directly on your machine. The project follows container-based development principles with live code changes without requiring rebuilds.

### Prerequisites

The only requirements for development are:

1. Docker
2. Docker Compose

### Getting Started

To set up a development environment:

```bash
git clone https://github.com/sartography/spiff-arena.git
cd spiff-arena
./bin/setup.sh
./bin/start.sh
```

This will:
1. Build the development Docker images
2. Install all dependencies inside the containers
3. Mount your local code directories into the containers
4. Set up proper permissions for process model directories
5. Start the development servers

You can then access the application at http://localhost:8001

### Development Workflow

With this setup, you can edit code on your local machine and see changes reflected immediately without rebuilding containers:

- Frontend changes will be automatically detected and hot-reloaded
- Backend changes will be automatically detected by the Flask development server

### Permissions

The setup and start scripts automatically ensure proper permissions for the `process_models` directory, which is used to store BPMN process definitions. This prevents errors when creating or modifying process models.

If you encounter any permission issues, you can run:

```bash
sudo chown -R $USER:$USER process_models
./bin/fix-permissions.sh
```

This script will set the correct ownership and permissions for the `process_models` directory. The permission handling is centralized in the common utilities to ensure consistent behavior across all scripts.

### Running Tests

To run tests within the Docker environment:

```bash
# Run all tests and linting
./bin/test.sh

# Run only backend tests
./bin/test.sh backend

# Run only frontend tests
./bin/test.sh frontend

# Run specific backend tests with additional arguments
./bin/test.sh backend -k test_name
```

### Authentication

The Docker setup includes a built-in OpenID server for authentication. When you access the application, you can log in with:

- Username: admin
- Password: admin

## Docker Configuration

The project uses Docker for both development and production environments. All Docker configurations are designed to mount local code into containers, allowing for live code changes without rebuilding. The project is organized to integrate all components into a cohesive development environment while maintaining a clean repository structure.

### Development vs Production Docker Files

- **Development**: Uses `dev.docker-compose.yml` and related files to mount local code and enable hot-reloading
- **Production-like**: Uses `docker-compose.yml` for a more production-like environment

### Available Docker Configurations

- `docker-compose.yml` - Standard configuration for running the full application
- `dev.docker-compose.yml` - Development configuration with volume mounts for live code changes

### Live Code Changes

The development setup is configured to detect code changes automatically:

1. Local code directories are mounted into the containers
2. Frontend uses React's development server with hot-reloading
3. Backend uses Flask's development server which reloads on code changes

This means you can edit code on your local machine and see changes immediately without rebuilding or restarting containers.

The project provides simple shell scripts for common development tasks:

| Script | Description |
|----|----|
| `./bin/setup.sh` | Builds the images, sets up the backend db and installs all dependencies |
| `./bin/start.sh` | Starts all services (or a specific service if provided as an argument) |
| `./bin/stop.sh` | Stops all services |
| `./bin/test.sh` | Runs all tests (or tests for a specific component if provided as an argument) |
| `./bin/clean.sh` | Cleans up containers, volumes, dependencies, or all of them |
| `./bin/shell.sh` | Opens a shell in a specific service container |
| `./bin/fix-permissions.sh` | Fixes permissions for process_models directory |

These scripts use shared utilities from `./bin/common.sh` to ensure consistent behavior and reduce code duplication.

## License

SpiffArena's main components are published under the terms of the
[GNU Lesser General Public License (LGPL) Version 3](https://www.gnu.org/licenses/lgpl-3.0.txt).
