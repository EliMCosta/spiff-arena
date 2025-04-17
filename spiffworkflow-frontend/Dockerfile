# Base image to share ENV vars that activate VENV.
FROM node:22.3.0-bookworm-slim AS base

WORKDIR /app

# Minimal tools needed for the build environment
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    curl \
    procps \
    vim-tiny \
    libkrb5support0 \
    libexpat1 \
  && rm -rf /var/lib/apt/lists/*

# Optimize Node memory usage
ENV NODE_OPTIONS=--max_old_space_size=2048


######################## - DEPENDENCIES

# Layer for installing dependencies - this can be cached
FROM base AS dependencies

# Copy only dependency-related files first
COPY package.json package-lock.json /app/

# Install only production dependencies
RUN npm ci --ignore-scripts --production=false

######################## - BUILD

# Build stage
FROM dependencies AS build

# Copy the rest of the app code
COPY . /app/

# Build the app
RUN npm run build


######################## - FINAL

# Use nginx as the base image for serving
FROM nginx:1.25.4-bookworm AS production

# Install minimal required packages
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    libkrb5support0 \
    libexpat1 \
    libaom3 \
  && rm -rf /var/lib/apt/lists/*

# Remove default nginx configuration
RUN rm -rf /etc/nginx/conf.d/*

# Copy the nginx configuration file
COPY docker_build/nginx.conf.template /var/tmp

# Copy the built static files into the nginx directory
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/bin /app/bin

# Set permission for boot script
RUN chmod +x /app/bin/boot_server_in_docker

# Add health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:80/ || exit 1

CMD ["/app/bin/boot_server_in_docker"]
