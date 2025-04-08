# backend_typescript_template

![Badges](server/coverage/badges.svg)

This is a TypeScript-based backend template that follows best practices for building scalable and maintainable applications. It uses a **Model-Controller-Service-Routes** architecture for clean separation of concerns and provides development and testing scripts to streamline your workflow.
It is currently working as a Todo API

## Requirements

- Node.js (version specified in `.nvmrc`)

## Scripts

### Database Setup
- **`database.dev.sh`**: Launches a Dockerized database for development purposes.
- **`database.test.sh`**: Launches a Dockerized database for testing purposes.
  
  These scripts should be run once and will run in the background, enabling your app to interact with the database.

### Available NPM Scripts

- **`lint`**: Runs the linter to check for code style issues and errors using Biome.
  ```bash
  npm run lint
  ```

- **`lint:fix`**: Automatically fixes code style issues using Biome.
  ```bash
  npm run lint:fix
  ```

- **`lint:fix-unsafe`**: Force fixes code style issues, even if they may be unsafe (use with caution).
  ```bash
  npm run lint:fix-unsafe
  ```

- **`db:migrate`**: Runs the database migrations.
  
  You can specify one of the following actions:
  - **`up`**: Applies all pending migrations.
    ```bash
    npm run db:migrate up
    ```
  - **`down`**: Reverts the last applied migration.
    ```bash
    npm run db:migrate down
    ```
  - **`create`**: Creates a new migration file.
    ```bash
    npm run db:migrate create [filename]
    ```

- **`start`**: Builds the app, runs database migrations, and starts the application.
  ```bash
  npm run start
  ```

- **`build`**: Compiles TypeScript code and resolves path aliases.
  ```bash
  npm run build
  ```

- **`test`**: Runs tests with Mocha in a test environment, migrating the database beforehand.
  ```bash
  npm run test
  ```

- **`test:coverage`**: Runs tests with coverage tracking enabled, using NYC for reporting.
  ```bash
  npm run test:coverage
  ```

- **`coverage-badge`**: Generates a coverage badge for your project.
  ```bash
  npm run coverage-badge
  ```

- **`dev`**: Runs the application in development mode with automatic restarts using `nodemon`.
  ```bash
  npm run dev
  ```

## Project Structure

The project is divided into the following directories:

- **`/server`**: The main project folder containing the source code and tests.
  - **`/src`**: Contains all the application logic, following a **Model-Controller-Service-Routes** architecture.
  - **`/tests`**: Contains all the unit and integration tests for the application.

## Architecture

The project follows the **Model-Controller-Service-Routes** architecture:
- **Model**: Represents the data and the logic for interacting with the database.
- **Controller**: Manages the incoming HTTP requests and responses. The controllers are responsible for calling services to execute business logic.
- **Service**: Contains the core business logic. The services are responsible for interacting with models and handling the application logic.
- **Routes**: Defines the API endpoints and links each route to the corresponding controller.

## Getting Started

1. Clone this repository.
2. Copy the example `.env` and fill it with your environment-specific values:
    ```bash
    cp server/example.env server/.env
    ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up the development database:
   ```bash
   ./server/database.dev.sh
   ```
5. Run the application:
   ```bash
   npm run dev
   ```

## Environment Configuration

The `.env` file contains the following environment variables:

Certainly! Here’s the `.env` configuration represented as a table for better readability:

---

## Environment Configuration

| **Variable**         | **Description**                                   | **Example Value**      |
|----------------------|---------------------------------------------------|------------------------|
| `HOST`               | The host for the application to listen on         | `0.0.0.0`              |
| `PORT`               | The port for the application to listen on         | `5001`                 |
| `POSTGRES_PORT`      | The port for the PostgreSQL database              | `5432`                 |
| `POSTGRES_USER`      | The PostgreSQL username                           | `postgres`             |
| `POSTGRES_PASSWORD`  | The PostgreSQL password                           | `postgres`             |
| `POSTGRES_HOST`      | The host for the PostgreSQL database              | `0.0.0.0`              |
| `POSTGRES_DB`        | The name of the PostgreSQL database               | `postgres`             |
| `DATABASE_LOGGING`   | Enables or disables database logging              | `false`                |
| `JWT_SECRET`         | The secret key for signing JWT tokens             | `anysecret`            |
| `CORS_ORIGIN`        | The allowed origin for CORS                       | `*`                    |
## Testing

To set up testing, launch the Dockerized test database by running:
```bash
./database.test.sh
```

Then, run the tests:
- To run the tests without coverage:
  ```bash
  npm run test
  ```

- To run the tests with coverage tracking:
  ```bash
  npm run test:coverage
  ```
## Documentation

A Swagger file is autogenerated and can be found on the endpoint /api/api-docs/swagger/ using controllers.