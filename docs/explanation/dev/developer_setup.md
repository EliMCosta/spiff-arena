# Developer Setup

SpiffArena is designed to be developed entirely using Docker containers. This approach ensures a consistent development environment and eliminates the need to install dependencies directly on your machine.

## Prerequisites

The only requirements for development are:

1. Docker
2. Docker Compose

## Development Options

There are two main approaches to Docker-based development:

1. **Make-based setup** - Recommended for most developers
2. **Manual Docker Compose setup** - For those who prefer more control

## 1. Using the Make-based Setup (Recommended)

This is the simplest way to get started with SpiffWorkflow development:

```sh
git clone https://github.com/sartography/spiff-arena.git
cd spiff-arena
make dev-env   # Build images and install dependencies
make start-dev # Start the development servers
```

[This video](https://youtu.be/BvLvGt0fYJU?si=0zZSkzA1ZTotQxDb) shows what you can expect from the `make` setup.

## 2. Manual Docker Compose Setup

If you prefer more control over the Docker setup, you can use Docker Compose directly:

```sh
git clone https://github.com/sartography/spiff-arena.git
cd spiff-arena

# Use the development Docker Compose files
docker compose -f docker-compose.yml \
  -f spiffworkflow-backend/dev.docker-compose.yml \
  -f spiffworkflow-frontend/dev.docker-compose.yml \
  -f connector-proxy-demo/dev.docker-compose.yml \
  -f dev.docker-compose.yml \
  build

docker compose -f docker-compose.yml \
  -f spiffworkflow-backend/dev.docker-compose.yml \
  -f spiffworkflow-frontend/dev.docker-compose.yml \
  -f connector-proxy-demo/dev.docker-compose.yml \
  -f dev.docker-compose.yml \
  up
```

For more details on using local code for Docker builds, see [Using Local Code for Docker Builds](local_docker_builds.md).

## 3. Windows Setup

* Install Docker Desktop for Windows
* Install Git for Windows
* Open PowerShell and clone the repository:

```sh
git clone https://github.com/sartography/spiff-arena.git
cd spiff-arena
```

* If you need to access the application from other machines on your network, modify the `docker-compose.yml` file to use your IP address:

```sh
SPIFFWORKFLOW_BACKEND_CONNECTOR_PROXY_URL: "${SPIFFWORKFLOW_BACKEND_CONNECTOR_PROXY_URL:-http://[YOUR_IP_ADDRESS]:8004}"
```

* Run the development setup using Make:

```sh
make dev-env
make start-dev
```

* Or if you prefer to use Docker Compose directly:

```sh
docker compose -f docker-compose.yml -f spiffworkflow-backend/dev.docker-compose.yml -f spiffworkflow-frontend/dev.docker-compose.yml -f connector-proxy-demo/dev.docker-compose.yml -f dev.docker-compose.yml up
```

## BONUS: Running your own connector proxy to create custom connections to other software and systems on your network

* Modify the following file in your spiff-arena git checkout "spiff-arena\docker-compose.yml"
* you want find the environment variable below, and change it to your ip address.
```sh
SPIFFWORKFLOW_BACKEND_CONNECTOR_PROXY_URL: "${SPIFFWORKFLOW_BACKEND_CONNECTOR_PROXY_URL:-http://[YOUR_IP_ADDRESS]:8004}"
```
* Copy the folder named connector-proxy-demo from your spiff-arena git checkout
  to a new directory - this will be YOUR connector proxy, you might create a new
git repo for it.
* Assure you have a recent version of python installed
* run pip install
* flask run -p 8004 --host=0.0.0.0 (to turn it off press CTRL + C)
* You can now create your connectors and they will show up when you edit
  services tasks and select the service you want to call.

```{tags} how_to_guide, dev_docs
```
