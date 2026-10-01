# DevOps CI/CD Demo

[![CI/CD Pipeline](https://github.com/janeAnya/devops-ci-demo/actions/workflows/ci.yml/badge.svg)](https://github.com/janeAnya/devops-ci-demo/actions/workflows/ci.yml)

A small Next.js application demonstrating a production-oriented Continuous Integration and Continuous Delivery (CI/CD) pipeline using GitHub Actions, Docker, Docker Hub, automated testing, security auditing, dependency caching, artifacts, and multi-version Node.js testing.

## Project Overview

This project was created to demonstrate how modern DevOps practices can automate the software delivery lifecycle.

The application is a simple Next.js DevOps dashboard with a health-check API endpoint:

```text
GET /api/health

The endpoint returns the current health status of the application.

Example response:

{
  "status": "healthy",
  "service": "devops-ci-demo",
  "timestamp": "2026-10-01T12:00:00.000Z"
}
Objectives

The project demonstrates:

Continuous Integration using GitHub Actions
Automated linting and testing
Node.js matrix testing
Dependency caching
Dependency security auditing
Next.js production builds
Docker multi-stage builds
Docker Compose
Docker Hub authentication using GitHub Secrets
Automated Docker image publishing
SHA-based Docker image tagging
SBOM generation
Build provenance
GitHub Actions build artifacts
Job dependencies using needs
CI/CD monitoring through GitHub Actions
Technology Stack
Technology	Purpose
Next.js 16	Web application framework
TypeScript	Application language
Node.js 20/22	Runtime and CI matrix
ESLint	Static code analysis
Vitest	Automated testing
Docker	Application containerization
Docker Compose	Local container orchestration
GitHub Actions	CI/CD automation
Docker Hub	Container image registry
Project Structure
devops-ci-demo/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── app/
│   ├── api/
│   │   └── health/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── tests/
│   └── health.test.ts
│
├── .dockerignore
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── next.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
├── vitest.config.mts
└── README.md
CI/CD Architecture

The GitHub Actions workflow is divided into independent jobs with explicit dependencies.

                    Push / Pull Request
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
           LINT           TEST         SECURITY
                           │
                      Node 20 / 22
              │             │             │
              └─────────────┼─────────────┘
                            │
                            ▼
                          BUILD
                            │
                     Next.js Build
                            │
                    Upload Artifact
                            │
                            ▼
                    DOCKER BUILD
                            │
                     Docker Hub Login
                            │
                            ▼
                    Docker Image Push
GitHub Actions Jobs
1. Lint

The lint job:

Runs on ubuntu-latest
Installs Node.js 22
Uses npm dependency caching
Runs npm ci
Executes ESLint
npm run lint
2. Test

The test job uses a matrix strategy to test the application against multiple Node.js versions:

matrix:
  node-version: [20, 22]

Each version runs:

npm ci
npm test

This helps identify compatibility problems between supported Node.js versions.

3. Security

The security job runs:

npm audit --audit-level=high

The pipeline will fail if high-severity dependency vulnerabilities are detected.

4. Build

The build job depends on the successful completion of:

Lint
Test
Security

It then runs:

npm run build

The generated .next build output is uploaded to GitHub Actions as an artifact named:

nextjs-build
5. Docker

The Docker job runs after the build job succeeds.

It:

Authenticates with Docker Hub.
Sets up Docker Buildx.
Builds the production image.
Pushes the image to Docker Hub.
Tags the image with both latest and the Git commit SHA.
Generates build provenance.
Generates an SBOM.

Example image tags:

janeAnya/devops-ci-demo:latest
janeAnya/devops-ci-demo:<commit-sha>
Dependency Caching

The workflow uses the caching functionality provided by actions/setup-node.

with:
  node-version: 22
  cache: npm

This caches npm dependencies between workflow runs and reduces installation time.

Secrets Management

Docker Hub credentials are stored as GitHub repository secrets rather than being hard-coded in the workflow.

Required secrets:

DOCKERHUB_USERNAME
DOCKERHUB_TOKEN

The Docker Hub token is used instead of storing a Docker Hub password in the repository.

Secrets are referenced in the workflow using:

${{ secrets.DOCKERHUB_USERNAME }}
${{ secrets.DOCKERHUB_TOKEN }}

No credentials are stored in source code.

Docker

The application uses a multi-stage Dockerfile.

Build stages
Base
 │
 ├── Dependencies
 │
 ├── Builder
 │
 └── Production Runner

The builder stage compiles the Next.js application.

The final production image only contains the files required to run the application.

Next.js standalone output is enabled using:

const nextConfig: NextConfig = {
  output: "standalone",
};

The application runs inside the container as a non-root user.

Run with Docker

Build the image:

docker build -t devops-ci-demo:latest .

Run the container:

docker run -d \
  --name devops-ci-demo \
  -p 3000:3000 \
  devops-ci-demo:latest

Test the health endpoint:

curl http://localhost:3000/api/health
Run with Docker Compose

Start the application:

docker compose up --build -d

Check the running service:

docker compose ps

Test the health endpoint:

curl http://localhost:3000/api/health

Stop the application:

docker compose down
Run Locally Without Docker

Install dependencies:

npm ci

Run the development server:

npm run dev

Run linting:

npm run lint

Run tests:

npm test

Build the production application:

npm run build

Start the production application:

npm start
Testing

The project uses Vitest for automated testing.

Run:

npm test

The health API test verifies:

HTTP status
Service status
Service name
Timestamp availability
CI/CD Trigger

The workflow runs automatically on:

push:
  branches:
    - main

pull_request:
  branches:
    - main

Pull requests are validated before merging, while pushes to main run the complete pipeline and publish the Docker image when all required jobs succeed.

Deployment

The Docker image published to Docker Hub provides a portable production artifact.

A production server can pull the image using:

docker pull janeAnya/devops-ci-demo:latest

The container can then be started with:

docker run -d \
  --name devops-ci-demo \
  -p 3000:3000 \
  janeAnya/devops-ci-demo:latest

For production environments, the SHA-tagged image can be used instead of latest to ensure that a deployment references an immutable application version.

Example:

docker pull janeAnya/devops-ci-demo:<commit-sha>

This allows deployments to be traced back to the exact Git commit that produced the image.

Troubleshooting
Vitest configuration error

During development, Vitest initially failed to load because the configuration used an incompatible module entry point.

The configuration was changed from:

import { defineConfig } from "vitest";

to:

import { defineConfig } from "vitest/config";

The configuration file was also changed to:

vitest.config.mts

This explicitly uses the ES module format required by the tooling.

Docker Hub authentication

The Docker publishing workflow initially failed when Docker Hub credentials were not available to the workflow.

The issue was resolved by configuring:

DOCKERHUB_USERNAME
DOCKERHUB_TOKEN

as GitHub repository secrets.

The workflow then authenticated using docker/login-action.

Security and Supply Chain

The Docker build uses:

provenance: true
sbom: true

This provides additional supply-chain metadata for the published container image.

The CI pipeline also performs an npm dependency audit before the production build.

CI/CD Pipeline Summary
Developer
   │
   │ git push / pull request
   ▼
GitHub
   │
   ▼
GitHub Actions
   │
   ├── Lint
   │
   ├── Test
   │     ├── Node 20
   │     └── Node 22
   │
   ├── Security Audit
   │
   ├── Next.js Build
   │     └── Upload Artifact
   │
   └── Docker Build & Push
         │
         ├── Docker Hub
         ├── SHA Tag
         ├── Latest Tag
         ├── SBOM
         └── Provenance
Conclusion

This project demonstrates an automated software delivery workflow where code changes are validated through linting, multi-version testing, security auditing, and production builds before a Docker image is published to a container registry.

The pipeline provides repeatable builds, automated quality gates, dependency caching, artifact storage, containerization, and traceable Docker image versions.
EOF

