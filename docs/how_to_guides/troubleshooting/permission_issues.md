# Resolving Permission Issues

When working with SpiffArena, you might encounter permission-related issues, especially when dealing with the `process_models` directory. This guide will help you understand and resolve these issues.

## Common Permission Errors

### PermissionError when Adding Process Groups

One common error is:

```
PermissionError: [Errno 13] Permission denied: '/app/process_models/your-process-group-name'
```

This occurs when the application doesn't have write permissions to the `process_models` directory.

## Causes of Permission Issues

Permission issues typically occur for the following reasons:

1. **Mismatched User IDs**: The user inside the Docker container doesn't match your host user ID
2. **Incorrect Directory Ownership**: The `process_models` directory is owned by root or another user
3. **Restrictive Permissions**: The directory has restrictive permissions (e.g., 700 instead of 755)

## Solutions

### Using the Permission Fix Script

The easiest way to fix permission issues is to use the provided script:

```bash
./bin/fix-permissions.sh
```

This script:
- Creates the `process_models` directory if it doesn't exist
- Sets the correct permissions (755)
- Changes ownership to your user ID
- Updates permissions inside running containers

### Manual Fixes

If you prefer to fix the issues manually:

#### 1. Check Current Permissions

```bash
ls -la process_models
```

#### 2. Change Ownership

```bash
sudo chown -R $(id -u):$(id -g) process_models
```

#### 3. Set Correct Permissions

```bash
chmod 755 process_models
```

#### 4. Update Permissions Inside Containers

If containers are already running:

```bash
docker exec -it spiffworkflow-backend bash -c "chown -R $(id -u):$(id -g) /app/process_models"
```

## Preventing Permission Issues

To prevent permission issues:

1. Always use the provided scripts (`./bin/setup.sh`, `./bin/start.sh`) which handle permissions automatically
2. Run Docker with your user ID: `RUN_AS="$(id -u):$(id -g)" docker compose up -d`
3. Avoid creating files in the `process_models` directory as root

## How Permissions Are Handled

The project uses a centralized approach to handle permissions:

1. **Common Utilities**: The `bin/common.sh` script contains a shared function `ensure_process_models_permissions` that handles all permission-related tasks
2. **Automatic Checks**: The setup and start scripts automatically call this function
3. **Manual Fix**: The `bin/fix-permissions.sh` script provides a direct way to fix permissions when needed

## When to Restart Containers

After fixing permissions, you may need to restart the containers:

```bash
./bin/stop.sh
./bin/start.sh
```

This ensures that all services pick up the new permissions.

## Additional Resources

- [Docker Volumes and Permissions](https://docs.docker.com/storage/volumes/#permissions)
- [Linux File Permissions](https://www.linux.com/training-tutorials/understanding-linux-file-permissions/)
